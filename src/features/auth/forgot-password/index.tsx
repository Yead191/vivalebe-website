"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createEmailStepSchema } from "@/schemas/auth/forgot-password.schema";
import { FormInput } from "@/components/forms/form-input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { forgotPasswordAction } from "./action";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  lang: string;
}

export default function ForgotPasswordFeature({ dict, lang }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const tValidation = (key: string) => dict.validation?.[key] || key;

  const emailForm = useForm({
    resolver: zodResolver(createEmailStepSchema(tValidation)),
    defaultValues: { email: "" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmailSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await forgotPasswordAction({ email: values.email });
      if (res.success) {
        toast.success(res.message || "OTP sent successfully!");
        router.push(
          `/${lang}/auth/otp-verification?email=${encodeURIComponent(values.email)}&purpose=reset`,
        );
      } else {
        toast.error(res.error || res.message || "Failed to process request");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            {dict.auth?.forgotPasswordTitle || "Recover Password"}
          </h2>
          <p className="text-sm text-neutral-500">
            {dict.auth?.forgotPasswordSubtitle ||
              "Provide email to search registration status."}
          </p>
        </div>
        <FormInput
          control={emailForm.control}
          name="email"
          label={dict.auth?.labels?.email}
          placeholder="name@example.com"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            dict.auth?.sendCodeButton || "Generate Key"
          )}
        </Button>
      </form>
    </Form>
  );
}
