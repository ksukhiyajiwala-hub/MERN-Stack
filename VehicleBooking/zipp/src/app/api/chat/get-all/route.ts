import connectDb from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { bookingId } = await req.json();
    const messages = await ChatMessage.find({ bookingId });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get All messages error::${error}` },
      { status: 500 }
    );
  }
}
