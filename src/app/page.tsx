import Link from "next/link";
import { getActiveCategories, getFeaturedProducts, getSettings } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { StarField } from "@/components/StarField";
import { FadeIn } from "@/components/FadeIn";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  IconArrowRight,
  IconCheck,
  IconPalette,
  IconRocket,
  IconSparkle,
  IconTruck,
  IconInstagram,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

const EXPERIENCES = [
  {
    title: "Create & Paint",
    copy: "Plaster painting, mess-free colours and creative fun.",
    href: "/shop/arts-painting",
    image: "/images/products/crayons.svg",
  },
  {
    title: "Build & Discover",
    copy: "Kits that turn little hands into little engineers.",
    href: "/shop/make-your-own",
    image: "/images/products/rocket-kit.svg",
  },
  {
    title: "Play & Imagine",
    copy: "Creative play that sparks big, wobbly ideas.",
    href: "/shop/playdoh-creative-play",
    image: "/images/products/cutter-set.svg",
  },
  {
    title: "Explore the Universe",
    copy: "Glowing, floating, orbiting fun for every explorer.",
    href: "/shop/space-toys",
    image: "/images/products/ceiling-stickers.svg",
  },
];

const BENEFITS = [
  {
    icon: IconPalette,
    title: "Creativity & Imagination",
    copy: "Products that inspire little minds and help big ideas take off.",
    tone: "bg-lav text-cosmic",
  },
  {
    icon: IconSparkle,
    title: "Fun-Filled Adventures",
    copy: "Exciting activities that make creative play the best part of the day.",
    tone: "bg-sky text-rocket-dark",
  },
  {
    icon: IconRocket,
    title: "Something for Every Explorer",
    copy: "A growing variety of kits, toys and activities for every explorer to discover.",
    tone: "bg-cream text-star-dark",
  },
  {
    icon: IconTruck,
    title: "Easy Online Shopping",
    copy: "A simple, friendly and convenient shopping experience from start to finish.",
    tone: "bg-blush/30 text-[#B4486E]",
  },
];

const SOCIAL_IMAGES = [
  "/images/products/painting-kit.svg",
  "/images/products/cutter-set.svg",
  "/images/products/glow-puzzle.svg",
  "/images/products/crayons.svg",
  "/images/products/ceiling-stickers.svg",
  "/images/products/rocket-kit.svg",
];

