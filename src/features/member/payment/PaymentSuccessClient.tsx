"use client";

import Link from "next/link";
import { CheckCircle2, CalendarDays, Home, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";

interface PaymentSuccessClientProps {
  lang: Locale;
  bookingId: string | null;
  status: string;
}

export function PaymentSuccessClient({
  lang,
  bookingId,
  status,
}: PaymentSuccessClientProps) {
  const isSuccess = status.toLowerCase() === "success";

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div
          className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full ${
            isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          <CheckCircle2 className="size-9" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {isSuccess ? "Payment successful" : "Payment update"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {isSuccess
            ? "Your event booking payment has been completed. You can review your events anytime from the events page."
            : "We received a payment update for your booking. If anything looks wrong, please contact support."}
        </p>

        {bookingId ? (
          <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground break-all">
            Booking ID:{" "}
            <span className="font-medium text-foreground">{bookingId}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
         
          <Button asChild variant="outline">
            <Link href={`/${lang}/myHome`}>
              <Home className="size-4" />
              Go to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
