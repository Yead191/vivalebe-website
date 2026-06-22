import { z } from "zod";

const heightUnitSchema = z.enum(["cm", "ft"]);
const weightUnitSchema = z.enum(["kg", "lb"]);

export const createOnboardingSchema = (t: (key: string) => string) =>
  z
    .object({
      interestedIn: z.enum(["man", "woman", "couple"]),
      lookingFor: z.enum(["man", "woman", "couple"]),
      country: z.string().min(2, { message: t("countryRequired") }),
      state: z.string().min(2, { message: t("stateRequired") }),
      zipCode: z.string().min(3, { message: t("zipRequired") }),
      nationality: z.string().min(2, { message: t("nationalityRequired") }),
      dateOfBirth: z.string().min(1, { message: t("dobRequired") }),
      livingWith: z.enum(["hsv1", "hsv2", "hpv", "hiv", "other"]),
      displayName: z.string().min(2, { message: t("displayNameRequired") }),
      heightValue: z.string().min(1, { message: t("heightRequired") }),
      heightUnit: heightUnitSchema,
      weightValue: z.string().min(1, { message: t("weightRequired") }),
      weightUnit: weightUnitSchema,
      occupation: z.string().min(2, { message: t("occupationRequired") }),
      educationLevel: z.enum(["highSchool", "college", "graduate", "masters", "doctorate"]),
      relationshipStatus: z.enum(["single", "divorced", "married", "widowed"]),
      aboutYou: z.string().min(40, { message: t("aboutMin") }).max(320, { message: t("aboutMax") }),
    })
    .refine((data) => {
      const dob = new Date(data.dateOfBirth);
      if (Number.isNaN(dob.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
      return age >= 18;
    }, {
      path: ["dateOfBirth"],
      message: t("mustBeAdult"),
    });