export default async function HomePage() {
  const [categories, featured, settings] = await Promise.all([
    getActiveCategories(),
    getFeaturedProducts(4),
    getSettings(),
  ]);
  const instagram = settings.instagram?.trim();

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden bg-navy">
        <StarField density={44} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 80% 10%, rgba(118,84,199,0.35), transparent 60%), radial-gradient(40rem 24rem at 10% 90%, rgba(72,184,232,0.22), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="container-rr relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <FadeIn>
            <span className="chip border border-lav/25 bg-white/5 text-lav backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-star" aria-hidden="true" />
              Creative adventures from Australia
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl xl:text-[3.6rem]">
              BIG ADVENTURES
              <br />
              FOR <span className="text-star">LITTLE EXPLORERS</span>!
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-lav/80">
              Discover a universe of creativity, imagination and fun with exciting
              craft kits, playful toys and activities designed to inspire little
              minds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#explore" className="btn-accent btn-lg">
                Explore the Universe <IconArrowRight className="h-4.5 w-4.5" />
              </a>
              <Link href="/shop" className="btn-ghost-light btn-lg">
                Shop All Products
              </Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-lav/70">
              {["Craft kits", "Creative toys", "Space activities"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <IconCheck className="h-4 w-4 text-turq" /> {t}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={150} className="relative">
            <div className="relative mx-auto max-w-lg">
              <img
                src="/images/hero.svg"
                alt="Illustration of a friendly rocket and little astronaut floating among planets, stars and creative toys"
                className="w-full rounded-[2.5rem] shadow-lift"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute -left-4 -top-5 animate-float rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:-left-8">
                <p className="text-xs font-extrabold uppercase tracking-wide text-cosmic">Glowing fun</p>
                <p className="text-sm font-bold text-navy">Glow-in-the-dark goodies</p>
              </div>
              <Link
                href="/shop/space-toys"
                className="absolute -bottom-5 -right-2 animate-float-slow flex items-center gap-2 rounded-full bg-star px-4 py-2.5 text-sm font-extrabold text-navy shadow-lift transition-transform hover:scale-105 sm:-right-6"
              >
                <IconRocket className="h-4.5 w-4.5" /> Launch to space toys
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 2 — CATEGORIES */}
      <section id="explore" className="container-rr scroll-mt-24 py-16 lg:py-20">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
            Explore Your Next Adventure
          </h2>
          <p className="mt-3 text-lg text-ink/60">
            Find something exciting for every little explorer.
          </p>
        </FadeIn>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <FadeIn key={c.slug} delay={(i % 4) * 80}>
              <Link
                href={`/shop/${c.slug}`}
                className="group relative block aspect-[4/4.6] overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-semibold leading-tight text-white">
                    {c.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-lav/80">
                    {c.description}
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-extrabold text-star">
                    Shop now
                    <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SECTION 3 — FEATURED PRODUCTS */}
      <section className="bg-gradient-to-b from-lav/50 to-transparent">
        <div className="container-rr py-16 lg:py-20">
          <FadeIn className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
                Mission: Find Something Fun!
              </h2>
              <p className="mt-3 text-lg text-ink/60">
                Discover exciting activities and creative treasures for your next
                adventure.
              </p>
            </div>
            <Link href="/shop" className="btn-ghost btn-md shrink-0">
              View all products <IconArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
          <FadeIn delay={120} className="mt-9">
            <ProductGrid products={featured} enableQuickView={false} />
          </FadeIn>
        </div>
      </section>

      {/* SECTION 4 — BRAND STORY */}
      <section className="container-rr py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <FadeIn className="relative order-2 lg:order-1">
            <img
              src="/images/about.svg"
              alt="Two children happily painting plaster space figurines under a starry sky"
              loading="lazy"
              className="w-full rounded-[2.5rem] shadow-lift"
            />
            <div className="absolute -bottom-5 left-6 animate-float rounded-2xl bg-white px-5 py-3.5 shadow-lift">
              <p className="font-display text-lg font-semibold text-cosmic">Est. with love in Australia</p>
              <p className="text-xs font-bold text-ink/50">For little hands &amp; big imaginations</p>
            </div>
          </FadeIn>
          <FadeIn delay={120} className="order-1 lg:order-2">
            <span className="chip bg-lav text-cosmic">Our story</span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
              SMALL HANDS.
              <br />
              BIG IMAGINATIONS.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              At Rocket &amp; Rover, we believe every little explorer deserves a
              universe of possibilities. We're passionate about bringing together
              fun, creativity and imaginative play through a collection of exciting
              toys, craft kits and activities.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              From painting planets to building creative masterpieces, our goal is
              to make every playtime an opportunity to discover something new.
            </p>
            <Link href="/about" className="btn-primary btn-lg mt-8">
              Discover Our Story <IconArrowRight className="h-4.5 w-4.5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 5 — CREATIVE PLAY PROMOTION */}
      <section className="container-rr pb-16 lg:pb-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cosmic via-navy to-navy-deep px-6 py-14 shadow-lift sm:px-12">
            <StarField density={28} />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  LET THEIR IMAGINATION <span className="text-star">TAKE FLIGHT</span>!
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-lav/80">
                  From colourful craft projects to exciting space adventures,
                  discover activities that turn ordinary playtime into something
                  special.
                </p>
                <Link href="/shop/craft-kits" className="btn-accent btn-lg mt-8">
                  Explore Craft Kits <IconArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
              <div className="relative mx-auto hidden w-full max-w-xs lg:block">
                <img
                  src="/images/products/painting-kit.svg"
                  alt="Space adventure plaster painting kit with paints"
                  loading="lazy"
                  className="animate-wiggle rounded-3xl shadow-lift"
                />
                <span className="absolute -right-4 -top-4 animate-float rounded-full bg-star px-4 py-2 font-display text-sm font-semibold text-navy shadow-lift">
                  Paint your own planet!
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* SECTION 6 — SHOP BY EXPERIENCE */}
      <section className="container-rr pb-16 lg:pb-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
            Shop by Experience
          </h2>
          <p className="mt-3 text-lg text-ink/60">
            What kind of adventure are you after today?
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((x, i) => (
            <FadeIn key={x.title} delay={i * 80}>
              <Link
                href={x.href}
                className="group relative block aspect-[4/4.4] overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <img
                  src={x.image}
                  alt={x.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/90 via-navy/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-semibold text-white">{x.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-lav/85">{x.copy}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-star">
                    Discover
                    <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SECTION 7 — WHY SHOP WITH US */}
      <section className="bg-lav/40">
        <div className="container-rr py-16 lg:py-20">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
              Why Little Explorers Love Us
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 80}>
                <div className="card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${b.tone}`}>
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{b.copy}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — NEWSLETTER */}
      <section className="container-rr py-16 lg:py-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-cream px-6 py-12 shadow-soft sm:px-12">
            <svg className="absolute -left-8 -top-8 h-40 w-40 text-star/40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z" />
            </svg>
            <svg className="absolute -bottom-6 -right-6 h-32 w-32 text-cosmic/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
                Join the Rocket &amp; Rover Crew!
              </h2>
              <p className="mt-3 text-lg text-ink/60">
                Be the first to discover new adventures, creative activities and
                exciting arrivals.
              </p>
              <div className="mx-auto mt-7 max-w-xl text-left">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* SECTION 9 — UNIVERSE OF FUN (reviews appear here as they arrive) */}
      <section className="relative overflow-hidden bg-navy py-16 lg:py-20">
        <StarField density={30} />
        <div className="container-rr relative text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              A Universe of Fun Awaits
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-lav/75">
              Real customer reviews will land here as our first adventures reach
              little explorers across Australia. Follow along as the Rocket &amp;
              Rover community grows — and start your own adventure today.
            </p>
            <Link href="/shop" className="btn-accent btn-lg mt-8">
              Start Exploring <IconArrowRight className="h-4.5 w-4.5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 10 — SOCIAL */}
      <section className="container-rr py-16 lg:py-20">
        <FadeIn className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
              Follow Our Adventures
            </h2>
            <p className="mt-3 max-w-xl text-lg text-ink/60">
              A peek at the creative universe we're building — coming right up to
              your feed.
            </p>
          </div>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost btn-md shrink-0"
            >
              <IconInstagram className="h-4.5 w-4.5" /> Follow on Instagram
            </a>
          ) : (
            <span className="chip shrink-0 bg-lav text-cosmic">Instagram launching soon</span>
          )}
        </FadeIn>
        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SOCIAL_IMAGES.map((src, i) => (
            <FadeIn key={src + i} delay={i * 60}>
              <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft">
                <img
                  src={src}
                  alt="Rocket & Rover space-themed creative product preview"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all duration-300 group-hover:bg-navy/40 group-hover:opacity-100">
                  <IconInstagram className="h-7 w-7 text-white" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
