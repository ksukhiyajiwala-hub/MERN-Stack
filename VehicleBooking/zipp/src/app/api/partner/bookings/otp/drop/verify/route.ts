import { PaymentStatus } from "./../../../../../../../models/booking.model";
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
    if (!booking.dropOtp) {
      return NextResponse.json(
        { message: "Otp is not generated" },
        { status: 400 }
      );
    }

    if (booking.dropOtp !== otp) {
      return NextResponse.json(
        { message: "Incorrect drop otp" },
        { status: 400 }
      );
    }

    if (booking.dropOtpExpires < new Date()) {
      return NextResponse.json({ message: "otp expired" }, { status: 400 });
    }

    if (booking.paymentStatus === "cash") {
      booking.adminCommission = booking.fare * 0.1;
      booking.partnerAmount = booking.fare - booking.fare * 0.1;
    }
    booking.paymentStatus = "paid";
    booking.bookingStatus = "completed";
    booking.dropOtp = "";
    booking.dropOtpExpires = undefined;
    await booking.save();
    return NextResponse.json({ message: "Otp verified" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in veryfing drop otp" },
      { status: 500 }
    );
  }
}
