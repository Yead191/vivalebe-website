"use server";

import { myFetch } from "@/helpers/myFetch";

export async function reportPost(formData: FormData) {
  try {
    const res = await myFetch("/post-report", {
      method: "POST",
      body: formData, // passing FormData directly
    });
    return res;
  } catch (error) {
    console.error("Error reporting post:", error);
    return { success: false, message: "Failed to report" };
  }
}
