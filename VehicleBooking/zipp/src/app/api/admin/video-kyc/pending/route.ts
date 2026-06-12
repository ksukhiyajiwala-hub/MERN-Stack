import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json(
        { message: "User is not authorized" },
        { status: 400 }
      );
    }
    const partner = await User.find({
      role: "partner",
      partnerOnboardingSteps:4,
      videoKycStatus: { $in: ["pending", "in_progress"] },
    });

    return Response.json(partner, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Partner kyc get error" }, { status: 500 });
  }
}
