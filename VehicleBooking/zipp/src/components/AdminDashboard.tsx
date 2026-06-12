"use client";
import axios from "axios";
import { CheckCircle2, Clock, User, Users, Video, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Kpi from "./Kpi";
import TabButton from "./TabButton";
import { AnimatePresence, motion } from "motion/react";
import ContentList from "./ContentList";
import AdminEarning from "./AdminEarning";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/redux/userSlice";
import { useRouter } from "next/navigation";
type State = {
  totalApproved: number;
  totalPartner: number;
  totalPending: number;
  totalRejected: number;
};
type Tab = "partner" | "kyc" | "vehicle";
function AdminDashboard() {
  const [stats, setStats] = useState<State | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("partner");
  const [partnerReviews, setPartnerReviews] = useState<any>();
  const [pendingKyc, setPendingKyc] = useState<any>();
  const [vehicleReviews, setVehicleReviews] = useState<any>();
  const dispach = useDispatch();
  const router = useRouter();
  const handleGetDashBoardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      setStats(data.state);
      setPartnerReviews(data.pendingPartnersReviews);
      setVehicleReviews(data.pendingVehicle);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPendingKyc = async () => {
    try {
      const { data } = await axios.get("/api/admin/video-kyc/pending");
      console.log(data);
      setPendingKyc(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispach(setUserData(null));
    router.push("/");
  };

  useEffect(() => {
    handleGetPendingKyc();
    handleGetDashBoardData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-20020">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center flex-1 gap-3">
            <Image
              src={"/logo.jpeg"}
              alt="logo"
              width={44}
              height={44}
              priority
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-black text-white">
              <User size={14} />
              Admin Dashboard
            </div>

            <div
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white text-red-500 border border-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              <User size={14} />
              Log Out
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Kpi
            label="Total Partners"
            value={stats?.totalPartner}
            icon={<User />}
            varient={"totalPartners"}
          />
          <Kpi
            label="Approved Partners"
            value={stats?.totalApproved}
            icon={<CheckCircle2 />}
            varient={"approved"}
          />
          <Kpi
            label="Pending Partners"
            value={stats?.totalPending}
            icon={<Clock />}
            varient={"pending"}
          />
          <Kpi
            label="Rejected Partners"
            value={stats?.totalRejected}
            icon={<XCircle />}
            varient={"rejected"}
          />
        </div>

        {/* =============== TAB VIEW ====================== */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-wrap gap-2">
          <TabButton
            active={activeTab == "partner"}
            count={partnerReviews?.length ?? 0}
            icon={<Users size={15} />}
            onClick={() => setActiveTab("partner")}
          >
            Pending Partner Reviews
          </TabButton>
          <TabButton
            active={activeTab == "kyc"}
            count={pendingKyc?.length ?? 0}
            icon={<Video size={15} />}
            onClick={() => setActiveTab("kyc")}
          >
            Pending Video Kyc
          </TabButton>
          <TabButton
            active={activeTab == "vehicle"}
            count={vehicleReviews?.length ?? 0}
            icon={<Users size={15} />}
            onClick={() => setActiveTab("vehicle")}
          >
            Pending Vehicle Reviews
          </TabButton>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            {activeTab == "partner" && (
              <ContentList data={partnerReviews ?? []} type={"partner"} />
            )}
            {activeTab == "kyc" && (
              <ContentList data={pendingKyc ?? []} type={"kyc"} />
            )}
            {activeTab == "vehicle" && (
              <ContentList data={vehicleReviews ?? []} type={"vehicle"} />
            )}
          </motion.div>
        </AnimatePresence>
        <AdminEarning />
      </main>
    </div>
  );
}

export default AdminDashboard;
