/* Seed the Rocket & Rover store with categories, sample products and default settings.
   Run with: npx -y tsx src/db/seed.ts */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categories, products, siteSettings } from "./schema";

const url =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool);

const categoryDefs = [
  {
    slug: "craft-kits",
    name: "Craft Kits",
    description: "Plaster painting kits, make-your-own sets and creative activity bundles.",
    image: "/images/products/painting-kit.jpg",
    sortOrder: 1,
  },
  {
    slug: "playdoh-creative-play",
    name: "Play-Doh & Creative Play",
    description: "Space cutter sets and modelling accessories for squishy, creative fun.",
    image: "/images/products/cutter-set.jpg",
    sortOrder: 2,
  },
  {
    slug: "puzzles-games",
    name: "Puzzles & Games",
    description: "Space puzzles, glow-in-the-dark challenges and educational games.",
    image: "/images/products/glow-puzzle.jpg",
    sortOrder: 3,
  },
  {
    slug: "arts-painting",
    name: "Arts & Painting",
    description: "Mess-free painting, crayons and colourful creative accessories.",
    image: "/images/products/crayons.jpg",
    sortOrder: 4,
  },
  {
    slug: "books-activities",
    name: "Books & Activities",
    description: "Activity books, colouring fun and creative learning adventures.",
    image: "/images/products/activity-book.jpg",
    sortOrder: 5,
  },
  {
    slug: "space-toys",
    name: "Space-Themed Toys",
    description: "Glow-in-the-dark stickers, rocket toys and astronaut wonders.",
    image: "/images/products/ceiling-stickers.jpg",
    sortOrder: 6,
  },
  {
    slug: "make-your-own",
    name: "Make Your Own Kits",
    description: "Build, create and discover with hands-on make-your-own kits.",
    image: "/images/products/rocket-kit.jpg",
    sortOrder: 7,
  },
  {
    slug: "dress-up",
    name: "Dress-Up & Costumes",
    description: "Space costumes, astronaut outfits and imaginative play accessories.",
    image: "/images/products/costume.jpg",
    sortOrder: 8,
  },
];

type ProductDef = {
  slug: string;
  name: string;
  category: string;
  short: string;
  description: string;
  included: string;
  details: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  stockQty: number;
  available: boolean;
  isNew: boolean;
  isFeatured: boolean;
  image: string;
  keywords: string;
};

