import { z } from "zod";

export const createRegisterSchema = (t: (key: string) => string) =>
    z.object({
        fullName: z.string().min(2, { message: t("nameMin") }),
        email: z.string().email({ message: t("invalidEmail") }),
        password: z
            .string()
            .min(8, { message: t("passwordMin") })
            .regex(/[A-Z]/, { message: t("passwordUppercase") })
            .regex(/[0-9]/, { message: t("passwordNumber") }),
        confirmPassword: z.string(),
        acceptTerms: z.literal(true, { message: t("acceptTerms") }),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: t("passwordMismatch"),
    });
