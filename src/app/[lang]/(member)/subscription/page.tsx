import { Metadata } from "next";
import { Suspense } from "react";
import { myFetch } from "@/helpers/myFetch";
import Link from "next/link";
import { SubscriptionRequiredToast } from "@/features/member/subscription/SubscriptionRequiredToast";

export const metadata: Metadata = {
  title: "Premium Subscription - Viva Leve",
  description: "Upgrade to Viva Leve Premium",
};

interface Package {
  _id: string;
  title: string;
  price: number;
  duration: string; // e.g. "1 month", "3 months", "6 months"
  paymentType: string;
  productId: string;
  priceId: string;
  paymentLink: string;
  status: string;
}

export default async function SubscriptionPage() {
  const res = await myFetch<Package[]>("/package", {
    method: "GET",
    next: { tags: ["packages"] },
  });

  const packages = res.data || [];

  // Sort packages by duration logically (1 month, 3 months, 6 months)
  const sortedPackages = [...packages].sort((a, b) => {
    const numA = parseInt(a.duration) || 0;
    const numB = parseInt(b.duration) || 0;
    return numA - numB;
  });

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <Suspense fallback={null}>
        <SubscriptionRequiredToast />
      </Suspense>

      <div className="text-center mb-16">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-brand">
          PREMIUM
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-[15px]">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Since our company's founding in 2001 in Silicon Valley, we have
          specialized in online dating, connecting
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          millions of couples with our trusted services for over 25 years. We've
          invested more than $10 million in our infrastructure to enhance online
          dating for seamless, successful connections.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-end mt-12 max-w-4xl mx-auto">
        {sortedPackages.map((pkg) => {
          const months = parseInt(pkg.duration) || 1;

          let badge = null;
          if (months === 3) badge = "Most Popular";
          if (months === 6) badge = "Best Deal";

          const isPrimary = months === 1;

          return (
            <Link
              key={pkg._id}
              href={pkg.paymentLink || "#"}
              className={`relative bg-white flex flex-col justify-center text-center cursor-pointer hover:shadow-lg transition-shadow p-10 h-64 mt-8 md:mt-0 ${
                isPrimary
                  ? "border-2 border-brand"
                  : "border border-border shadow-sm rounded-sm"
              }`}
            >
              {badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-brand-foreground text-[13px] px-4 py-1 rounded-full whitespace-nowrap shadow-sm font-medium">
                  {badge}
                </div>
              )}
              <h2
                className={`text-xl font-medium mb-8 ${isPrimary ? "text-brand" : "text-foreground"}`}
              >
                {pkg.duration}
              </h2>
              <p className="text-lg font-bold text-foreground">
                USD ${pkg.price}
              </p>
              {pkg.paymentType && (
                <p className="text-muted-foreground mt-2 text-[15px]">
                  {pkg.paymentType}
                </p>
              )}
            </Link>
          );
        })}
        {sortedPackages.length === 0 && (
          <div className="col-span-3 text-center text-muted-foreground">
            No premium packages available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
