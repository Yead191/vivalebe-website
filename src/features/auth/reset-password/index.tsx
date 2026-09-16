"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createResetPasswordSchema } from "@/schemas/auth/forgot-password.schema";
import { FormPassword } from "@/components/forms/form-password";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resetPasswordAction } from "./action";
import { clearResetToken, getResetToken } from "../resetToken";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  lang: string;
}

export default function ResetPasswordFeature({ dict, lang }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const tValidation = (key: string) => dict.validation?.[key] || key;

  const resetForm = useForm({
    resolver: zodResolver(createResetPasswordSchema(tValidation)),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const token = getResetToken();
    if (!token) {
      toast.error("Reset token missing. Please verify OTP again.");
      router.replace(`/${lang}/auth/forgot-password`);
      return;
    }
    setResetToken(token);
  }, [lang, router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResetSubmit = async (values: any) => {
    const token = resetToken || getResetToken();
    if (!token) {
      toast.error("Reset token missing. Please verify OTP again.");
      router.replace(`/${lang}/auth/forgot-password`);
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordAction(
        {
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        },
        token,
      );

      if (res.success) {
        clearResetToken();
        toast.success(res.message || "Password updated successfully!");
        router.push(`/${lang}/auth/login`);
      } else {
        toast.error(res.error || res.message || "Failed to update password");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...resetForm}>
      <form
        onSubmit={resetForm.handleSubmit(handleResetSubmit)}
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            {dict.auth?.resetPasswordTitle || "Update Password"}
          </h2>
        </div>
        <FormPassword
          control={resetForm.control}
          name="password"
          label={dict.auth?.labels?.newPassword || "New Password"}
          placeholder="••••••••"
        />
        <FormPassword
          control={resetForm.control}
          name="confirmPassword"
          label={dict.auth?.labels?.confirmNewPassword || "Confirm New Password"}
          placeholder="••••••••"
        />
        <Button
          type="submit"
          disabled={loading || !resetToken}
          className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            dict.auth?.resetPasswordButton || "Change security code"
          )}
        </Button>
      </form>
    </Form>
  );
}