const productDefs: ProductDef[] = [
  {
    slug: "space-adventure-plaster-painting-kit",
    name: "Space Adventure Plaster Painting Kit",
    category: "craft-kits",
    short:
      "Paint your own rocket, astronaut and planet! A creative activity set with space-themed plaster figures, paint pots and a brush.",
    description:
      "Blast off into creative play with the Space Adventure Plaster Painting Kit. Unpack a friendly rocket, a round little astronaut and a striped planet — all waiting to be brought to life with pots of colourful paint.\n\nA perfect little mission for budding artists: squeeze, swirl, paint and watch an imaginary universe come to life on the table. Once painted, the plaster figures make charming keepsakes or play pieces for space adventures.",
    included:
      "1× Rocket plaster figure\n1× Astronaut plaster figure\n1× Planet plaster figure\n6× Coloured paint pots\n1× Paintbrush\n1× Activity instruction card",
    details: "",
    priceCents: 3495,
    compareAtPriceCents: 4495,
    stockQty: 12,
    available: true,
    isNew: true,
    isFeatured: true,
    image: "/images/products/painting-kit.jpg",
    keywords: "plaster painting kit, paint figures, craft kit, space art, kids painting kit",
  },
  {
    slug: "mini-moon-mars-plaster-set",
    name: "Mini Moon & Mars Plaster Figures (Set of 3)",
    category: "craft-kits",
    short:
      "Three tiny plaster space buddies ready to be painted — a mini version of our favourite plaster painting adventure.",
    description:
      "A pocket-sized version of the full painting kit: three little plaster space buddies in one mini set. Great as a gift add-on, a party favour or a quick creative mission between bigger projects.\n\nPaint them bright, paint them glowy, or keep them chalky white like real moon rocks. Up to you, Commander.",
    included: "3× Mini plaster space figures\n1× Small paint pot",
    details: "",
    priceCents: 2195,
    stockQty: 8,
    available: true,
    isNew: false,
    isFeatured: false,
    image: "/images/products/painting-kit.jpg",
    keywords: "plaster figures, mini painting, gift, party favour, craft",
  },
  {
    slug: "outer-space-cutter-set",
    name: "Outer Space Cutter Set",
    category: "playdoh-creative-play",
    short:
      "Five space-inspired cutters — shooting star, planet, ringed Saturn, astronaut helmet and flying saucer — for squishy creative play.",
    description:
      "Turn squish time into space time! The Outer Space Cutter Set includes five chunky, easy-grip cutters shaped like a shooting star, a striped planet, a ringed Saturn, an astronaut helmet and a friendly flying saucer.\n\nPress, twist and build little space scenes out of modelling clay or playdough (sold separately). A great little set for creative play, gift bags and early shape recognition.",
    included:
      "1× Shooting star cutter\n1× Planet cutter\n1× Ringed planet cutter\n1× Astronaut helmet cutter\n1× Flying saucer cutter",
    details: "",
    priceCents: 2495,
    stockQty: 20,
    available: true,
    isNew: false,
    isFeatured: true,
    image: "/images/products/cutter-set.jpg",
    keywords: "playdough cutter set, modelling clay tools, cookie cutters, squish play",
  },
  {
    slug: "glow-in-the-dark-space-puzzle",
    name: "Glow-in-the-Dark Space Puzzle (100 Pieces)",
    category: "puzzles-games",
    short:
      "A 100-piece space puzzle with planets, rockets and astronauts that glows in the dark for extra cosmic magic.",
    description:
      "Assemble your own universe — then switch off the lights! This 100-piece space puzzle features planets, rockets and astronauts in a classic glow-in-the-dark design, so the finished picture comes alive in the dark.\n\nPerfect for rainy days, quiet time and little astronomers-in-training. A fun, screen-free mission for the whole family.",
    included: "100× Puzzle pieces\n1× Assembly guide card",
    details: "",
    priceCents: 2995,
    compareAtPriceCents: 3995,
    stockQty: 10,
    available: true,
    isNew: true,
    isFeatured: true,
    image: "/images/products/glow-puzzle.jpg",
    keywords: "space puzzle for kids, glow in the dark, 100 piece puzzle, family puzzle",
  },
  {
    slug: "solar-system-wooden-puzzle",
    name: "Solar System Wooden Puzzle (54 Pieces)",
    category: "puzzles-games",
    short:
      "A sturdy 54-piece wooden puzzle of the solar system — match the planets and learn the order of the universe.",
    description:
      "From tiny Mercury to giant Jupiter, this 54-piece wooden puzzle puts the whole solar system in little hands. Sturdy pieces make it a joy to piece together (and re-piece!), and the finished picture makes a brilliant conversation starter about our cosmic neighbourhood.",
    included: "54× Wooden puzzle pieces",
    details: "",
    priceCents: 2695,
    stockQty: 6,
    available: true,
    isNew: false,
    isFeatured: false,
    image: "/images/products/glow-puzzle.jpg",
    keywords: "wooden puzzle, solar system, educational, planets, learning toy",
  },
  {
    slug: "little-astronaut-activity-book",
    name: "Little Astronaut Activity Book",
    category: "books-activities",
    short:
      "Space-themed creative and educational activities — colouring, mazes, dot-to-dots and planet facts for curious explorers.",
    description:
      "A whole mission pack of activities in one book: colouring pages, mazes, dot-to-dots, spot-the-difference and friendly planet facts. Designed for little explorers who want to learn while they play, with plenty of room to get creative.\n\nA brilliant travel companion, quiet-time activity or rainy-day adventure.",
    included: "1× Activity book (sample content — final page count to be confirmed)",
    details: "",
    priceCents: 1695,
    stockQty: 25,
    available: true,
    isNew: true,
    isFeatured: true,
    image: "/images/products/activity-book.jpg",
    keywords: "children's activity book, colouring book, space activities, travel activity",
  },
  {
    slug: "galaxy-colouring-sticker-pack",
    name: "Galaxy Colouring & Sticker Pack",
    category: "books-activities",
    short:
      "Colouring sheets plus sheets of galaxy stickers for decorating, playing and celebrating every mission complete.",
    description:
      "Colour the planets, then make them shine! This pack pairs colourful space colouring sheets with sticker sheets full of rockets, stars and astronauts — perfect for decorating a room, a journal or the side of a lunchbox.\n\nA small, sweet gift that keeps the creative fun going.",
    included: "Colouring sheets + sticker sheets (final contents to be confirmed)",
    details: "",
    priceCents: 1495,
    stockQty: 0,
    available: true,
    isNew: false,
    isFeatured: false,
    image: "/images/products/activity-book.jpg",
    keywords: "sticker pack, colouring, galaxy, gift, kids",
  },
  {
    slug: "glow-in-the-dark-ceiling-stickers",
    name: "Glow-in-the-Dark Ceiling Sticker Pack",
    category: "space-toys",
    short:
      "Turn any bedroom into a planetarium with glow-in-the-dark rockets, planets, stars and astronaut ceiling stickers.",
    description:
      "The fastest way to a space-themed bedroom! This pack of glow-in-the-dark stickers features rockets, planets, stars, moons and a little astronaut — peel, stick and hang up above the bed for a ceiling full of constellations.\n\nGlow charges with light, then shines softly in the dark. Great for bedrooms, playrooms and above the highchair.",
    included: "Multiple glow-in-the-dark sticker sheets (final design to be confirmed)",
    details: "",
    priceCents: 1995,
    stockQty: 14,
    available: true,
    isNew: true,
    isFeatured: false,
    image: "/images/products/ceiling-stickers.jpg",
    keywords: "ceiling stickers, glow in the dark, bedroom decor, planetarium, nursery",
  },
  {
    slug: "planet-crayons-colouring-bundle",
    name: "Planet Crayons & Colouring Bundle",
    category: "arts-painting",
    short:
      "Chunky space-shaped crayons in a tin, plus colouring pages of planets and rockets for bold, happy colouring.",
    description:
      "Crayons shaped like planets and stars in a reusable tin — and a stack of colouring pages waiting to be filled with colour. Chunky shapes are easy for small hands to grip, and the tin keeps everything tidy.\n\nA cheerful starter bundle for every budding artist of the universe.",
    included: "Crayons in tin + colouring pages (final counts to be confirmed)",
    details: "",
    priceCents: 1895,
    stockQty: 18,
    available: true,
    isNew: true,
    isFeatured: false,
    image: "/images/products/crayons.jpg",
    keywords: "crayons, colouring, art supplies, kids painting, space crayons",
  },
  {
    slug: "mess-free-space-paint-set",
    name: "Mess-Free Space Paint Set",
    category: "arts-painting",
    short:
      "Creative painting with less of the mess — a space-themed set designed to keep hands (and tables) happier.",
    description:
      "All the joy of painting, minus some of the chaos. This mess-free space paint set is designed for creative play at the kitchen table, with easy-clean pots and space-themed stencils and cards.\n\nFinal contents and materials to be confirmed by the supplier.",
    included: "",
    details: "",
    priceCents: 2395,
    stockQty: 3,
    available: true,
    isNew: false,
    isFeatured: false,
    image: "/images/products/crayons.jpg",
    keywords: "mess free painting, paint set, stencils, creative play, kids art",
  },
  {
    slug: "build-your-own-paper-rocket-kit",
    name: "Build Your Own Paper Rocket Kit",
    category: "make-your-own",
    short:
      "Pre-cut cardboard parts, a glue stick and simple steps — build your own colourful paper rocket in an afternoon.",
    description:
      "No tools, no fuss — just cut, fold, glue and GO. The Build Your Own Paper Rocket Kit includes pre-cut cardboard pieces and a glue stick, with easy-to-follow steps that let kids build a real life-size paper rocket they can decorate and display.\n\nA brilliant build-and-discover mission for little engineers.",
    included:
      "Pre-cut cardboard rocket parts\n1× Glue stick\n1× Step-by-step instruction card",
    details: "",
    priceCents: 2295,
    stockQty: 9,
    available: true,
    isNew: false,
    isFeatured: false,
    image: "/images/products/rocket-kit.jpg",
    keywords: "paper rocket, build your own, cardboard craft kit, STEM, engineering play",
  },
  {
    slug: "little-astronaut-dress-up-costume",
    name: "Little Astronaut Dress-Up Costume",
    category: "dress-up",
    short:
      "A comfy white-and-grey astronaut jumpsuit with matching helmet for imaginative space adventures at home.",
    description:
      "Suit up, astronaut! This dress-up costume features a soft white and grey jumpsuit with red accents and a matching round helmet, ready for moon walks, rocket launches and backyard missions.\n\nPerfect for play, parties and photos — final sizes and fabric details to be confirmed.",
    included: "Jumpsuit + helmet (sizes to be confirmed)",
    details: "",
    priceCents: 4995,
    compareAtPriceCents: 5995,
    stockQty: 7,
    available: true,
    isNew: false,
    isFeatured: false,
    image: "/images/products/costume.jpg",
    keywords: "astronaut costume, kids dress up, space outfit, party, costume",
  },
];

