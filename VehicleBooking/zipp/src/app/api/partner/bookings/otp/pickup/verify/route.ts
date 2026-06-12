import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { bookingId, otp } = await req.json();
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 400 }
      );
    }
    if (!booking.pickUpOtp) {
      return NextResponse.json(
        { message: "Otp is not generated" },
        { status: 400 }
      );
    }

    if (booking.pickUpOtp !== otp) {
      return NextResponse.json(
        { message: "Incorrect pickup otp" },
        { status: 400 }
      );
    }

    if (booking.pickUpOtpExpires < new Date()) {
      return NextResponse.json({ message: "otp expired" }, { status: 400 });
    }

    booking.bookingStatus = "started";
    booking.pickUpOtp = "";
    booking.pickUpOtpExpires = undefined;
    await booking.save();
    return NextResponse.json({ message: "Otp verified" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in veryfing pickup otp" },
      { status: 500 }
    );
  }
}
