"use server";

import { myFetch } from "@/helpers/myFetch";

export async function submitContactAction(data: {
  name: string;
  subject: string;
  email: string;
  phone: string;
  message: string;
}) {
  const res = await myFetch("/contact", {
    method: "POST",
    body: data,
  });

  return res;
}
