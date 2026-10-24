// All invitation wording, names, dates, venues, links and file paths live here.
// Edit these values and the site (including the page title and WhatsApp preview) updates.

// The bride's name comes first everywhere.
const bride = {
  fullName: 'Naseeha Fathima',
  shortName: 'Naseeha',
  parents: 'Abdul Kalam',
};

const groom = {
  fullName: 'Mohamed Ibrahim',
  shortName: 'Ibrahim',
  parents: 'Abdul Azees',
};

const nikkah = {
  name: 'Nikkah',
  day: 'Thursday',
  date: 'December 24, 2026',
  time: '5:00 PM',
  venue: "Bride's Residence",
  mapUrl: 'https://maps.app.goo.gl/TaLwXQfBfiBV9ZyV6',
};

const valima = {
  name: 'Valima',
  day: 'Friday',
  date: 'December 25, 2026',
  time: 'Lunch 1:00 PM',
  venue: "Groom's Residence",
  mapUrl: 'https://maps.app.goo.gl/ymDG8mRnvQpiKvnw5',
};

const couple = `${bride.shortName} & ${groom.shortName}`;

const art = {
  tapScene: '/art/tap-scene.jpg',
  curtains: '/art/curtains.jpg',
  archWall: '/art/arch-wall.jpg',
  stage: '/art/stage.jpg',
  garland: '/art/garland.jpg',
  scratchFrame: '/art/scratch-frame.jpg',
  introFilm: '/art/intro.mp4', // falls back to animated stills if this file is missing
};

const config = {
  bride,
  groom,
  couple,
  art,

  // Optional background music, e.g. '/music/song.mp3' (file in public/). Leave empty for none.
  music: {
    src: '',
    playLabel: 'Play music',
    pauseLabel: 'Pause music',
  },

  // Browser tab title and WhatsApp link preview.
  share: {
    title: `${couple} · Nikkah`,
    description: `${nikkah.day}, ${nikkah.date} · ${nikkah.venue}`,
    image: art.stage,
    // The live site address, e.g. 'https://example.com'. WhatsApp needs it to show the image.
    siteUrl: '',
  },

  tap: {
    label: 'tap to open',
  },

  hero: {
    bismillah: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    requestLines: ['We request the honour of your', 'presence at the Nikkah of'],
    daughterOf: 'Daughter of',
    ampersand: '&',
    sonOf: 'Son of',
    closingLines: ['As they begin their forever in', 'faith and love.'],
    scroll: 'Scroll',
  },

  blessed: {
    heading: 'A Blessed Beginning',
    text:
      'With hearts full of gratitude, we warmly invite you to join us as we celebrate this beautiful beginning with the love, prayers, and blessings of our families.',
  },

  scratchDate: {
    kicker: 'A date to hold close',
    heading: 'Scratch to Reveal',
    revealedHeading: 'Our forever begins',
    foilLabel: 'Scratch to reveal the date',
    invited: "You're invited!",
    date: nikkah.date,
    when: `${nikkah.day} • ${nikkah.time}`,
  },

  festivities: {
    kicker: 'The festivities',
    heading: 'Days filled with joy',
    mapsLabel: 'View on Google Maps',
    events: [nikkah, valima].map((e) => ({ ...e, when: [e.date, e.time] })),
  },

  hearts: {
    kicker: 'With all our hearts',
    scriptLines: ['Two souls. One heart.', "One promise. Forever in God's love."],
    text: 'Your love, blessings, and presence are the greatest gifts we could ever ask for.',
  },

  venue: {
    kicker: 'The venue',
    photo: '', // optional, e.g. '/art/venue.jpg'
    name: nikkah.venue,
    detail: [`${nikkah.day}, ${nikkah.date}`, nikkah.time],
    mapUrl: nikkah.mapUrl,
    mapsLabel: 'View on Google Maps',
  },
};

export default config;
