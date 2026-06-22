"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface Props {
    dict: any;
    lang: string;
}

export default function OTPVerificationFeature({ dict, lang }: Props) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(60);
    const [loading, setLoading] = useState(false);
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const form = useForm({ defaultValues: { code: ["", "", "", ""] } });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const currentCode = form.getValues("code");
        currentCode[index] = value.slice(-1);
        form.setValue("code", currentCode);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !form.getValues("code")[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(`/${lang}/dashboard`);
        }, 1000);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1.5 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900">{dict.auth?.verifyEmail || "Verify Identity"}</h2>
                    <p className="text-sm text-neutral-500">{dict.auth?.codeSentTo || "Enter security pin token code"}</p>
                </div>

                <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={`code.${index}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <input
                                            {...field}
                                            ref={inputRefs[index]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-neutral-200 focus:border-[#429CA8] focus:ring-4 focus:ring-[#429CA8]/10 outline-none transition-all"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                <div className="text-center text-xs">
                    {countdown > 0 ? (
                        <p className="text-neutral-500">{dict.auth?.resendIn || "Resend in"} <span className="font-bold text-[#429CA8]">{countdown}s</span></p>
                    ) : (
                        <button type="button" onClick={() => setCountdown(60)} className="text-[#429CA8] font-bold hover:underline bg-transparent border-none cursor-pointer">
                            {dict.auth?.resendCode || "Resend Pin"}
                        </button>
                    )}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : dict.auth?.verifyButton || "Confirm Code"}
                </Button>
            </form>
        </Form>
    );
}