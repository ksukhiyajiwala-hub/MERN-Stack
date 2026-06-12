import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/;
export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }
    console.log(session.user);
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "User not Found!" }, { status: 400 });
    }
    const { type, number, vehicleModel } = await req.json();
    if (!VEHICLE_REGEX.test(number)) {
      return Response.json(
        { message: "Invalid Vehicle Number!" },
        { status: 400 }
      );
    }
    const vehicleNumber = number.toUpperCase();

    let vehicle = await Vehicle.findOne({ owner: user._id });
    if (vehicle) {
      vehicle.type = type;
      vehicle.number = vehicleNumber;
      vehicle.vehicleModel = vehicleModel;
      vehicle.status = "pending";
      user.partnerOnboardingSteps = 3;
      await vehicle.save();
      user.partnerStatus = "pending";
      await user.save();
      return Response.json(vehicle, { status: 200 });
    }
    const duplicateVehicleNumber = await Vehicle.findOne({
      number: vehicleNumber,
    });
    if (duplicateVehicleNumber) {
      return Response.json(
        { message: "Vehicle already Registered!" },
        { status: 400 }
      );
    }
    vehicle = await Vehicle.create({
      type,
      number: vehicleNumber,
      vehicleModel,
      owner: user._id,
    });
    console.log(vehicle);
    if (user.partnerOnboardingSteps < 1) {
      user.partnerOnboardingSteps = 1;
    }
    user.role = "partner";

    await user.save();
    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: `Vehicle erroe: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
    const vehicle = await Vehicle.findOne({ owner: user._id });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not Found!" }, { status: 404 });
    }
    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle error: ${error}` },
      { status: 500 }
    );
  }
}