const settingsDefs: Record<string, string> = {
  announcement: "Welcome to Rocket & Rover — Big Adventures for Little Explorers!",
  contact_email: "hello@rocketandrover.com.au",
  contact_phone: "To be confirmed",
  contact_address: "Somewhere in Australia — address to be confirmed",
  instagram: "",
  shippingRateCents: "995",
  freeShipThresholdCents: "0",
};

async function main() {
  const existing = await db.select({ id: categories.id }).from(categories);
  if (existing.length > 0) {
    console.log("Database already seeded (categories exist). Skipping.");
    await pool.end();
    return;
  }

  const catIds: Record<string, number> = {};
  for (const c of categoryDefs) {
    const rows = await db
      .insert(categories)
      .values({ ...c, active: true })
      .returning({ id: categories.id });
    catIds[c.slug] = rows[0].id;
  }

  for (const p of productDefs) {
    await db.insert(products).values({
      slug: p.slug,
      name: p.name,
      shortDescription: p.short,
      description: p.description,
      categoryId: catIds[p.category],
      priceCents: p.priceCents,
      compareAtPriceCents: p.compareAtPriceCents ?? null,
      stockQty: p.stockQty,
      available: p.available,
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      sampleData: true,
      images: [p.image],
      whatsIncluded: p.included,
      productDetails: p.details,
      keywords: p.keywords,
    });
  }

  for (const [key, value] of Object.entries(settingsDefs)) {
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }

  // Verify
  const count = await db.select({ id: products.id }).from(products);
  console.log(`Seeded ${Object.keys(catIds).length} categories, ${count.length} products, ${Object.keys(settingsDefs).length} settings.`);
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
