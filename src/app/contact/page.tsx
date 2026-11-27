import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { IconInstagram, IconMail, IconMapPin, IconPhone } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Rocket & Rover team with questions about orders, products or your next little adventure.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const email = settings.contact_email || "hello@rocketandrover.com.au";
  const phone = settings.contact_phone || "To be confirmed";
  const address = settings.contact_address || "Somewhere in Australia — address to be confirmed";
  const instagram = settings.instagram?.trim();

  return (
    <div className="container-rr py-12 lg:py-16">
      <FadeIn className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-navy sm:text-5xl">
          We'd Love to Hear From You!
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/60">
          Have a question about an order, a product or your next little adventure?
          Get in touch with the Rocket &amp; Rover team.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <FadeIn>
          <ContactForm />
        </FadeIn>
        <FadeIn delay={120}>
          <div className="card space-y-5 p-6 sm:p-7">
            <h2 className="font-display text-xl font-semibold text-navy">Contact details</h2>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lav text-cosmic">
                <IconMail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Email</p>
                <a href={`mailto:${email}`} className="font-bold text-navy hover:text-cosmic">
                  {email}
                </a>
                <p className="text-xs text-ink/40">Placeholder — will be updated soon</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky text-rocket-dark">
                <IconPhone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Phone</p>
                <p className="font-bold text-navy">{phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cream text-star-dark">
                <IconMapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Location</p>
                <p className="font-bold text-navy">{address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush/30 text-[#B4486E]">
                <IconInstagram className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">Social</p>
                {instagram ? (
                  <a href={instagram} target="_blank" rel="noreferrer" className="font-bold text-navy hover:text-cosmic">
                    Follow us
                  </a>
                ) : (
                  <p className="font-bold text-navy">Instagram launching soon</p>
                )}
              </div>
            </div>
            <p className="rounded-2xl bg-lav/50 px-4 py-3 text-xs font-bold leading-relaxed text-navy/60">
              Message form submissions are saved securely to the Rocket &amp; Rover
              inbox and will be forwarded to the business email once configured.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
