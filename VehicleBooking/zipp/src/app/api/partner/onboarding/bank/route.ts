import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
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
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not Found!" }, { status: 400 });
    }

    const { accountHolderName, accountNumber, upi, ifscCode, mobileNumber } =
      await req.json();
    if (!accountHolderName || !accountNumber || !ifscCode || !mobileNumber) {
      return Response.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }
    const partnerBank = await PartnerBank.findOneAndUpdate(
      { owner: user._id },
      { accountHolderName, accountNumber, upi, ifscCode, status: "added" },
      { new: true, upsert: true }
    );
    user.mobileNumber = mobileNumber;
    user.partnerOnboardingSteps = 3;

    user.partnerStatus = "pending";
    await user.save();
    return Response.json(partnerBank, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Failed to save bank details,${error}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not Found!" }, { status: 400 });
    }
    const partnerBank = await PartnerBank.findOne({ owner: user._id });
    if (!partnerBank) {
      return Response.json(
        { message: "Bank details not Found!" },
        { status: 404 }
      );
    }
    return Response.json(
      { partnerBank, mobileNumber: user.mobileNumber },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: `Failed to fetch bank details,${error}` },
      { status: 500 }
    );
  }
}
