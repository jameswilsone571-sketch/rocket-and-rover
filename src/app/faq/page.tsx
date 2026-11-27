import type { Metadata } from "next";
import Link from "next/link";
import { IconChevronDown } from "@/components/Icons";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about ordering, shipping, returns and payment at Rocket & Rover.",
};

type Faq = { q: string; a: string; confirmed?: boolean };

const FAQS: Faq[] = [
  {
    q: "How do I place an order?",
    a: "Browse the shop, add your favourite adventures to the cart, then head to checkout. Fill in your details and press Place Order — it takes less than two minutes. You don't need an account; guest checkout is supported.",
    confirmed: true,
  },
  {
    q: "What payment methods do you accept?",
    a: "We're still connecting our payment provider (such as Stripe or PayPal), so payment options will be added at launch. Until then, orders are saved as pending payment and you'll be contacted by email with payment and delivery instructions.",
  },
  {
    q: "Where do you ship?",
    a: "Rocket & Rover ships within Australia. We're planning our domestic shipping setup now — international shipping may follow once the business grows.",
  },
  {
    q: "How much does shipping cost?",
    a: "Shipping rates are being finalised and will be shown at checkout. The current checkout shows a sample rate clearly marked as to be confirmed.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order has been placed, visit the My Account / Order Tracking page and enter the email you ordered with to view your orders and their status.",
    confirmed: true,
  },
  {
    q: "Can I change or cancel an order?",
    a: "Please contact us as soon as possible with your order number and we'll do our best to help before your order is processed.",
  },
  {
    q: "What is your returns policy?",
    a: "Our returns and refunds policy is currently a draft and will be published in full once confirmed by the business team. Please check the Returns & Refunds page for the latest version.",
  },
  {
    q: "How can I contact Rocket & Rover?",
    a: "Use the contact form on our Contact Us page, or email us directly — we'll get back to you as soon as we can.",
    confirmed: true,
  },
];

export default function FaqPage() {
  return (
    <div className="container-rr max-w-3xl py-12 lg:py-16">
      <header className="text-center">
        <h1 className="font-display text-4xl font-semibold text-navy sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink/60">
          Everything you need to know about shopping with Rocket &amp; Rover.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {FAQS.map((f) => (
          <details key={f.q} className="rr-acc card group overflow-hidden px-5 py-1">
            <summary className="flex items-center justify-between gap-4 py-4 font-display text-lg font-semibold text-navy">
              <span className="flex items-center gap-3">
                {f.q}
                {!f.confirmed && (
                  <span className="chip bg-cream text-star-dark hidden sm:inline-flex">
                    Draft answer
                  </span>
                )}
              </span>
              <IconChevronDown className="rr-acc-chevron h-5 w-5 shrink-0 text-cosmic" />
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-ink/70">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="card mt-10 p-6 text-center sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">Still curious?</h2>
        <p className="mt-2 text-ink/60">
          We'd love to help with anything else — just say hello.
        </p>
        <Link href="/contact" className="btn-accent btn-md mt-5">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
