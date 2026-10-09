-- ==============================================================================
-- SECRET GARDEN: SUPABASE SETUP SCRIPT
-- Run this in your Supabase Dashboard -> SQL Editor (1-click run)
-- ==============================================================================

-- 1. Create the private storage bucket "bouquet-media"
-- Setting public = false ensures no one can read or enumerate files without a signed URL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bouquet-media',
  'bouquet-media',
  false,
  52428800, -- 50 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800;

-- 2. Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow authenticated users to view/create signed URLs for bouquet-media
CREATE POLICY "Allow authenticated users to read private bouquet media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'bouquet-media');

-- 4. Policy: Allow owner (service role or authenticated user) to upload media
CREATE POLICY "Allow authenticated users to upload bouquet media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bouquet-media');

-- ==============================================================================
-- HOW TO UPLOAD YOUR MEDIA IN SUPABASE DASHBOARD:
-- 1. Go to Storage -> "bouquet-media" bucket.
-- 2. Create folders or upload directly, e.g.:
--    - little-things/sleeping-face.jpg
--    - adventure/mountains.jpg
--    - storm/rainy-voice-note.mp3
--    - whats-next/our-future-letter.mp4 (or photo)
-- 3. In `src/data/flowers.js`, update the storagePath for each flower:
--    storagePath: "adventure/mountains.jpg"
-- ==============================================================================
