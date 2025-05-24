"use server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/db";
import { portfolioModel } from "@/models/PortfolioModel";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, type: "not authenticated" });
    }
    const email = session.user?.email;
    await dbConnect();
    const portfolios = await portfolioModel
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(3);
    return NextResponse.json({ success: true, portfolios });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, type: "error", error: err });
  }
}
