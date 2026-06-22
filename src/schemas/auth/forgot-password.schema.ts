import { z } from "zod";

export const createEmailStepSchema = (t: (key: string) => string) =>
    z.object({ email: z.string().email({ message: t("invalidEmail") }) });

export const createResetPasswordSchema = (t: (key: string) => string) =>
    z.object({
        password: z
            .string()
            .min(8, { message: t("passwordMin") })
            .regex(/[A-Z]/, { message: t("passwordUppercase") })
            .regex(/[0-9]/, { message: t("passwordNumber") }),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: t("passwordMismatch"),
    });