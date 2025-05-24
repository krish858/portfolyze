"use server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/db";
import { portfolioModel } from "@/models/PortfolioModel";
import { messageModel } from "@/models/MessageModel";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, type: "not authenticated" });
    }
    await dbConnect();
    const portfolio = await portfolioModel.findOne({ _id: id });
    const messages = await messageModel.findOne({ portfolioid: id });
    return NextResponse.json({ success: true, portfolio, messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, type: "error", error: err });
  }
}
