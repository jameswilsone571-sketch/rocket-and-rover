import type { Metadata } from "next";
import Link from "next/link";
import { StarField } from "@/components/StarField";
import { FadeIn } from "@/components/FadeIn";
import { IconArrowRight, IconPalette, IconRocket, IconSparkle } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Rocket & Rover — an Australian children's creative toys brand built around space-themed adventures, craft kits and imaginative play.",
};

const VALUES = [
  {
    icon: IconSparkle,
    title: "Curiosity First",
    copy: "Every product starts with a question: what if? We love the moment a child discovers something new and their eyes light up.",
    tone: "bg-lav text-cosmic",
  },
  {
    icon: IconPalette,
    title: "Creative Play",
    copy: "Painting, crafting, building and imagining are how little minds learn. We put creativity at the centre of every adventure.",
    tone: "bg-sky text-rocket-dark",
  },
  {
    icon: IconRocket,
    title: "Made with Care",
    copy: "As a young Australian brand, we're building something special — thoughtfully chosen products for families, with a big universe of plans ahead.",
    tone: "bg-cream text-star-dark",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy">
        <StarField density={30} />
        <div className="container-rr relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <FadeIn>
            <span className="chip border border-lav/25 bg-white/5 text-lav">About Rocket &amp; Rover</span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              BIG ADVENTURES.
              <br />
              LITTLE EXPLORERS.
              <br />
              <span className="text-star">ENDLESS IMAGINATION.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-lav/80">
              Welcome to Rocket &amp; Rover, where little imaginations go on big
              adventures! From creative craft kits and exciting puzzles to colourful
              activities and imaginative play, Rocket &amp; Rover brings together
              products designed to inspire curiosity, creativity and fun.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-lav/80">
              Whether little explorers are painting their own planets, creating space
              adventures or discovering something new, there's always another
              adventure waiting.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <img
              src="/images/hero.svg"
              alt="Friendly rocket and astronaut floating through a colourful starfield"
              className="mx-auto w-full max-w-md rounded-[2.5rem] shadow-lift"
            />
          </FadeIn>
        </div>
      </section>

      <section className="container-rr py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <img
              src="/images/about.svg"
              alt="Children painting plaster space figurines at a craft table"
              loading="lazy"
              className="w-full rounded-[2.5rem] shadow-lift"
            />
          </FadeIn>
          <FadeIn delay={120}>
            <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
              Our Story So Far
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Rocket &amp; Rover was created with one simple belief: children don't
              need screens to have a great time — they need a paintbrush, a puzzle,
              a rocket to build and a whole lot of imagination.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              We're a new Australian family of creative products — space-themed craft
              kits, modelling accessories, puzzles, activity books, glow-in-the-dark
              wonders and imaginative dress-up — all brought together under one
              friendly sky.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              Our range is just taking off, and we can't wait to explore more
              creative corners of the universe with you.
            </p>
            <Link href="/shop" className="btn-primary btn-lg mt-8">
              Explore the Range <IconArrowRight className="h-4.5 w-4.5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="bg-lav/40">
        <div className="container-rr py-16 lg:py-20">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
              What We Believe
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 100}>
                <div className="card h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${v.tone}`}>
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-navy">{v.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-ink/65">{v.copy}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="container-rr py-16 text-center lg:py-20">
        <FadeIn>
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
            Ready for your next adventure?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-ink/60">
            The universe of creativity is waiting. Start exploring today.
          </p>
          <Link href="/shop" className="btn-accent btn-lg mt-8">
            Shop All Products <IconArrowRight className="h-4.5 w-4.5" />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
