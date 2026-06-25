import { NextResponse } from "next/server";
import { getMarketData } from "@/lib/services/market";

export const revalidate = 300; // 5 minutes cache

export async function GET(
  request: Request,
  { params }: { params: { company: string } }
) {
  const { company } = params;

  if (!company) {
    return NextResponse.json({ error: "Company parameter missing" }, { status: 400 });
  }

  try {
    const data = await getMarketData(company);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
