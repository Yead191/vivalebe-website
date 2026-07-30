"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  createEmailStepSchema,
  createResetPasswordSchema,
} from "@/schemas/auth/forgot-password.schema";
import { createOtpSchema } from "@/schemas/auth/otp-verification.schema";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  forgotPasswordAction,
  resendOtpAction,
  resetPasswordAction,
  verifyOtpAction,
} from "./action";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  lang: string;
}

export default function ForgotPasswordFeature({ dict, lang }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resetToken, setResetToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const tValidation = (key: string) => dict.validation?.[key] || key;

  const emailForm = useForm({
    resolver: zodResolver(createEmailStepSchema(tValidation)),
    defaultValues: { email: "" },
  });
  const otpForm = useForm({
    resolver: zodResolver(createOtpSchema(tValidation)),
    defaultValues: { code: ["", "", "", "", "", ""] },
  });
  const resetForm = useForm({
    resolver: zodResolver(createResetPasswordSchema(tValidation)),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmailSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await forgotPasswordAction({ email: values.email });
      if (res.success) {
        toast.success(res.message || "OTP sent successfully!");
        setStep(2);
        setCountdown(60);
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

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const currentCode = otpForm.getValues("code");
    currentCode[index] = value.slice(-1);
    otpForm.setValue("code", currentCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.key === "Backspace" &&
      !otpForm.getValues("code")[index] &&
      index > 0
    ) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const currentCode = [...otpForm.getValues("code")];
    pastedData.split("").forEach((char, index) => {
      currentCode[index] = char;
    });
    otpForm.setValue("code", currentCode);

    const nextIndex = Math.min(pastedData.length, 5);
    if (pastedData.length === 6) {
      inputRefs[5].current?.focus();
    } else {
      inputRefs[nextIndex].current?.focus();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOtpSubmit = async (values: any) => {
    const email = emailForm.getValues("email");
    if (!email) {
      toast.error("Email not found.");
      return;
    }
    setLoading(true);
    try {
      const otpString = values.code.join("");
      const res = await verifyOtpAction({
        email,
        oneTimeCode: Number(otpString),
      });

      if (res.success) {
        // The token could be in data.token, data.accessToken, or data itself.
        const tokenToSave =
          res.data?.token ||
          res.data?.accessToken ||
          (typeof res.data === "string" ? res.data : "");
        setResetToken(tokenToSave);
        toast.success(res.message || "Code verified successfully!");
        setStep(3);
      } else {
        toast.error(res.error || res.message || "Invalid OTP code");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResetSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await resetPasswordAction(
        {
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        },
        resetToken,
      );

      if (res.success) {
        toast.success(res.message || "Password updated successfully!");
        const email = emailForm.getValues("email");
        if (email) sessionStorage.setItem("prefillEmail", email);
        sessionStorage.setItem("prefillPassword", values.password);
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

  const handleResendOtp = async () => {
    const email = emailForm.getValues("email");
    if (!email) {
      toast.error("Email not found.");
      return;
    }

    try {
      const res = await resendOtpAction({ email });
      if (res.success) {
        toast.success(res.message || "OTP resent successfully");
        setCountdown(60);
      } else {
        toast.error(res.error || res.message || "Failed to resend OTP");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div>
      {step === 1 && (
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
      )}

      {step === 2 && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className="space-y-6"
          >
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-bold text-neutral-900">
                {dict.auth?.verifyEmail || "Verify Identity"}
              </h2>
              <p className="text-sm text-neutral-500">
                {dict.auth?.codeSentTo || "Enter security pin token code"}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
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
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handlePaste}
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
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(otpForm.formState.errors.code as any).root?.message ||
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (otpForm.formState.errors.code as any).message ||
                  tValidation("invalidOtp")}
              </p>
            )}

            <div className="text-center text-xs">
              {countdown > 0 ? (
                <p className="text-neutral-500">
                  {dict.auth?.resendIn || "Resend in"}{" "}
                  <span className="font-bold text-[#429CA8]">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#429CA8] font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  {dict.auth?.resendCode || "Resend Pin"}
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#429CA8] hover:bg-[#357D87] text-white font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                dict.auth?.verifyButton || "Confirm Code"
              )}
            </Button>
          </form>
        </Form>
      )}

      {step === 3 && (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(handleResetSubmit)}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                {dict.auth?.resetPasswordTitle || "Update Password"}
              </h2>
              <p className="text-sm text-neutral-500">
                {dict.auth?.resetPasswordSubtitle ||
                  "Assign new protective passkey configuration keys."}
              </p>
            </div>
            <FormPassword
              control={resetForm.control}
              name="password"
              label={dict.auth?.labels?.password}
              placeholder="••••••••"
            />
            <FormPassword
              control={resetForm.control}
              name="confirmPassword"
              label={dict.auth?.labels?.confirmPassword || "Confirm Password"}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              disabled={loading}
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
      )}
    </div>
  );
}
