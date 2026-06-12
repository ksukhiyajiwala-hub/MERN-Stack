import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function GET(
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
    const vehicleId = (await context.params).id;
    const vehicle = await Vehicle.findById(vehicleId).populate("owner");

    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }
    vehicle.status = "approved";
    vehicle.rejectionReason = undefined;
    await vehicle.save();

    const partner = await User.findById(vehicle.owner._id);
    if (!partner) {
      return Response.json({ message: "Partner Not found" }, { status: 400 });
    }
    partner.partnerOnboardingSteps = 7;
    await partner.save();
    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle not found ${error}` },
      { status: 500 }
    );
  }
}
