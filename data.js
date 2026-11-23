/* Abalone Queen — the pieces currently for sale on Etsy.
   Each line is one piece. To add one: copy a line, give it the next id, and save its photos as
   assets/etsy/cut/<id>.webp (cut-out) and assets/etsy/thumb/<id>-<photo>.jpg (the photograph).
   To take a sold piece off the site, delete its line.
   The older pieces from the previous website are kept, unused, in data-archive-old-website.js. */

const ETSY = "https://www.etsy.com/shop/AbaloneQueen";

const PIECES = [
  { id: "s01", photo: 1, kind: "Necklace", name: "Abalone Queen",             title: "Abalone Queen Necklace",                                              listing: "4602456181/abalone-queen-necklace" },
  { id: "s02", photo: 2, kind: "Necklace", name: "Heavenly Plume",            title: "Heavenly Plume Agate and Pearl Necklace: Cloud Agate Pendant",       listing: "4576882976/heavenly-plume-agate-and-pearl-necklace" },
  { id: "s09", photo: 2, kind: "Necklace", name: "Aurora Opal",               title: "Aurora Opal Necklace",                                                listing: "4598207663/aurora-opal-necklace" },
  { id: "s03", photo: 2, kind: "Earrings", name: "Aurora",                    title: "Aurora marcasite and amethyst earrings",                             listing: "4577482052/aurora-marcasite-and-amethyst-earrings" },
  { id: "s06", photo: 1, kind: "Necklace", name: "Vintage Coral",             title: "Abalone and Vintage Coral Necklace",                                 listing: "4576903178/abalone-and-vintage-coral-necklace" },
  { id: "s04", photo: 2, kind: "Necklace", name: "Lapis and Kyanite",         title: "Sterling Silver Lapis and Kyanite Pendant with Chrysocolla Beads",   listing: "4579788483/sterling-silver-lapis-and-kyanite" },
  { id: "s05", photo: 1, kind: "Earrings", name: "Kyanite Plume",             title: "Kyanite Plume Agate Drop Earrings: Sterling Silver",                 listing: "4576895347/kyanite-plume-agate-drop-earrings" },
  { id: "s07", photo: 3, kind: "Necklace", name: "Cloud and Teardrop",        title: "Abalone Cloud and Teardrop Pendant Necklace",                        listing: "4576743207/abalone-cloud-and-teardrop-pendant" },
  { id: "s08", photo: 2, kind: "Earrings", name: "Abalone, Pearl and Silver", title: "Abalone, Pearl and Silver earrings",                                 listing: "4598997067/abalone-pearl-and-silver-earrings" },
  { id: "s10", photo: 2, kind: "Earrings", name: "Opalized Wood",             title: "Opalized Wood Sterling Silver Earrings: 18k & 14k Gold Accents",     listing: "1802015812/opalized-wood-sterling-silver-earrings" },
  { id: "s12", photo: 2, kind: "Necklace", name: "Amethyst and Peacock Pearl", title: "Abalone Pendant Necklace: Amethyst, Peacock Pearl, 14k Gold Fill",  listing: "1821867389/abalone-pendant-necklace-amethyst" },
  { id: "s11", photo: 1, kind: "Necklace", name: "Beach Glass",               title: "Handmade Beach Glass Necklace: Italian Coral & Sterling Silver",     listing: "1802873071/handmade-beach-glass-necklace-italian" },
];

/* the pieces shown one to a screen at the top, in this order */
const RUNWAY = ["s01", "s02", "s09", "s03", "s06"];
