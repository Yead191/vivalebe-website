"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { createRegisterSchema } from "@/schemas/auth/register.schema";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { registerAction } from "./action";

interface Props {
    dict: any;
    lang: string;
}

export default function RegisterFeature({ dict, lang }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const tValidation = (key: string) => dict.validation?.[key] || key;

    const form = useForm<any>({
        resolver: zodResolver(createRegisterSchema(tValidation)),
        defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            const res = await registerAction({
                name: values.fullName,
                email: values.email,
                password: values.password
            });

            if (res.success) {
                toast.success(res.message || "Registration successful");
                sessionStorage.setItem("prefillEmail", values.email);
                sessionStorage.setItem("prefillPassword", values.password);
                router.push(`/${lang}/auth/otp-verification?email=${values.email}`);
            } else {
                toast.error(res.error || res.message || "Registration failed");
            }
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">{dict.auth?.registerTitle}</h2>
                    <p className="text-sm text-neutral-500">{dict.auth?.registerSubtitle}</p>
                </div>

                <div className="space-y-3.5">
                    <FormInput control={form.control} name="fullName" label={dict.auth?.labels?.fullName || "Full Name"} placeholder="John Doe" />
                    <FormInput control={form.control} name="email" label={dict.auth?.labels?.email} placeholder="name@example.com" />
                    <FormPassword control={form.control} name="password" label={dict.auth?.labels?.password} placeholder="••••••••" />
                    <FormPassword control={form.control} name="confirmPassword" label={dict.auth?.labels?.confirmPassword || "Confirm Password"} placeholder="••••••••" />
                </div>

                <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                        <FormItem className="flex items-start gap-2 space-y-0 pt-1">
                            <FormControl className="mt-0.5">
                                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} className="rounded-md border-neutral-300 data-[state=checked]:bg-[#429CA8] data-[state=checked]:border-[#429CA8]" />
                            </FormControl>
                            <FormLabel className="text-xs text-neutral-600 leading-normal font-medium cursor-pointer select-none">
                                {dict.auth?.labels?.acceptTermsText || "I agree to conditions"}
                            </FormLabel>
                        </FormItem>
                    )}
                />
                {form.formState.errors.acceptTerms && (
                    <p className="text-rose-500 text-xs font-medium">{String(form.formState.errors.acceptTerms.message)}</p>
                )}

                <Button type="submit" disabled={loading} className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : dict.auth?.registerButton}
                </Button>

                <p className="text-center text-xs text-neutral-500">
                    {dict.auth?.alreadyHaveAccount}{" "}
                    <Link href={`/${lang}/auth/login`} className="font-bold text-[#429CA8] hover:underline">
                        {dict.auth?.loginLink}
                    </Link>
                </p>
            </form>
        </Form>
    );
}

