import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json(
        { message: "User is not authorized" },
        { status: 400 }
      );
    }
    await connectDb();
    const { reason } = await req.json();
    const vehicleId = (await context.params).id;
    const vehicle = await Vehicle.findById(vehicleId).populate("owner");

    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }
    vehicle.status = "rejected";
    vehicle.rejectionReason = 6;
    vehicle.rejectionReason = reason;
    await vehicle.save();

    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle Rejected error ${error}` },
      { status: 500 }
    );
  }
}
