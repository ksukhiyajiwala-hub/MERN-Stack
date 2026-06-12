"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  CircleDashed,
  CreditCard,
  Landmark,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { p } from "motion/react-client";
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function Page() {
  const router = useRouter();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [handleBankError, setHandleBankError] = useState("");

  // accountHolderName, accountNumber, upi, ifscCode, mobileNumber
  const sanitizedifsc = ifscCode.trim().toUpperCase();
  const isNameValid = accountHolderName.trim().length >= 4;
  const isAccountNumberValid = /^\d{9,18}$/.test(accountNumber);
  const isIFSCValid = IFSC_REGEX.test(sanitizedifsc);
  const isMobileNumberValid = /^\d{10}$/.test(mobileNumber);
  const isFormValid =
    isNameValid && isAccountNumberValid && isIFSCValid && isMobileNumberValid;

  // const isContinueDisabled = !isFormValid || loading;

  // const handleContinueClick = () => {
  //   if (isFormValid) {
  //     hanldeBank();
  //   } else {
  //     setHandleBankError("Please fill all fields correctly!");
  //   }
  // };
  // accountHolderName, accountNumber, upi, ifscCode, mobileNumber
  const hanldeBank = async () => {
    setHandleBankError("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/partner/onboarding/bank", {
        accountHolderName,
        accountNumber,
        upi,
        ifscCode: sanitizedifsc,
        mobileNumber,
      });
      setLoading(false);

      console.log(data);
      window.location.href = "/";
    } catch (error: any) {
      setLoading(false);
      setHandleBankError(
        error?.response?.data?.message ?? "Somthing went wrong!"
      );
    }
  };

  useEffect(() => {
    const getBankDetails = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/bank");
        setAccountHolderName(data.partnerBank.accountHolderName || "");
        setAccountNumber(data.partnerBank.accountNumber || "");
        setIfscCode(data.partnerBank.ifscCode || "");
        setUpi(data.partnerBank.upi || "");
        setMobileNumber(data.mobileNumber || "");
        console.log(data);
      } catch (error: any) {
        console.log(error);
      }
    };
    getBankDetails();
  }, []);

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
          <p className="text-xs text-gray-500 font-medium">Step 3 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Bank & Payout Setup</h1>
          <p className="text-sm text-gray-500 mt-2">Used for vender payout</p>
        </div>

        {/* -------------Form------------- */}
        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="ahn"
              className="text-xs font-semibold text-gray-500"
            >
              Account holder name
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <BadgeCheck />
              </div>
              <input
                id="ahn"
                type="text"
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${
                  !isNameValid && accountHolderName.length > 0
                    ? "border-red focus:border-red-500"
                    : "border-gray-300 focus:border-black"
                } `}
                placeholder="As per bank records"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
            </div>
            {!isNameValid && accountHolderName.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Minimum 4 characters required
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ban"
              className="text-xs font-semibold text-gray-500"
            >
              Bank account number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <CreditCard />
              </div>
              <input
                id="ban"
                type="text"
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${
                  !isAccountNumberValid && accountNumber.length > 0
                    ? "border-red focus:border-red-500"
                    : "border-gray-300 focus:border-black"
                } `}
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            {!isAccountNumberValid && accountNumber.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Account number must be 9 to 18 digit
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ic" className="text-xs font-semibold text-gray-500">
              IFSC code
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Landmark />
              </div>
              <input
                id="ic"
                type="text"
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${
                  !isIFSCValid && ifscCode.length > 0
                    ? "border-red focus:border-red-500"
                    : "border-gray-300 focus:border-black"
                } `}
                placeholder="Enter IFSC code"
                value={ifscCode.toUpperCase()}
                onChange={(e) => setIfscCode(e.target.value)}
              />
            </div>
            {!isIFSCValid && ifscCode.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                Invalid IFSC code. It should be 11 characters, like ABCD0123456
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mn" className="text-xs font-semibold text-gray-500">
              Mobile number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Phone />
              </div>
              <input
                id="mn"
                type="text"
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${
                  !isMobileNumberValid && mobileNumber.length > 0
                    ? "border-red focus:border-red-500"
                    : "border-gray-300 focus:border-black"
                } `}
                placeholder="10 digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            {!isMobileNumberValid && mobileNumber.length > 0 && (
              <p className="mt-1 text-xs text-red-500">
                mobile number must be 10 digit and should not contain country
                code or special characters
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="upi"
              className="text-xs font-semibold text-gray-500"
            >
              UPI ID (optional)
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                id="upi"
                type="text"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                placeholder="name@upi"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </div>
          </div>
        </div>

        {handleBankError && (
          <p className="text-red-500 mt-4 ">*{handleBankError}</p>
        )}

        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle size={16} className="mt-0.5" />
          <p>
            Bank details are verified before first payout. this usually takes
            24-48 hours.
          </p>
        </div>

        {/* ------------  Submit button  ---------- */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
          // onClick={() => router.push("/partner/onboarding/bank")}
          disabled={!isFormValid || loading}
          onClick={hanldeBank}
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" />
          ) : (
            "Continue"
          )}{" "}
          <ArrowRight size={18} className="text-white" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Page;
