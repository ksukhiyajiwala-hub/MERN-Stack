"use client";
import { Ivehicle } from "@/models/vehicle.model";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, IndianRupee } from "lucide-react";
import { url } from "inspector";
import { base } from "motion/react-client";
import axios from "axios";
import { useRouter } from "next/router";
type PropsType = {
  open: boolean;
  onClose: () => void;
  data: Ivehicle | null;
};
function PricingModal({ open, onClose, data }: PropsType) {
  const [image, setIImage] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>();
  const [baseFare, setBaseFare] = useState("");
  const [pricePerKM, setPricePerKM] = useState("");
  const [waitingCharge, setWaitingCharge] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setPreview(data.imageUrl || null);
      setBaseFare(data.baseFare?.toString() || "");
      setPricePerKM(data.pricePerKM?.toString() || "");
      setWaitingCharge(data.waitingCharge?.toString() || "");
    }
  }, [data]);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("baseFare", baseFare);
      formData.append("pricePerKM", pricePerKM);
      formData.append("waitingCharge", waitingCharge);
      if (image) {
        formData.append("image", image);
      }
      const { data } = await axios.post(
        "/api/partner/onboarding/pricing",
        formData
      );
      setLoading(false);
      console.log(data);
      onClose();
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message ?? error);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bg-black/60 inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Pricing and Vehicle Image</h2>
            </div>

            <div className="p-6 space-y-6">
              <label
                htmlFor="imageLabel"
                className="relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer"
              >
                {!preview ? (
                  <ImagePlus size={28} />
                ) : (
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  />
                )}
                <input
                  id="imageLabel"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setIImage(e.target.files?.[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>

              <div>
                <p className="mb-1 font-semibold text-sm">Base Fare</p>
                <div className="border rounded-xl flex items-center gap-2 px-4 py-3 bg-white">
                  <IndianRupee size={18} />
                  <input
                    type="text"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    className="w-full outline-none"
                    placeholder="Enter Base fare"
                  />
                </div>
              </div>

              <div>
                <p className="mb-1 font-semibold text-sm">Price Per KM</p>
                <div className="border rounded-xl flex items-center gap-2 px-4 py-3 bg-white">
                  <IndianRupee size={18} />
                  <input
                    type="text"
                    value={pricePerKM}
                    onChange={(e) => setPricePerKM(e.target.value)}
                    className="w-full outline-none"
                    placeholder="Enter Price Per KM"
                  />
                </div>
              </div>

              <div>
                <p className="mb-1 font-semibold text-sm">
                  Waiting charge / min
                </p>
                <div className="border rounded-xl flex items-center gap-2 px-4 py-3 bg-white">
                  <IndianRupee size={18} />
                  <input
                    type="text"
                    value={waitingCharge}
                    onChange={(e) => setWaitingCharge(e.target.value)}
                    className="w-full outline-none"
                    placeholder="Enter Waiting Charge"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                className="flex-1 border py-2 rounded-xl"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-black text-white rounded-xl py-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PricingModal;
