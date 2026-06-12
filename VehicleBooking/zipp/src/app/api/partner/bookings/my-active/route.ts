import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: session.user.email });
    const booking = await Booking.findOne({
      driver: user._id,
      bookingStatus: {
        $in: ["confirmed", "started", "requested", "awaiting_payment"],
      },
    }).populate("user vehicle driver");
    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get my ride error : ${error}` },
      { status: 500 }
    );
  }
}
