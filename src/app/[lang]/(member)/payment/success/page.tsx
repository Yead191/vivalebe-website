import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { PaymentSuccessClient } from "@/features/member/payment/PaymentSuccessClient";

export const metadata = {
  title: "Payment Successful - Viva Leve",
  description: "Your payment was completed successfully.",
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
