import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import "@/models/vehicle.model";
import mongoose from "mongoose";
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
    console.log(session.user.id);
    const bookings = await Booking.find({
      driver: session?.user?.id,
    })
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
