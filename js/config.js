/* =====================================================================
   USAMA & MAHEEN — WEDDING INVITATION CONFIG
   Sab details yahan hain. Kuch bhi badalna ho to sirf is file me badlo.
   ===================================================================== */
window.WEDDING = {

  /* ---------- Couple ---------- */
  groom: {
    firstName: "Usama",
    fullName: "Usama Javed",
    relation: "Son of",
    parent: "Javed Khalid",
    photo: "images/groom.jpg",       // apni photo isi naam se images/ folder me daal do
    instagram: ""                    // optional, e.g. "https://instagram.com/username"
  },
  bride: {
    firstName: "Maheen",
    fullName: "Maheen Asghar",
    relation: "Daughter of",
    parent: "Muhammad Asghar",
    photo: "images/bride.jpg",       // apni photo isi naam se images/ folder me daal do
    instagram: ""
  },

  /* ---------- Events ----------
     date: YYYY-MM-DD   time: 24-hour HH:MM (Pakistan time)
     venue / address / mapsUrl abhi khali hain. Jab venue confirm ho, bhar do.
     Khali hon to card par "Venue details will be shared soon" nazar aayega. */
  timezone: "Asia/Karachi",
  events: [
    {
      id: "mehndi",
      title: "Mehndi",
      tagline: "An evening of music, colours & celebration",
      date: "2026-12-05",
      time: "20:00",
      durationHours: 3,
      venue: "",
      address: "",
      mapsUrl: ""
    },
    {
      id: "baraat",
      title: "Baraat",
      tagline: "The wedding day",
      date: "2026-12-06",
      time: "12:30",
      durationHours: 4,
      venue: "",
      address: "",
      mapsUrl: ""
    },
    {
      id: "walima",
      title: "Walima",
      tagline: "The reception lunch",
      date: "2026-12-07",
      time: "14:00",
      durationHours: 3,
      venue: "",
      address: "",
      mapsUrl: ""
    }
  ],

  /* ---------- Story / Diary ---------- */
  groomDiary: {
    heading: "From Usama's Diary",
    lines: [
      "Dear Diary,",
      "Some days you plan for, and some days Allah writes for you. This is one of those.",
      "I never knew peace could have a name, until Maheen. Alhamdulillah for every prayer that was answered quietly, and for every wait that turned into a blessing.",
      "Soon a new chapter begins, with her hand in mine and Allah's mercy over us. Please remember us in your duas, and join us as we turn this beautiful page."
    ],
    signature: "Usama"
  },
  brideAbout: {
    heading: "About Maheen",
    profession: "Software Engineer",
    text: "Maheen is a software engineer who builds elegant digital products for clients around the world, all from her laptop. She turns ideas into clean code, and brings that same patience, creativity and care to everything she does. Alhamdulillah, she is now ready for her most meaningful project yet: a lifetime with Usama."
  },

  /* ---------- RSVP (WhatsApp) ----------
     Country code ke saath number likho, bina + ya spaces ke.
     Example Pakistan: "923001234567". Khali rakha to RSVP section chhup jayega. */
  whatsapp: "923401690393",          // 0340 1690393
  rsvpDeadline: "",                  // optional, e.g. "28 November 2026"

  /* ---------- Gallery ----------
     Photos ko images/gallery/ me daalo aur yahan naam likho.
     Example: ["images/gallery/1.jpg", "images/gallery/2.jpg"]
     Khali list = gallery section nazar nahi aayega. */
  gallery: [
    "images/gallery/gallery-1.jpg",
    "images/gallery/gallery-3.jpg",
    "images/gallery/gallery-4.jpg",
    "images/gallery/gallery-5.jpg",
    "images/gallery/gallery-6.jpg",
    "images/gallery/gallery-2.jpg"
  ],

  /* ---------- Music (optional) ----------
     YouTube link youtu.be/XXXX ka XXXX hissa youtubeMusic me likho. Ya apni mp3 audio/ folder me daal kar music: "audio/music.mp3" likho. */
  music: "audio/music.mp3",          // tumhara mp3 (audio/ folder me)
  youtubeMusic: "",                   // YouTube ID (khali rakho, ab mp3 chal raha hai)

  /* ---------- Banner (photo ke upar wali line) ---------- */
  bannerQuote: "Two souls, one journey, and a lifetime of duas.",

  /* ---------- Closing note ---------- */
  hostFamilies: "Javed Khalid & Muhammad Asghar families"
};
