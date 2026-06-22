"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createEmailStepSchema, createResetPasswordSchema } from "@/schemas/auth/forgot-password.schema";
import { createOtpSchema } from "@/schemas/auth/otp-verification.schema";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface Props {
    dict: any;
    lang: string;
}

export default function ForgotPasswordFeature({ dict, lang }: Props) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    
    const tValidation = (key: string) => dict.validation?.[key] || key;

    const emailForm = useForm({ resolver: zodResolver(createEmailStepSchema(tValidation)), defaultValues: { email: "" } });
    const otpForm = useForm({ resolver: zodResolver(createOtpSchema(tValidation)), defaultValues: { code: ["", "", "", ""] } });
    const resetForm = useForm({ resolver: zodResolver(createResetPasswordSchema(tValidation)), defaultValues: { password: "", confirmPassword: "" } });

    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, step]);

    const handleEmailSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            setCountdown(60);
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const currentCode = otpForm.getValues("code");
        currentCode[index] = value.slice(-1);
        otpForm.setValue("code", currentCode);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpForm.getValues("code")[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleOtpSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1000);
    };

    const handleResetSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(`/${lang}/auth/login`);
        }, 1000);
    };

    return (
        <div>
            {step === 1 && (
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-5">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">{dict.auth?.forgotPasswordTitle || "Recover Password"}</h2>
                            <p className="text-sm text-neutral-500">{dict.auth?.forgotPasswordSubtitle || "Provide email to search registration status."}</p>
                        </div>
                        <FormInput control={emailForm.control} name="email" label={dict.auth?.labels?.email} placeholder="name@example.com" />
                        <Button type="submit" disabled={loading} className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer">
                            {loading ? <Loader2 className="size-4 animate-spin" /> : dict.auth?.sendCodeButton || "Generate Key"}
                        </Button>
                    </form>
                </Form>
            )}
            
            {step === 2 && (
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
                        <div className="space-y-1.5 text-center">
                            <h2 className="text-2xl font-bold text-neutral-900">{dict.auth?.verifyEmail || "Verify Identity"}</h2>
                            <p className="text-sm text-neutral-500">{dict.auth?.codeSentTo || "Enter security pin token code"}</p>
                        </div>

                        <div className="flex justify-center gap-3">
                            {[0, 1, 2, 3].map((index) => (
                                <FormField
                                    key={index}
                                    control={otpForm.control}
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
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-neutral-200 focus:border-[#429CA8] focus:ring-4 focus:ring-[#429CA8]/10 outline-none transition-all"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        {otpForm.formState.errors.code && (
                            <p className="text-rose-500 text-xs font-medium text-center mt-2">
                                {(otpForm.formState.errors.code as any).root?.message || (otpForm.formState.errors.code as any).message || tValidation("invalidOtp")}
                            </p>
                        )}

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
            )}

            {step === 3 && (
                <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-5">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">{dict.auth?.resetPasswordTitle || "Update Password"}</h2>
                            <p className="text-sm text-neutral-500">{dict.auth?.resetPasswordSubtitle || "Assign new protective passkey configuration keys."}</p>
                        </div>
                        <FormPassword control={resetForm.control} name="password" label={dict.auth?.labels?.password} placeholder="••••••••" />
                        <FormPassword control={resetForm.control} name="confirmPassword" label={dict.auth?.labels?.confirmPassword || "Confirm Password"} placeholder="••••••••" />
                        <Button type="submit" disabled={loading} className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer">
                            {loading ? <Loader2 className="size-4 animate-spin" /> : dict.auth?.resetPasswordButton || "Change security code"}
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
}