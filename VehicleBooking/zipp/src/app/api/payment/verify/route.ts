import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Booking from "@/models/booking.model";
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const {
      bookingId,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id,
    } = await req.json();
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");
    if (razorpay_signature !== generated_signature) {
      return NextResponse.json({
        success: false,
        message: "invalid signature",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" });
    }
    booking.bookingStatus = "confirmed";
    booking.paymentStatus = "paid";
    booking.adminCommission = booking.fare * 0.1;
    booking.partnerAmount = booking.fare - booking.fare * 0.1;
    await booking.save();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Verify error : ${error}` },
      { status: 500 }
    );
  }
}
