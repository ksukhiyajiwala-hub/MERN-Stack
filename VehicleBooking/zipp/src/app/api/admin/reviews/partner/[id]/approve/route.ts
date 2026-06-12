import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
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
    const partnerId = (await context.params).id;
    const partner = await User.findById(partnerId);
    const partnerVehicle = await Vehicle.findOne({ owner: partnerId });
    const partnerDoc = await PartnerDocs.findOne({ owner: partnerId });
    const partnerBank = await PartnerBank.findOne({ owner: partnerId });

    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "Partner not found" }, { status: 400 });
    }
    if (partner.partnerStatus == "approved") {
      return Response.json(
        { message: "Partner already approved" },
        { status: 400 }
      );
    }
    partner.partnerStatus = "approved";
    partner.videoKycStatus = "pending"
    partner.partnerOnboardingSteps = 4;

    partnerVehicle.status = "approved";

    if (!partnerDoc || !partnerBank) {
      return Response.json(
        { message: "Partner didn't complete onBoarding steps" },
        { status: 400 }
      );
    }
    partnerDoc.status = "approved";
    partnerBank.status = "verified";
    await partner.save();
    await partnerVehicle.save();
    await partnerDoc.save();
    await partnerBank.save();
    return Response.json(
      { message: "Partner Approved Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: `Partner Approved error ${error}` },
      { status: 500 }
    );
  }
}
