import { useState, useEffect, useRef } from "react";
import { getSignedMediaUrl } from "../lib/supabaseClient";

/**
 * Custom Audio Player for voice notes with waveform, progress bar, and duration
 */
function VoiceNotePlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-sage/10 rounded-2xl p-4 mb-4 border border-sage/20">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-blush text-ink flex items-center justify-center shadow-md hover:bg-blush/90 active:scale-95 transition-all flex-shrink-0"
          aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5 fill-ink" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1.5" />
              <rect x="14" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-ink translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Track info & progress */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center text-xs text-ink/60 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-ink/30"}`} />
              voice note
            </span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          {/* Animated decorative waveform */}
          <div className="h-6 flex items-center gap-1 my-1 overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => {
              const heightMultiplier = isPlaying
                ? Math.sin(i * 0.5 + currentTime * 5) * 0.4 + 0.6
                : 0.25;
              const isActive = (i / 28) * 100 <= progressPct;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isActive ? "bg-sage" : "bg-sage/30"
                  }`}
                  style={{ height: `${Math.max(4, heightMultiplier * 20)}px` }}
                />
              );
            })}
          </div>

          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-sage/20 rounded-lg appearance-none cursor-pointer accent-sage"
          />
        </div>
      </div>
    </div>
  );
}

export default function MemoryContent({ memory }) {
  const [resolvedUrl, setResolvedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPrivateMedia() {
      if (memory.storagePath) {
        setLoading(true);
        const signed = await getSignedMediaUrl(memory.storagePath);
        if (isMounted) {
          setResolvedUrl(signed || memory.photoUrl || memory.audioUrl || memory.videoUrl);
          setLoading(false);
        }
      } else {
        setResolvedUrl(memory.photoUrl || memory.audioUrl || memory.videoUrl || null);
      }
    }

    loadPrivateMedia();
    return () => {
      isMounted = false;
    };
  }, [memory]);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3 text-ink/40">
        <div className="w-8 h-8 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
        <p className="text-xs font-serif italic">unlocking private memory...</p>
      </div>
    );
  }

  switch (memory.mediaType) {
    case "photo":
      return (
        <div className="space-y-4">
          <div className="relative group bg-white/70 p-2.5 rounded-2xl shadow-md border border-ink/5 overflow-hidden">
            {resolvedUrl ? (
              <img
                src={resolvedUrl}
                alt={memory.caption || "Garden memory"}
                className="rounded-xl w-full max-h-[55vh] object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] rounded-xl bg-sage/10 flex flex-col items-center justify-center text-ink/40 gap-2 p-6 text-center">
                <svg className="w-8 h-8 stroke-ink/30 stroke-1" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-xs">Add your photo in src/data/flowers.js or upload to Supabase</span>
              </div>
            )}
          </div>
          {memory.caption && (
            <p className="font-serif italic text-lg leading-relaxed text-ink/85 px-1 text-center">
              "{memory.caption}"
            </p>
          )}
        </div>
      );

    case "voice":
      return (
        <div className="space-y-4">
          {resolvedUrl ? (
            <VoiceNotePlayer audioUrl={resolvedUrl} />
          ) : (
            <div className="rounded-2xl bg-sage/10 p-6 text-center text-ink/40 text-sm border border-sage/20">
              <p className="font-serif italic">Voice note placeholder</p>
              <p className="text-xs mt-1 text-ink/30">Set storagePath or audioUrl in flowers.js</p>
            </div>
          )}
          {memory.caption && (
            <p className="font-serif italic text-lg leading-relaxed text-ink/85 px-1 text-center">
              "{memory.caption}"
            </p>
          )}
        </div>
      );

    case "video":
      return (
        <div className="space-y-4">
          <div className="relative bg-white/70 p-2.5 rounded-2xl shadow-md border border-ink/5 overflow-hidden">
            {resolvedUrl ? (
              <video
                controls
                playsInline
                src={resolvedUrl}
                className="rounded-xl w-full max-h-[50vh] object-cover"
              />
            ) : (
              <div className="aspect-video rounded-xl bg-sage/10 flex flex-col items-center justify-center text-ink/40 gap-2 p-6 text-center">
                <svg className="w-8 h-8 stroke-ink/30 stroke-1" fill="none" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-xs">Video placeholder — set storagePath or videoUrl in flowers.js</span>
              </div>
            )}
          </div>
          {memory.caption && (
            <p className="font-serif italic text-lg leading-relaxed text-ink/85 px-1 text-center">
              "{memory.caption}"
            </p>
          )}
        </div>
      );

    case "text":
    default:
      return (
        <div className="py-2 px-3 text-center">
          <span className="block font-serif text-3xl text-sage/40 leading-none mb-1">“</span>
          <p className="font-serif italic text-xl leading-relaxed text-ink/90">
            {memory.body}
          </p>
          <span className="block font-serif text-3xl text-sage/40 leading-none mt-1">”</span>
        </div>
      );
  }
}
