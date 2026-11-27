import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { IconInstagram } from "@/components/Icons";
import { getSettings, getActiveCategories } from "@/lib/queries";

export async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getActiveCategories()]);
  const instagram = settings.instagram?.trim();

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-lav">
      <div className="container-rr grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Link href="/" aria-label="Rocket & Rover — home">
            <Logo tone="light" showTagline size="md" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-lav/70">
            Creative toys, craft kits and space-themed activities for little
            Australian explorers. Big adventures, little explorers, endless
            imagination.
          </p>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-lav/25 px-4 py-2 text-sm font-bold text-lav transition-colors hover:bg-lav hover:text-navy"
            >
              <IconInstagram className="h-4.5 w-4.5" /> Follow us
            </a>
          ) : (
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-lav/25 px-4 py-2 text-sm font-bold text-lav/60">
              <IconInstagram className="h-4.5 w-4.5" /> Instagram coming soon
            </span>
          )}
        </div>

        <nav aria-label="Shop">
          <h3 className="font-display text-base font-semibold text-white">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm font-bold text-lav/70">
            <li>
              <Link className="transition-colors hover:text-star" href="/shop">
                Shop All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link className="transition-colors hover:text-star" href={`/shop/${c.slug}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Support">
          <h3 className="font-display text-base font-semibold text-white">Customer Support</h3>
          <ul className="mt-4 space-y-2.5 text-sm font-bold text-lav/70">
            <li><Link className="transition-colors hover:text-star" href="/contact">Contact Us</Link></li>
            <li><Link className="transition-colors hover:text-star" href="/faq">FAQs</Link></li>
            <li><Link className="transition-colors hover:text-star" href="/policies/shipping">Shipping Information</Link></li>
            <li><Link className="transition-colors hover:text-star" href="/policies/returns">Returns &amp; Refunds</Link></li>
            <li><Link className="transition-colors hover:text-star" href="/account">Order Tracking</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Stay in the loop</h3>
          <p className="mt-3 text-sm text-lav/60">
            Join the crew for new adventures and creative arrivals.
          </p>
          <div className="mt-4">
            <NewsletterForm compact />
          </div>
          <div className="mt-5 flex flex-col gap-1 text-xs font-semibold text-lav/50">
            <span>© {new Date().getFullYear()} Rocket &amp; Rover. All rights reserved.</span>
            <span>Proudly Australian. Demo store with sample products.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
