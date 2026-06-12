import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ user: session.user.id })
      .populate("user driver vehicle")
      .sort({ createdAt: -1 });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Bookings error::${error}` },
      { status: 500 }
    );
  }
}
