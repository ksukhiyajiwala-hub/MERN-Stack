import { Schema } from "mongoose";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }
    const {
      driverId,
      vehicleId,
      pickUpAddress,
      dropAddress,
      pickupLocation,
      dropLocation,
      fare,
      mobileNumber,
    } = await req.json();
    if (
      !driverId ||
      !vehicleId ||
      !pickupLocation.coordinates ||
      !dropLocation.coordinates
    ) {
      return Response.json(
        { message: "Missing required details" },
        { status: 400 }
      );
    }
    const driver = await User.findById(driverId);
    if (!driver) {
      return Response.json({ message: "Driver not found" }, { status: 400 });
    }

    const existingBooking = await Booking.findOne({
      user: session.user.id,
      bookingStatus: {
        $in: ["requested", "awaiting_payment", "confirmed", "started"],
      },
    });
    if (existingBooking) {
      return Response.json(
        {
          message: "An active booking already exists.",
          booking: existingBooking,
        },
        { status: 200 }
      );
    }
    const booking = await Booking.create({
      user: session.user.id,
      driver,
      vehicle: vehicleId,
      pickUpAddress,
      dropAddress,
      pickupLocation,
      dropLocation,
      fare,
      userMobileNumber: mobileNumber,
      driverMobileNumber: driver.mobileNumber,
      bookingStatus: "requested",
    });
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
      event: "new-booking",
      userId: driverId,
      data: booking,
    });
    return Response.json(booking, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Create Booking error:: ${error}` },
      { status: 500 }
    );
  }
}
