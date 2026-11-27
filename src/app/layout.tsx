import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { getSettings, getActiveCategories } from "@/lib/queries";

export const metadata: Metadata = {
  metadataBase: new URL("https://rocketandrover.com.au"),
  title: {
    default: "Rocket & Rover | Creative Space Toys, Craft Kits & Activities for Kids Australia",
    template: "%s | Rocket & Rover",
  },
  description:
    "A universe of creativity for little explorers. Space-themed craft kits, playdough cutter sets, puzzles, activity books and imaginative toys for Australian kids.",
  keywords: [
    "kids craft kits Australia",
    "children's creative activity kits",
    "space-themed toys",
    "kids painting kits",
    "playdough cutter sets",
    "children's activity books",
    "educational toys Australia",
    "space puzzles for kids",
  ],
  openGraph: {
    title: "Rocket & Rover | Big Adventures for Little Explorers",
    description:
      "Discover a universe of creativity, imagination and fun with craft kits, playful toys and space-themed activities for kids.",
    type: "website",
    locale: "en_AU",
    siteName: "Rocket & Rover",
    images: [{ url: "/images/hero.svg", width: 1200, height: 800, alt: "Rocket & Rover" }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#14234B",
  width: "device-width",
  initialScale: 1,
};

// Storefront is driven by the database (products, settings) — render on request
// so admin edits are reflected immediately.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getActiveCategories()]);

  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FBFAFF] font-body text-navy antialiased">
        <CartProvider>
          <Header
            announcement={settings.announcement ?? ""}
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          />
          <main className="min-h-[55vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
