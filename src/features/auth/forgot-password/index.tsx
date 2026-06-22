"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createEmailStepSchema, createResetPasswordSchema } from "@/schemas/auth/forgot-password.schema";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface Props {
    dict: any;
    lang: string;
}

export default function ForgotPasswordFeature({ dict, lang }: Props) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const tValidation = (key: string) => dict.validation?.[key] || key;

    const emailForm = useForm({ resolver: zodResolver(createEmailStepSchema(tValidation)), defaultValues: { email: "" } });
    const resetForm = useForm({ resolver: zodResolver(createResetPasswordSchema(tValidation)), defaultValues: { password: "", confirmPassword: "" } });

    const handleEmailSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
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
            {step === 1 ? (
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
            ) : (
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