"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { createLoginSchema } from "@/schemas/auth/login.schema";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
    dict: any;
    lang: string;
}

export default function LoginFeature({ dict, lang }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const tValidation = (key: string) => dict.validation?.[key] || key;

    const form = useForm({
        resolver: zodResolver(createLoginSchema(tValidation)),
        defaultValues: { email: "", password: "", rememberMe: false },
    });

    const onSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(`/${lang}/myHome`);
        }, 1000);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">{dict.auth?.loginTitle}</h2>
                    <p className="text-sm text-neutral-500">{dict.auth?.loginSubtitle}</p>
                </div>

                <Button type="button" variant="outline" className="w-full h-11 rounded-xl border-neutral-200 font-medium text-neutral-700 hover:bg-neutral-50 gap-2 cursor-pointer transition-colors">
                    <FcGoogle className="size-4 text-neutral-500" />
                    Continue with Google
                </Button>

                <div className="relative flex py-1 items-center text-neutral-300">
                    <div className="grow border-t border-neutral-200"></div>
                    <span className="shrink mx-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">{dict.auth?.or}</span>
                    <div className="grow border-t border-neutral-200"></div>
                </div>

                <div className="space-y-4">
                    <FormInput control={form.control} name="email" label={dict.auth?.labels?.email} placeholder="name@example.com" />
                    <FormPassword control={form.control} name="password" label={dict.auth?.labels?.password} placeholder="••••••••" />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded-md border-neutral-300 data-[state=checked]:bg-[#429CA8] data-[state=checked]:border-[#429CA8]" />
                                </FormControl>
                                <FormLabel className="text-neutral-600 font-medium cursor-pointer select-none">{dict.auth?.labels?.rememberMe}</FormLabel>
                            </FormItem>
                        )}
                    />
                    <Link href={`/${lang}/auth/forgot-password`} className="text-xs font-bold text-[#429CA8] hover:underline">
                        {dict.auth?.forgotPasswordLink}
                    </Link>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : dict.auth?.loginButton}
                </Button>

                <p className="text-center text-xs text-neutral-500 mt-2">
                    {dict.auth?.notMember}{" "}
                    <Link href={`/${lang}/auth/register`} className="font-bold text-[#429CA8] hover:underline">
                        {dict.auth?.registerLink}
                    </Link>
                </p>
            </form>
        </Form>
    );
}