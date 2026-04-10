import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import LoginModel from "../components/LoginModel";
import { useDispatch, useSelector } from "react-redux";
import { Coins } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Home() {
  const highLights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];

  const [openLogin, setOpenLogin] = useState(false);
  //to get data from redux
  const { userData } = useSelector((state) => state.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [websites, setWebsites] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //For Logout API
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(data);
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (err) {
      console.log("Error:::", err);
    }
  };

  useEffect(() => {
    if (!userData) return;
    const handleGetAllWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        console.log(result.data);
        setWebsites(result.data || []);
      } catch (errors) {
        console.log("Error", errors);
      }
    };
    handleGetAllWebsite();
  }, [userData]);

  return (
    <div className="relative min-h-screen bg-transparent text-white overflow-hidden">
      <Motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold">SiteForge AI</div>
          <div className="flex items-center gap-5">
            <div
              className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </div>

            {userData && (
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition"
                onClick={() => navigate("/pricing")}
              >
                <Coins className="text-yellow-400" size={14} />
                <span>Credits</span>
                <span>{userData.credits}</span>
                <span className="font-semibold">+</span>
              </div>
            )}

            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm cursor-pointer"
                onClick={() => {
                  setOpenLogin(true);
                }}
              >
                Get Started
              </button>
            ) : (
              <div className="relative">
                <button
                  className="flext items-center"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <img
                    src={
                      userData.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  ></img>
                </button>

                <AnimatePresence>
                  {openProfile && (
                    <>
                      <Motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium truncate">
                            {userData.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {userData.email}
                          </p>
                        </div>
                        <button className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5">
                          <Coins className="text-yellow-400" size={14} />
                          <span>Credits</span>
                          <span>{userData.credits}</span>
                          <span className="font-semibold">+</span>
                        </button>

                        <button
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5"
                          onClick={() => navigate("/dashboard")}
                        >
                          Dashboard
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </Motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </Motion.div>

      <section className="pt-44 pb-25 px-6 text-center">
        <Motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Build Professional Websites <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            with AI
          </span>
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mac-w-2xl mx-aut text-zinc-400 text-lg"
        >
          Turn your ideas into fast, responsive, and production-ready websites —
          no coding required.
        </Motion.p>

        <button
          className="px-10 py-4 rounded-xl bg-white text-black font-semibold cursor-pointer hover:scale-105 transition mt-12"
          onClick={() =>
            userData ? navigate("/dashboard") : setOpenLogin(true)
          }
        >
          {userData ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>

      {!userData && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highLights.map((h, i) => (
              <Motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-8"
              >
                <h1 className="text-xl font-semibold mb-3">{h}</h1>
                <p className="text-sm text-zinc-400">
                  GenWeb.ai builds real websites - clean code, animations,
                  responsiveness and scalable structure.
                </p>
              </Motion.div>
            ))}
          </div>
        </section>
      )}

      {userData && websites?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <h3 className="text-2xl font-semibold mb-6">Your Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {websites.slice(0, 3).map((w) => (
              <Motion.div
                key={w._id}
                whileHover={{ y: -6 }}
                className=" cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                onClick={() => navigate(`/editor/${w._id}`)}
              >
                <div className="h-40 bg-black">
                  <iframe
                    srcDoc={w.latestCode}
                    className="w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold line-clamp-2">
                    {w.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Last Updated {new Date(w.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </section>
      )}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} SiteForge AI. All rights reserved.
      </footer>

      {openLogin && (
        <LoginModel
          open={openLogin}
          onClose={() => {
            setOpenLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default Home;
