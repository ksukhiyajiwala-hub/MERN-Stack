import mongoose, { Schema } from "mongoose";

export type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export type PaymentStatus = "pending" | "paid" | "cash" | "failed";

export interface IBooking {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;
  pickUpAddress: string;
  dropAddress: string;
  pickupLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  dropLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  fare: number;

  userMobileNumber: string;
  driverMobileNumber: string;

  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;

  adminCommission: number;
  partnerAmount: number;

  pickUpOtp: string;
  pickUpOtpExpires: Date;

  dropOtp: string;
  dropOtpExpires: Date;

  paymentDeadline: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    pickUpAddress: {
      type: String,
      required: true,
    },
    dropAddress: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dropLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    fare: {
      type: Number,
      required: true,
    },
    userMobileNumber: {
      type: String,
      required: true,
    },
    driverMobileNumber: {
      type: String,
      required: true,
    },
    bookingStatus: {
      type: String,
      default: "idle",
      index: true,
    },
    adminCommission: {
      type: Number,
      default: 0,
    },
    partnerAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    pickUpOtp: {
      type: String,
    },
    pickUpOtpExpires: {
      type: Date,
    },
    dropOtp: {
      type: String,
    },
    dropOtpExpires: {
      type: Date,
    },
    paymentDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
