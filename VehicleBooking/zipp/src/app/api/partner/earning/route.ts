import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    console.log(session.user.id);
    const bookings = await Booking.find({
      paymentStatus: "paid",
      createdAt: { $gte: sevenDaysAgo },
      driver: session?.user?.id,
    }).select("partnerAmount createdAt");

    console.log(bookings);
    let earningMap: Record<string, number> = {};

    bookings.forEach((b) => {
      const date = new Date(b.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      if (!earningMap[date]) {
        earningMap[date] = 0;
      }
      earningMap[date] += earningMap[date] + b.partnerAmount || 0;
    });
    const earnings = Object.entries(earningMap).map(([date, earnings]) => ({
      date,
      earnings,
    }));
    return NextResponse.json(earnings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `partner earning error::${error}` },
      { status: 500 }
    );
  }
}
