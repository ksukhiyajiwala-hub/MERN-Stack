import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

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
    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return Response.json({ message: "Partner not Found!" }, { status: 400 });
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not Found!" }, { status: 400 });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const baseFare = formData.get("baseFare");
    const waitingCharge = formData.get("waitingCharge");
    const pricePerKM = formData.get("pricePerKM");

    let updated = false;
    if (image && image.size > 0) {
      vehicle.imageUrl = await uploadOnCloudinary(image);
      updated = true;
    }

    if (baseFare !== null) {
      vehicle.baseFare = Number(baseFare);
      updated = true;
    }

    if (pricePerKM !== null) {
      vehicle.pricePerKM = Number(pricePerKM);
      updated = true;
    }

    if (waitingCharge !== null) {
      vehicle.waitingCharge = Number(waitingCharge);
      updated = true;
    }
    if (!updated) {
      return Response.json({ message: `Nothing to update` }, { status: 400 });
    }
    vehicle.status = "pending";
    vehicle.rejectionReason = undefined;
    vehicle.save();

    partner.partnerOnboardingSteps = 6;
    partner.save();

    return Response.json({ message: `Pricing Submitted` }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Error in creating vehicle ${error}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }
    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return Response.json({ message: "Partner not Found!" }, { status: 400 });
    }

    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not Found!" }, { status: 400 });
    }
    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Error in getting vehicle details ${error}` },
      { status: 500 }
    );
  }
}
