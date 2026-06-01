import { NextRequest, NextResponse } from "next/server";
import { getWeatherMode } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const zone = request.nextUrl.searchParams.get("zone") ?? "chisinau";
  const mode = await getWeatherMode(zone);
  return NextResponse.json({ zone, mode });
}
