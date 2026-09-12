import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { PaymentSuccessClient } from "@/features/member/payment/PaymentSuccessClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your Sigaleve payment was completed successfully.",
  keywords: ["Sigaleve", "payment", "checkout"],
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ bookingId?: string; status?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const query = await searchParams;

  return (
    <PaymentSuccessClient
      lang={lang}
      bookingId={query.bookingId ?? null}
      status={query.status ?? "success"}
    />
  );
}
