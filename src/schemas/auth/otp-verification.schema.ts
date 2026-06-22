import { z } from "zod";

export const createOtpSchema = (t: (key: string) => string) =>
    z.object({
        code: z.array(z.string()).refine(
            (arr) => arr.length === 4 && arr.every((val) => /^\d$/.test(val)),
            {
                message: t("invalidOtp"),
            }
        ),
    });
