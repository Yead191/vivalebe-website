"use server";

import { revalidateTag } from "next/cache";

export const revalidate = async (tag: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   @ts-ignore
  return revalidateTag(tag);
};
