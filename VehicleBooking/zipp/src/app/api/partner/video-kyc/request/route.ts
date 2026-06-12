import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

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
      return Response.json({ message: "User not Found!" }, { status: 400 });
    }
    if (partner.videoKycStatus !== "rejected") {
      return Response.json(
        { message: "You can not send kyc request at this time" },
        { status: 400 }
      );
    }
    partner.videoKycStatus = "pending";
    partner.videoKycRejectionReason = undefined;
    partner.videoKycRoomId = undefined;
    await partner.save();
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Error in retry Kyc ${error}` },
      { status: 500 }
    );
  }
}
