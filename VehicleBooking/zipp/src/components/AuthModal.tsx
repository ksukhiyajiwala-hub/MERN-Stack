import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleDashed, Lock, Mail, User, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
type PropType = {
  open: boolean;
  onClose: () => void;
};

type stepType = "login" | "signup" | "otp";

function AuthModal({ open, onClose }: PropType) {
  const [step, setStep] = useState<stepType>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // const session = useSession();

  //Handling Signup on Signup Button Click
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setStep("otp");
      setLoading(false);
      setError("");
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message ?? "Somthing went wrong");
    }
  };

  // Email verification
  const handleEmailVerification = async () => {
    console.log(otp.join(""));
    console.log(email);

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-email", {
        otp: otp.join(""),
        email,
      });
      console.log(data);
      setOtp(["", "", "", "", "", ""]);
      setStep("login");
      setLoading(false);
      setError("");
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message ?? "Somthing went wrong");
    }
  };

  // Handle signin on Login Button Click
  const handleSignIn = async () => {
    setLoading(true);
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    
    onClose();
    if (response?.error) {
      console.log(response.error);
      alert("Invalid email or password");
      return;
    }
    console.log(response);
  };

  const handleGoogleLogin = async () => {
    console.log("goolge login called");
    await signIn("google");
  };

  const handleChangeOtp = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Blur View */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-90 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          >
            {/* Center Login page */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] text-black"
            >
              <div className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black">
                {/* close button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
                >
                  <X size={20} />
                </button>
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font font-extrabold tracking-widest">
                    ZIPP
                  </h1>
                  <p className="mt-1 text-xs text-gray-500">
                    Premium Vehicle Booking
                  </p>
                </div>
                <button
                  className="flex items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition w-full h-11 rounded-xl border border-black/20 cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  <Image
                    src={"/google.png"}
                    alt="google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-black/10 flex-1" />
                  <div className="text-xs text-gray-500">Or</div>
                  <div className="h-px bg-black/10 flex-1" />
                </div>
                <div>
                  {/* Login */}
                  {step == "login" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Welcome Back</h1>

                      <div className="mt-5 space-y-4 ">
                        {/* Email input */}
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input
                            type="text"
                            placeholder="email"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>

                        {/* password input */}
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="password"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                        </div>

                        <button
                          className="w-full bg-black text-white h-11 rounded-xl font-semibold hover:bg-gray-900 transition cursor-pointer flex items-center justify-center"
                          disabled={loading}
                          onClick={handleSignIn}
                        >
                          {!loading ? (
                            "Login"
                          ) : (
                            <CircleDashed
                              size={18}
                              color="white"
                              className="animate-spin"
                            />
                          )}
                        </button>

                        <p className="flex items-center justify-center gap-1 mt-6 text-sm text-gray-500 text-center">
                          Don&rsquo;t have an account?{" "}
                          <button
                            className="text-black font-medium hover:underline hover:cursor-pointer"
                            onClick={() => setStep("signup")}
                          >
                            Signup
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* singup */}
                  {step == "signup" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Create Account</h1>

                      <div className="mt-5 space-y-4 ">
                        {/* Full name input */}
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <User size={18} className="text-gray-500" />
                          <input
                            type="text"
                            placeholder="Full name"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                          />
                        </div>

                        {/* Email input */}
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input
                            type="text"
                            placeholder="Email address"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>

                        {/* Password input */}
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="password"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                        </div>
                        {error && <p className="text-red-500">*{error}</p>}
                        <button
                          className="w-full bg-black text-white h-11 rounded-xl font-semibold hover:bg-gray-900 transition cursor-pointer flex justify-center items-center"
                          disabled={loading}
                          onClick={handleSignUp}
                        >
                          {!loading ? (
                            "Send Otp"
                          ) : (
                            <CircleDashed
                              size={18}
                              color="white"
                              className="animate-spin"
                            />
                          )}
                        </button>

                        <p className="flex items-center justify-center gap-1 mt-6 text-sm text-gray-500 text-center">
                          Already have an account?{" "}
                          <button
                            className="text-black font-medium hover:underline hover:cursor-pointer"
                            onClick={() => setStep("login")}
                          >
                            Login
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Otp Verification */}

                  {step == "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-xl font-semibold">Verify Email</h2>
                      <div className="mt-6 flex justify-between gap-1">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            value={digit}
                            maxLength={1}
                            className="w-10 h-12 sm:w-12 border border-black/20 rounded-xl text-lg outline-none font-semibold text-center "
                            onChange={(e) => handleChangeOtp(i, e.target.value)}
                          />
                        ))}
                      </div>
                      {error && <p className="text-red-500">*{error}</p>}
                      <button
                        className="w-full mt-6 bg-black text-white h-11 rounded-xl font-semibold hover:bg-gray-900 transition cursor-pointer flex justify-center items-center"
                        onClick={handleEmailVerification}
                      >
                        {!loading ? (
                          "Verify and Create Account"
                        ) : (
                          <CircleDashed
                            size={18}
                            color="white"
                            className="animate-spin"
                          />
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
