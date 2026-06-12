import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
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
    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "Partner not found" }, { status: 400 });
    }
    const roomId = `kyc-${partnerId}-${Date.now()}`;
    partner.videoKycRoomId = roomId;
    partner.videoKycStatus = "in_progress";
    partner.partnerOnboardingSteps = 4;
    partner.save();
    return Response.json({ roomId }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Video KYC start error" }, { status: 500 });
  }
}
