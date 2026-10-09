// ─────────────────────────────────────────────────────────────
// Flower / Memory Data Schema
//
// Every flower's `memory` object is media-flexible:
//   mediaType: "photo" | "text" | "voice" | "video"
//
// PRIVATE SUPABASE STORAGE SUPPORT:
// Set `storagePath` to the path in your private "bouquet-media" bucket
// (e.g. "adventure/our-trip.jpg"). When Supabase is configured, the app
// will automatically request a short-lived signed URL for authenticated sessions.
// If storagePath is null, it falls back to `photoUrl`, `audioUrl`, or `videoUrl`.
// ─────────────────────────────────────────────────────────────

export const flowers = [
  {
    id: 1,
    key: "seed",
    title: "The Seed",
    subtitle: "how it all began",
    botanicalName: "Sakura Blossom",
    bloomColor: "#F6D5D3",
    memory: {
      mediaType: "voice",
      storagePath: null,
      audioUrl: "/src/assets/NoNoise_2.mp3",
      caption: "Thanks to sealsoul...hehehehe...my god!!.",
    },
  },
  {
    id: 2,
    key: "little-things",
    title: "Little Things",
    subtitle: "what I notice every day",
    botanicalName: "Wild Forget-Me-Not",
    bloomColor: "#A9C7E8",
    memory: {
      mediaType: "photo",
      storagePath: null,
      photoUrl: "/src/assets/Card 1.png",
      caption: "everything about amuses me...ehhehehehe...literally everything!!!",
    },
  },
  {
    id: 3,
    key: "the-laugh",
    title: "The Laugh",
    subtitle: "our private world",
    botanicalName: "Golden Buttercup",
    bloomColor: "#F5D061",
    memory: {
      mediaType: "photo",
      storagePath:null,
      photoUrl: "/src/assets/Confession card 2.png",
      caption: "Heheheheh....everytime we laugh together...is so heavenly!!!",
    },
  },
  {
    id: 4,
    key: "the-adventure",
    title: "A message for you!",
    subtitle: "hehehehehehe",
    botanicalName: "Wild Peony",
    bloomColor: "#E8B4B8",
    memory: {
      mediaType: "photo",
      storagePath: null,
      photoUrl: "/src/assets/final2.jpeg",
      caption: "Hope you dont take everything hard on you always..pretty please!!",
    },
  },
  {
    id: 5,
    key: "the-storm",
    title: "The Storm",
    subtitle: "what we weathered together",
    botanicalName: "Rain Iris",
    bloomColor: "#9FB0C9",
    memory: {
      mediaType: "voice",
      storagePath: null,
      audioUrl: "/src/assets/NoNoise_1.mp3",
      caption: "Life isn't always sunny skies, but knowing I get to hold your hand through every thunderclap made me realize: there is no one else I'd rather stand with in the rain.",
    },
  },
  {
    id: 6,
    key: "who-you-are",
    title: "Who You Are",
    subtitle: "why I admire you",
    botanicalName: "English Heritage Rose",
    bloomColor: "#D9B8D4",
    memory: {
      mediaType: "photo",
      storagePath:null,
      photoUrl: "/src/assets/written_v1_1.jpeg",
      caption: "You are the gentlest heart and the fiercest protector of the people you love. Your empathy, your quiet courage, and the way you bring warmth into cold rooms inspires me every day. Loving you is the easiest thing I have ever done.",
    },
  },
  {
    id: 8,
    key: "the-morning",
    title: "Do you love me???",
    subtitle: "DOOO YOU???????",
    botanicalName: "Dawn Camellia",
    bloomColor: "#F7C5A8",
    memory: {
      mediaType: "photo",
      storagePath:null,
      photoUrl: "/src/assets/written_v1_2.jpeg",
      caption: "HAHAHAHHA...I know you love.",
    },
  },
  {
    id: 9,
    key: "the-quiet",
    title: "The Quiet",
    subtitle: "comfortable silence",
    botanicalName: "Lavender Cloud",
    bloomColor: "#C8B4D8",
    memory: {
      mediaType: "voice",
      storagePath:null,
      audioUrl:"/src/assets/NoNoise_3.mp3", 
      caption: "There is a particular kind of peace in sitting together without needing to fill the air with words. A book in your hands, music playing softly, both of us exactly where we want to be. That comfortable quiet is one of my favourite places in the world.",
    },
  },
  {
    id: 10,
    key: "the-promise",
    title: "The Promise",
    subtitle: "every day, on purpose",
    botanicalName: "Eternal Bloom",
    bloomColor: "#F0B8C8",
    memory: {
      mediaType: "photo",
      storagePath:null,
      photoUrl: "/src/assets/final3.jpeg",
      caption: "I choose you. Not once, not by accident — but every single day, on purpose, with my whole heart. I promise you kind words when you need honesty, laughter when you need lightness, and steady hands when the world gets heavy. Always and always.",
    },
  },
  {
    id: 7,
    key: "whats-next",
    title: "What's Next",
    subtitle: "our future together",
    botanicalName: "Grand Rose",
    bloomColor: "#F6B8CF",
    isFinal: true,
    requires: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    memory: {
      mediaType: "photo",
      storagePath: null,
      photoUrl: "/src/assets/final1.jpeg",
      caption: "This will happen soon... (I mean the photo hehehehhe)",
    },
  },
];
