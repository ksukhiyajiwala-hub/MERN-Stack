import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json(
        { message: "User is not authorized" },
        { status: 400 }
      );
    }
    const totalPartner = await User.countDocuments({ role: "partner" });

    const totalApproved = await User.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });

    const totalPending = await User.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });
    const totalRejected = await User.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });

    const pendingPartnersUsers = await User.find({
      role: "partner",
      partnerStatus: "pending",
      partnerOnboardingSteps: { $gte: 3 },
    });

    const partnerIds = pendingPartnersUsers.map((partner) => partner._id);
    const partnerVehicles = await Vehicle.find({ owner: { $in: partnerIds } });
    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [String(v.owner), v.type])
    );
    const pendingPartnersReviews = pendingPartnersUsers.map((p) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      vehicleType: vehicleTypeMap.get(String(p._id)),
    }));

    const pendingVehicle = await Vehicle.find({
      status: "pending",
      baseFare: { $exists: true },
      pricePerKM: { $exists: true },
    }).populate("owner");

    return NextResponse.json(
      {
        pendingVehicle,
        state: { totalApproved, totalPartner, totalPending, totalRejected },
        pendingPartnersReviews,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Dashboard error ${error}`,
      },
      { status: 500 }
    );
  }
}
