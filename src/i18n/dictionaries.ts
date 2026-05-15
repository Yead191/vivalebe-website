import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  pt: () => import("./messages/pt.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["pt"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
