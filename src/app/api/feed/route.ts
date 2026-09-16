import { NextRequest, NextResponse } from "next/server";
import { getFeed, type FeedType } from "@/features/member/home/action";

function parseFeedType(value: string | null): FeedType {
  if (value === "VIDEO" || value === "IMAGE" || value === "ALL") return value;
  return "ALL";
}

export async function GET(request: NextRequest) {
  const type = parseFeedType(request.nextUrl.searchParams.get("type"));
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const limit = Number(request.nextUrl.searchParams.get("limit") || 20);

  const data = await getFeed(
    type,
    Number.isFinite(page) && page > 0 ? page : 1,
    Number.isFinite(limit) && limit > 0 ? limit : 20,
  );

  return NextResponse.json(data);
}
