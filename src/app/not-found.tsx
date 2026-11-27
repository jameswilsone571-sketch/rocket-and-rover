import Link from "next/link";
import { StarField } from "@/components/StarField";
import { IconArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden bg-navy">
      <StarField density={36} />
      <div className="container-rr relative flex flex-col items-center py-28 text-center">
        <p className="font-display text-7xl font-semibold text-star">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
          Lost in space!
        </h1>
        <p className="mt-4 max-w-md text-lg text-lav/75">
          This page drifted off the map. Let's get you back to the adventure.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-accent btn-lg">
            Back to Home
          </Link>
          <Link href="/shop" className="btn-ghost-light btn-lg">
            Explore the Shop <IconArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
