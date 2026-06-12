import mongoose from "mongoose";

export type vehicleType = "bike" | "car" | "loading" | "auto" | "truck";

export interface Ivehicle {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const vehicleSchema = new mongoose.Schema<Ivehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["bike", "car", "loading", "auto", "truck"],
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
    },
    baseFare: {
      type: Number,
    },
    pricePerKM: {
      type: Number,
    },
    waitingCharge: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
