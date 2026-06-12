"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  CircleDashed,
  Package,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { set } from "mongoose";

function Page() {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [handleVehicleError, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVehicle = async () => {
    setError("");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/partner/onboarding/vehical", {
        type: vehicleType,
        number: vehicleNumber,
        vehicleModel: vehicleModel,
      });
      setLoading(false);
      router.push("/partner/onboarding/documents");
    } catch (error: any) {
      setLoading(false);

      setError(error?.response?.data?.message ?? "Somthing went wrong!");
    }
  };

  useEffect(() => {
    const handleVehicle = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/vehical");
        console.log(data);
        setVehicleType(data.type);
        setVehicleNumber(data.number);
        setVehicleModel(data.vehicleModel);
      } catch (error: any) {
        console.log(error);
      }
    };
    handleVehicle();
  }, []);

  const VEHICLES = [
    { id: "bike", label: "Bike", icon: Bike, desc: "2 wheeler" },
    { id: "auto", label: "Auto", icon: Car, desc: "3 wheeler ride" },
    { id: "car", label: "Car", icon: Car, desc: "4 wheeler ride" },
    { id: "loading", label: "Loading", icon: Package, desc: "Small goods" },
    { id: "truck", label: "Truck", icon: Truck, desc: "Heavy transport" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        {/* ==================== Header ================= */}
        <div className="relative text-center">
          <button
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-xs text-gray-500 font-medium">Step 1 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Vehicle Details</h1>
          <p className="text-sm text-gray-500 mt-2">
            Add your vehicle information
          </p>
        </div>

        {/* ========== FORM ============== */}
        <div className="mt-8 space-y-6">
          {/* VEHICLE TYPE */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">
              Vehicle Type
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VEHICLES.map((v, i) => {
                const Icon = v.icon;
                const active = vehicleType == v.id;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transform ${
                      active
                        ? "bg-black text-white border-black"
                        : "border-gray-200 hover:border-black cursor-pointer"
                    }`}
                    onClick={() => setVehicleType(v.id)}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        active ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      <Icon />
                    </div>

                    <div className="text-sm font-semibold">{v.label}</div>
                    <p
                      className={`text-xs ${
                        active ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {v.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Number */}
          <div>
            <label htmlFor="vn" className="text-xs font-semibold text-gray-500">
              Vehicle Number
            </label>
            <input
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              type="text"
              id="vn"
              className="mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition"
              placeholder="GJ05LV1234"
            />
          </div>

          {/* Vehicle Model */}
          <div>
            <label htmlFor="vm" className="text-xs font-semibold text-gray-500">
              Vehicle Model
            </label>
            <input
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              type="text"
              id="vm"
              className="mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition"
              placeholder="Tata Ace"
            />
          </div>

          {handleVehicleError && (
            <p className="text-red-500 mt-4">*{handleVehicleError}</p>
          )}

          {/* Continue Button */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
            // onClick={() => router.push("/partner/onboarding/documents")}
            onClick={handleVehicle}
          >
            {loading ? (
              <CircleDashed className="text-white animate-spin" />
            ) : (
              "Continue"
            )}{" "}
            <ArrowRight size={18} className="text-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
