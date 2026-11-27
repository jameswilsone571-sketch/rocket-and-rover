import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconChevronDown } from "@/components/Icons";

type PolicySection = { title: string; body: string };
type Policy = { title: string; intro: string; sections: PolicySection[] };

const POLICIES: Record<string, Policy> = {
  shipping: {
    title: "Shipping Information",
    intro:
      "Information about how Rocket & Rover delivers orders across Australia.",
    sections: [
      {
        title: "Domestic shipping (Australia)",
        body: "Rocket & Rover will ship orders within Australia. Carriers, delivery timeframes and rates are being finalised and will be published here and shown at checkout before launch. Until then, checkout shows a clearly marked sample rate.",
      },
      {
        title: "International shipping",
        body: "International shipping is not currently offered. If you're outside Australia and want to order, get in touch and we'll let you know as soon as it's available.",
      },
      {
        title: "Order processing & tracking",
        body: "Once your order is confirmed and payment is received, we'll prepare and ship it, then send you tracking details by email. You can also check your order status anytime from the order tracking page.",
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    intro: "Our draft returns and refunds policy, pending final approval.",
    sections: [
      {
        title: "Draft policy",
        body: "A full returns and refunds policy is being prepared and must be reviewed and approved by the Rocket & Rover team before it becomes active. Typical Australian consumer law rights (under the Australian Consumer Law) will apply in all cases.",
      },
      {
        title: "Questions",
        body: "If you have a specific returns question about an order you've placed, contact us directly with your order number and we'll be happy to help.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "Draft privacy policy, pending legal review and approval.",
    sections: [
      {
        title: "What we collect (draft)",
        body: "When you shop with Rocket & Rover we collect the information you provide at checkout (name, email, shipping address), your order history, and details you choose to share via the contact form. Newsletter sign-ups store your email address so we can send updates.",
      },
      {
        title: "How we use it (draft)",
        body: "We use this information to process orders, communicate with you about your purchases, and — only if you opt in — send you news and updates. We do not sell your personal information.",
      },
      {
        title: "Notice",
        body: "This page is a draft placeholder and must be reviewed, finalised and approved by the business owner (and, where appropriate, a legal advisor) before the store goes live.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "Draft terms of use, pending legal review and approval.",
    sections: [
      {
        title: "Using the store (draft)",
        body: "By using the Rocket & Rover website you agree to these terms. All products are supplied to consumers with the non-excludable guarantees of the Australian Consumer Law.",
      },
      {
        title: "Product information (draft)",
        body: "We work hard to display products as accurately as possible. Sample products shown during the pre-launch period are for demonstration and may change. Product specifications, age recommendations and safety information will be published for each product once confirmed.",
      },
      {
        title: "Notice",
        body: "This page is a draft placeholder and must be reviewed, finalised and approved by the business owner (and, where appropriate, a legal advisor) before the store goes live.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = POLICIES[slug];
  return p ? { title: p.title, description: p.intro } : { title: "Not found" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="container-rr max-w-3xl py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-xs font-extrabold uppercase tracking-wider text-ink/45">
        <Link href="/" className="hover:text-cosmic">Home</Link>
        <span className="mx-2 text-ink/30">/</span>
        <span className="text-navy">{policy.title}</span>
      </nav>
      <h1 className="mt-4 font-display text-4xl font-semibold text-navy">{policy.title}</h1>
      <p className="mt-3 text-lg text-ink/60">{policy.intro}</p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-cream px-5 py-4 text-sm font-bold leading-relaxed text-navy/75">
        <IconChevronDown className="mt-0.5 h-5 w-5 shrink-0 rotate-90 text-star-dark" />
        <span>
          Placeholder content — this policy draft must be reviewed and approved by
          the Rocket &amp; Rover business owner before launch.
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {policy.sections.map((s) => (
          <section key={s.title} className="card p-6">
            <h2 className="font-display text-xl font-semibold text-navy">{s.title}</h2>
            <p className="mt-2.5 leading-relaxed text-ink/70">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/contact" className="btn-primary btn-md">
          Questions? Contact Us
        </Link>
      </div>
    </div>
  );
}
