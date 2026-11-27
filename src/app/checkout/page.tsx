import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/queries";
import { CheckoutForm } from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout" };

const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export default async function CheckoutPage() {
  const settings = await getSettings();
  const shippingRateCents = parseInt(settings.shippingRateCents ?? "995", 10);
  const freeShipThresholdCents = parseInt(settings.freeShipThresholdCents ?? "0", 10);

  return (
    <div className="container-rr py-10 lg:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-ink/60">
        You're almost there, explorer! Fill in your details and we'll take it from here.
      </p>
      <CheckoutForm
        shippingRateCents={shippingRateCents}
        freeShipThresholdCents={freeShipThresholdCents}
        states={AU_STATES}
      />
      <div className="mt-10 rounded-3xl bg-lav/60 p-5 text-sm leading-relaxed text-navy/70">
        <p className="font-extrabold text-navy">A note about payment</p>
        <p className="mt-1">
          Rocket &amp; Rover is still setting up its online payment provider (such as
          Stripe or PayPal). When you place an order it will be saved as{" "}
          <span className="font-extrabold">pending payment</span> and you'll be
          contacted by email with payment and delivery details. No payment is taken
          right now.{" "}
          <Link href="/contact" className="font-extrabold text-cosmic hover:underline">
            Need help? Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
