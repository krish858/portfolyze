"use server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/db";
import { portfolioModel } from "@/models/PortfolioModel";
import { userModel } from "@/models/UserModel";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, type: "not authenticated" });
    }
    const email = session.user?.email;
    await dbConnect();
    const portfolio = await portfolioModel.create({
      title: "New Portfolio",
      description: "New Portfolio",
      email,
      score: 0,
    });
    await userModel.findOneAndUpdate(
      { email: email },
      {
        $push: {
          PortfolioId: portfolio._id,
        },
      }
    );
    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, type: "error", error: err });
  }
}
