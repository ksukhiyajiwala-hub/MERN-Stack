"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { setUserData } from "@/app/redux/userSlice";
import axios from "axios";
import { getSocket } from "@/lib/socket";
const navArray = ["Home", "Bookings", "About Us", "Contact"];
function Nav() {
  const pathName = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const dispach = useDispatch();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispach(setUserData(null));
    setProfileOpen(false);
  };

  const handleFetchCount = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/bookings/pending-requests-count"
      );
      setPendingRequestCount(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.role == "partner") {
      handleFetchCount();
    }
  }, [userData?.role]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-booking", (data) => {
      setPendingRequestCount((prev) => prev + 1);
    });
    return () => {
      socket.off("new-booking");
    };
  }, []);
  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-3 left-1/2 -translate-x-1/2
        w-[94%] md:w-[86%]
        z-50 rounded-full bg-[#0B0B0B] text-white
        shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Image
            src={"/logo.jpeg"}
            alt="logo"
            width={44}
            style={{ height: "auto" }}
            height={44}
            priority
          />

          <div className="hidden md:flex items-center gap-10">
            {userData?.role == "partner" ? (
              <>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/"}
                >
                  Home
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/pending-requests"}
                >
                  Pending Requested
                  <span className="absolute -top-2 -right-5 w-6 h-6 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                    {pendingRequestCount ?? 0}
                  </span>
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"partner/bookings"}
                >
                  Booking
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/active-ride"}
                >
                  Active Ride
                </Link>
              </>
            ) : (
              navArray.map((i, index) => {
                let href;
                if (i == "Home") {
                  href = `/`;
                } else {
                  href = `/user/bookings`;
                }

                const active = href == pathName;
                return (
                  <Link
                    href={href}
                    key={index}
                    className={`text-sm font-medium transition ${
                      active ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {i}
                  </Link>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="hidden md:block relative">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full  border-white text-sm  hover:bg-white hover:text-black"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border"
                      >
                        <div className="p-5">
                          <p className="font-semibold text-lg">
                            {userData.name}
                          </p>
                          <p className="text-xs uppercase text-gray-500 mb-4">
                            {userData.role}
                          </p>
                          {userData.role != "partner" && (
                            <div
                              className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                              onClick={() =>
                                router.push("/partner/onboarding/vehicle")
                              }
                            >
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Bike size={16} />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Car size={16} />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Truck size={16} />
                                </div>
                              </div>
                              Become a Partner
                              <ChevronRight size={16} className="ml-auto" />
                            </div>
                          )}

                          <button
                            className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2"
                            onClick={handleLogout}
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* For Mobile view */}
            <div className="md:hidden">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full  border-white text-sm  hover:bg-white hover:text-black"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                </>
              )}
            </div>

            {/* hamburger */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen((p) => !p)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[85px] left-1/2 w-[92%] bg-[#0b0b0b] rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden"
            >
              <div className="flex flex-col divide-y divide-white/10">
                {userData?.role === "partner" ? (
                  <>
                    <Link
                      href="/partner/active-ride"
                      className="flex justify-between items-center px-6 py-4 text-gray-300 hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>Active Ride</span>
                    </Link>
                    <Link
                      href="/partner/pending-requests"
                      className="flex justify-between items-center px-6 py-4 text-gray-300 hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>Pending Requests</span>
                      {pendingRequestCount > 0 && (
                        <span className="w-6 h-6 bg-red-500 text-xs rounded-full flex items-center justify-center font-bold text-white">
                          {pendingRequestCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/partner/bookings"
                      className="flex justify-between items-center px-6 py-4 text-gray-300 hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>My Bookings</span>
                      {/* {activeCount > 0 && (
                        <span className="w-6 h-6 bg-green-500 text-xs rounded-full flex items-center justify-center font-bold text-white">
                          {activeCount}
                        </span>
                      )} */}
                    </Link>
                  </>
                ) : (
                  navArray.map((i, index) => {
                    let href;
                    if (i == "Home") {
                      href = `/`;
                    } else {
                      href = `/user/${i.toLocaleLowerCase()}`;
                    }
                    return (
                      <Link
                        href={href}
                        key={index}
                        onClick={() => setMenuOpen(false)}
                        className="px-6 py-4 text-gray-300 hover:bg-white/5"
                      >
                        {i}
                      </Link>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed inset-x-0 bottom-0  bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-5">
                <p className="font-semibold text-lg">{userData.name}</p>
                <p className="text-xs uppercase text-gray-500 mb-4">
                  {userData.role}
                </p>
                {userData.role != "partner" && (
                  <div
                    className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                    onClick={() => router.push("/partner/onboarding/vehicle")}
                  >
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Bike size={16} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Car size={16} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                    </div>
                    Become a Partner
                    <ChevronRight size={16} className="ml-auto" />
                  </div>
                )}

                <button
                  className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Nav;
