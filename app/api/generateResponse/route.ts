"use server";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/db";
import Groq from "groq-sdk";
import { messageModel } from "@/models/MessageModel";
import { portfolioModel } from "@/models/PortfolioModel";

export async function POST(request: NextRequest) {
  try {
    const { query, id } = await request.json();
    const session = await getServerSession();
    await dbConnect();

    if (!session) {
      return NextResponse.json({ success: false, type: "not authenticated" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
      const portfolio = await portfolioModel.findOne({ _id: id });
      if (!portfolio) {
        return NextResponse.json({
          success: false,
          type: "not found",
          msg: "Portfolio not found",
        });
      }
      let messageDoc = await messageModel.findOne({ portfolioid: String(id) });
      if (!messageDoc) {
        messageDoc = await messageModel.create({
          portfolioid: String(id),
          message: [],
        });
      }

      await messageModel.updateOne(
        { portfolioid: String(id) },
        {
          $push: {
            message: {
              role: "user",
              content: query,
            },
          },
        }
      );

      messageDoc = await messageModel.findOne({ portfolioid: String(id) });

      const prompt = `You are a senior portfolio(resume) maker and analyst. Analyze the previous chats and the current query of the user to give the best results. Only answer questions that are in your domain, and handle irregular questions appropriately.
      follow ats standards in making portfolio and scoring them. make always professional looking resume as this will probably be downloaded as pdf or used in a printed forms interview. also to keep it in a4 format.
      Current portfolio details:
      - HTML equivalent of resume: ${portfolio?.data || ""}
      - Title: ${portfolio?.title || ""}
      - Description: ${portfolio?.description || ""}

      Please format your response as a JSON object with the following structure:
      {
        "score": <score of the current resume out of 100>,
        "message": <message to be displayed to the user>,
        "html": <html code inside body tag with tailwind CSS styling exclding body tag>,
        "title": <portfolio title - update based on user conversations if needed>,
        "description": <brief description of the user portfolio - update if needed>
      }`;

      let messages = messageDoc.message || [];

      messages.push({
        role: "user",
        content: prompt,
      });

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "qwen-qwq-32b",
        temperature: 1.02,
        max_completion_tokens: 105070,
        top_p: 1,
        stream: false,
        response_format: {
          type: "json_object",
        },
        stop: null,
      });

      const responseContent = completion.choices[0].message.content;

      if (!responseContent) {
        throw new Error("Empty response from Groq API");
      }

      const data = await JSON.parse(responseContent);

      await messageModel.updateOne(
        { portfolioid: id },
        {
          $push: {
            message: {
              role: "assistant",
              content: data.message,
            },
          },
        }
      );

      await portfolioModel.updateOne(
        { _id: String(id) },
        {
          score: parseInt(data.score),
          data: data.html,
          title: data.title,
          description: data.description,
          email: portfolio.email,
        }
      );

      return NextResponse.json({
        success: true,
        data: data,
      });
    } catch (err) {
      console.error("Error processing request:", err);

      await messageModel.updateOne(
        { portfolioid: String(id) },
        {
          $push: {
            message: {
              role: "assistant",
              content:
                "Sorry, there was an error processing your request. Could you please try again?",
            },
          },
        }
      );

      return NextResponse.json({
        success: false,
        type: "error",
        error: err instanceof Error ? err.message : String(err),
        msg: "Sorry, there was an error processing your request. Could you please try again?",
      });
    }
  } catch (err) {
    console.error("Request parsing error:", err);
    return NextResponse.json({
      success: false,
      type: "error",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
