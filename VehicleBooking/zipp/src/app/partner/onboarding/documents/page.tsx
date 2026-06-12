"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CircleDashed,
  FileCheck,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

type docsType = "aadhar" | "license" | "rc";
function Page() {
  const router = useRouter();
  const [docs, setDocs] = useState<Record<docsType, File | null>>({
    aadhar: null,
    license: null,
    rc: null,
  });
  const handleImage = (doc: docsType, file: File | null) => {
    if (!file) return;
    setDocs((prev) => ({ ...prev, [doc]: file }));
  };

  const [loading, setLoading] = useState(false);
  const [handleDocError, setHandleDocError] = useState("");
  const isCompleted = docs.aadhar && docs.license && docs.rc;

  const handleDocs = async () => {
    try {
      setLoading(true);
      setHandleDocError("");
      const formData = new FormData();
      if (!docs.aadhar || !docs.license || !docs.rc) {
        setLoading(false);
        setHandleDocError("All documents are required!");
        return null;
      }
      formData.append("aadharCard", docs.aadhar as Blob);
      formData.append("license", docs.license as Blob);
      formData.append("rc", docs.rc as Blob);
      const { data } = await axios.post(
        "/api/partner/onboarding/documents",
        formData
      );
      setLoading(false);
      console.log(data);
      router.push("/partner/onboarding/bank");
    } catch (error: any) {
      setLoading(false);
      setHandleDocError(
        error?.response?.data?.message ?? "Somthing went wrong!"
      );
      console.log(error);
    }
  };
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
          <p className="text-xs text-gray-500 font-medium">Step 2 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Upload Documents</h1>
          <p className="text-sm text-gray-500 mt-2">
            Required for verification
          </p>
        </div>

        {/* Upload Document */}

        <div className="mt-8 space-y-5">
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
              <p className="text-sm font-semibold">Aadhar / ID Proof</p>
              <p className="text-xs text-gray-500">Government issued ID</p>
            </div>
            <div className="flex items-center gap-3">
              {docs.aadhar ? (
                <span className="text-green-600 font-medium text-xs">
                  Uploaded
                </span>
              ) : (
                <span className="text-xs text-gray-400">Upload</span>
              )}

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
            </div>
            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) =>
                handleImage("aadhar", e.target?.files?.[0] || null)
              }
            />
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
              <p className="text-sm font-semibold">Driving License</p>
              <p className="text-xs text-gray-500">Valid driving license</p>
            </div>
            <div className="flex items-center gap-3">
              {docs.license ? (
                <span className="text-green-600 font-medium text-xs">
                  Uploaded
                </span>
              ) : (
                <span className="text-xs text-gray-400">Upload</span>
              )}
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
            </div>
            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) =>
                handleImage("license", e.target?.files?.[0] || null)
              }
            />
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
              <p className="text-sm font-semibold">Vehicle RC</p>
              <p className="text-xs text-gray-500">Refistration Certificate</p>
            </div>
            <div className="flex items-center gap-3">
              {docs.rc ? (
                <span className="text-green-600 font-medium text-xs">
                  Uploaded
                </span>
              ) : (
                <span className="text-xs text-gray-400">Upload</span>
              )}
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
            </div>
            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) => handleImage("rc", e.target?.files?.[0] || null)}
            />
          </motion.label>
        </div>

        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <FileCheck size={16} className="mt-0.5" />
          <p>Documets are securely stored and manually verified</p>
        </div>
        {handleDocError && (
          <p className="mt-4 text-sm text-red-500">{handleDocError}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading || !isCompleted}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
          // onClick={() => router.push("/partner/onboarding/bank")}
          onClick={handleDocs}
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" />
          ) : (
            "Continue"
          )}
          <ArrowRight size={18} className="text-white" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Page;
