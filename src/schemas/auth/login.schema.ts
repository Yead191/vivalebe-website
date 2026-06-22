import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
    z.object({
        email: z.string().email({ message: t("invalidEmail") }),
        password: z.string().min(1, { message: t("passwordRequired") }),
        rememberMe: z.boolean().default(false),
    });