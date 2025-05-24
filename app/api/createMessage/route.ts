"use server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/db";
import { messageModel } from "@/models/MessageModel";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, type: "not authenticated" });
    }

    const email = session.user?.email;
    if (!email) {
      return NextResponse.json({ success: false, type: "missing email" });
    }
    await dbConnect();

    let portfolioId = id;
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      portfolioId = new mongoose.Types.ObjectId(id);
    }

    const message = await messageModel.create({
      portfolioid: portfolioId,
      message: [
        {
          role: "assistant",
          content:
            "Hi! Let's get started to make your portfolio/resume. Let's start with what role you are aiming for.",
        },
      ],
      email,
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
