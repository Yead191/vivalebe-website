import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    // Forward raw body and Content-Type (with multipart boundary) directly
    const contentType = req.headers.get("content-type") || "";
    const body = await req.arrayBuffer();

    const res = await fetch(`${process.env.BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Message proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
