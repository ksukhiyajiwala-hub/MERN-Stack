"use client";
import { BookingStatus, PaymentStatus } from "@/models/booking.model";
import { IUser } from "@/models/user.model";
import { Ivehicle } from "@/models/vehicle.model";
import axios from "axios";
import {
  Bike,
  Calendar,
  Car,
  ChevronRight,
  IndianRupee,
  Loader2,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
interface IBooking {
  user: IUser;
  driver: IUser;
  vehicle: Ivehicle;
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
function Page() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/partner/bookings");
        console.log(data);
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetch();
  }, []);

  const filteredBookings =
    selectedStatus === "All"
      ? bookings
      : bookings.filter(
          (b) => b.bookingStatus === selectedStatus.toLowerCase()
        );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-teal-50 text-teal-700 border-teal-200",
      requested: "bg-amber-50 text-amber-700 border-amber-200",
      awaiting_payment: "bg-blue-50 text-blue-700 border-blue-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      expired: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
      case "bike":
      case "motorcycle":
        return <Bike className="w-4 h-4 text-gray-400" />;
      case "auto":
      case "rickshaw":
        return <Car className="w-4 h-4 text-gray-400" />; // You can add Auto icon if available
      case "truck":
      case "lorry":
        return <Truck className="w-4 h-4 text-gray-400" />;
      case "suv":
      case "sedan":
      case "hatchback":
      default:
        return <Car className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ======= HEADER  ============= */}
      <div className="bg-white border-b border-gray-200">
        <div className=" flex items-center gap-3 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Partner Bookings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {bookings.length} {bookings.length === 1 ? "ride" : "rides"}{" "}
              assigned to you
            </p>
          </div>
        </div>
      </div>

      {/* ======= MAIN CONTENT  ============= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {/* ======= FILTER BAR ============= */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Showing {filteredBookings.length} bookings
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Requested</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* ======= LOADING STATE ============= */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin w-8 h-8 text-black-600" />
            </div>
          )}

          {/* ======= EMPTY STATE ============= */}
          {!loading && filteredBookings.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                No bookings yet
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                When customers book rides, they'll appear here
              </p>
            </div>
          )}

          {!loading && filteredBookings.length > 0 && (
            <div className="space-y-4">
              {filteredBookings.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    {/* CUSTOMER INFO - PARTNER SPECIFIC */}
                    <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-200 flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>

                      {/* CUSTOMER DETAILS */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {b.user?.name || "Customer"}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              b.bookingStatus
                            )}`}
                          >
                            {b.bookingStatus.replace("_", " ")}
                          </span>
                        </div>

                        {(b.userMobileNumber || b.user.mobileNumber) && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>
                              {b.userMobileNumber || b.user.mobileNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* VEHICLE INFO - WITH DYNAMIC ICON */}
                    {b.vehicle && (
                      <div className="px-4 pt-3">
                        <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                          {getVehicleIcon(b.vehicle.type)}
                          <span className="text-xs text-gray-600">
                            {b.vehicle.vehicleModel} •{" "}
                            {b.vehicle.number || "Not assigned"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ADDRESS SECTION */}
                    <div className="p-4 space-y-3">
                      {/* PICKUP */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                            PICKUP
                          </span>
                          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                            {b.pickUpAddress}
                          </p>
                        </div>
                      </div>

                      {/* DROP */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
                            DROP
                          </span>
                          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                            {b.dropAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DATE AND FARE */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(b.createdAt?.toString()!)}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        <span>{b.fare}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span>Payment:</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            b.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {b.paymentStatus || "pending"}
                        </span>
                      </div>

                      {(b.bookingStatus === "completed" ||
                        b.bookingStatus === "confirmed" ||
                        b.bookingStatus === "started") && (
                        <div className="flex items-center gap-2">
                          <button
                            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-lg transition-colors"
                            onClick={() => router.push("/partner/active-ride")}
                          >
                            <span>Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
