import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
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
    const { rejectionReason } = await req.json();
    const partnerId = (await context.params).id;
    const partner = await User.findById(partnerId);
    const partnerVehicle = await Vehicle.findOne({ owner: partnerId });
    const partnerDoc = await PartnerDocs.findOne({ owner: partnerId });
    const partnerBank = await PartnerBank.findOne({ owner: partnerId });
    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "Partner not found" }, { status: 400 });
    }

    partner.partnerStatus = "rejected";
    partner.rejectionReason = rejectionReason;
    partnerDoc.status = "rejected";
    partnerBank.status = "added";
    partnerVehicle.status = "rejected";

    await partner.save();
    await partnerVehicle.save();
    await partnerDoc.save();
    await partnerBank.save();
    return Response.json(
      { message: "Partner Rejected Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: `Partner Reject error ${error}` },
      { status: 500 }
    );
  }
}
