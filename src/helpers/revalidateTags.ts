"use server";

import { revalidateTag } from "next/cache";


export const revalidateTags = async (tags: string[]) => {
  tags.forEach((tag) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   @ts-ignore
    revalidateTag(tag);
  });
};
