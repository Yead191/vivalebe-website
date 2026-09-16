import { NextResponse } from "next/server";
import { getNotifications } from "@/components/shared/navbar/action";

export async function GET() {
  const data = await getNotifications();
  return NextResponse.json(data ?? []);
}
