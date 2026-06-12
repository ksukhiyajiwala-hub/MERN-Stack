"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  LocateFixed,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { vehicleType } from "@/models/vehicle.model";
import axios from "axios";

const setpVarients = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
type place = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  lat: number;
  lng: number;
};
function Page() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<vehicleType>();
  const [mobile, setMobile] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [pickUpCountry, setPickUpCountry] = useState("");
  const [pickUpLat, setPickUpLat] = useState<number>();
  const [pickUpLon, setPickUpLon] = useState<number>();
  const [dropCountry, setDropCountry] = useState("");
  const [dropLat, setDropLat] = useState<number>();
  const [dropLon, setDropLon] = useState<number>();
  const [locating, setLocating] = useState(false);
  const [pickUpSuggestions, setPickupSuggestion] = useState<place[]>([]);
  const [dropSuggestions, setDropSuggestion] = useState<place[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const VEHICLES = [
    { id: "bike", label: "Bike", Icon: Bike, desc: "Quick & affordable" },
    { id: "auto", label: "Auto", Icon: Car, desc: "Everyday rides" },
    { id: "car", label: "Car", Icon: Car, desc: "Comfort rides" },
    { id: "loading", label: "Loading", Icon: Truck, desc: "Small cargo" },
    { id: "truck", label: "Truck", Icon: Truck, desc: "Heavy transport" },
  ];
  const progress = [
    !!vehicle,
    !!(mobile.length == 10),
    !!pickup,
    !!drop,
  ].filter(Boolean).length;

  const searchAddress = async (
    q: string,
    setResults: (r: place[]) => void,
    restrict?: string | null
  ) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([]);
        return;
      }
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          q.trim()
        )}&limit=8&lang=en`
      );
      let results: place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        countrycode: f.properties.countrycode,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));
      if (restrict) {
        results = results.filter((r) => r.country == restrict);
      }
      setResults(results);
    } catch (error) {
      setResults([]);
      console.log(error);
    }
  };
  const suggestion = (p: place) =>
    [p.name, p.city, p.state, p.country].filter(Boolean).join(",");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (coords) => {
      try {
        const { data } = await axios.get(
          `https://photon.komoot.io/reverse?lon=${coords.coords.longitude}&lat=${coords.coords.latitude}`
        );
        if (data.features.length > 0) {
          const properties = data.features[0].properties;
          const address = [
            properties.name,
            properties.street,
            properties.city,
            properties.country,
          ]
            .filter(Boolean)
            .join(",");
          setPickup(address);
          setPickUpCountry(properties.country);
          setPickUpLat(coords.coords.latitude);
          setPickUpLon(coords.coords.longitude);
          setPickupSuggestion([]);
          setLocating(false);
        }

        console.log(data.features[0].properties);
      } catch (error) {
        setLocating(false);
        console.log(error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* ==============    HEADER  ============= */}
        <div className="flex items-center gap-4 mb-6 px-1">
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm hover:bg-zinc-50 transition-colors shrink-0 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={17} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-zinc-900 text-xl font-black tracking-tight">
              Book a Ride
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              Fill in the details below
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {[0, 1, 2, 3].map((d, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i < progress ? 20 : 8,
                  background: i < progress ? "#09090b" : "#d4d4d8",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-visible">
          <div className="h-1 bg-zinc-900 w-[90%] m-auto" />

          <div className="p-6 space-y-7">
            {/* ================  CHOOSE VEHICLE  ================ */}
            <motion.div
              variants={setpVarients}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.05 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <p className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 text-white  text-[9px] font-black">
                  1
                </p>
                <p className="text-xs font-bold text-zinc-500 tracking-widest">
                  CHOOSE VEHICLE
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2.5">
                  {VEHICLES.map((v, i) => {
                    const Icon = v.Icon;
                    const active = vehicle == v.id;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        className={`relative rounded-2xl border p-4 flex items-center gap-2 transform ${
                          active
                            ? "bg-black text-white border-black"
                            : "border-gray-200 hover:border-black "
                        }`}
                        onClick={() => setVehicle(v.id as vehicleType)}
                      >
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            active
                              ? "bg-white text-black"
                              : "bg-zinc-200 text-black"
                          }`}
                        >
                          <Icon />
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold">{v.label}</div>
                          <p
                            className={`text-xs ${
                              active ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {v.desc}
                          </p>
                        </div>
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2.5 right-2.5"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-white fill-white/20"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <div className="h-px bg-zinc-200" />

            {/* ================  MOBILE  ================ */}
            <motion.div>
              <div className="flex items-center gap-3 mb-3">
                <p className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 text-white  text-[9px] font-black">
                  2
                </p>
                <p className="text-xs font-bold text-zinc-500 tracking-widest">
                  MOBILE
                </p>
              </div>

              <div className="flex items-center border border-zinc-200 rounded-2xl gap-3 px-4 py-3 focus-within:border-zinc-900 focus-within:bg-white transition-all">
                <div className="rounded-xl w-8 h-8 bg-zinc-200 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-zinc-800" />
                </div>

                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter your mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  type="tel"
                  className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
                <AnimatePresence>
                  {mobile.length == 10 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 fill-emerald-50 shrink-0"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-zinc-400 text-[10px] mt-1.5 ml-1">
                Ride updates will be sent to this number
              </p>
            </motion.div>

            <div className="h-px bg-zinc-200" />
            {/* =================  ROUTE  ================= */}
            <motion.div>
              <div className="flex items-center gap-3 mb-3">
                <p className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 text-white  text-[9px] font-black">
                  3
                </p>
                <p className="text-xs font-bold text-zinc-500 tracking-widest">
                  ROUTE
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-visible">
                {/* ==============  PICKUP LOCATION  ============== */}
                <div className="relative z-30">
                  <div className="flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors ">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow"></div>
                      <div className="w-px h-5 bg-zinc-300 mt-1"></div>
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                      placeholder="Pickup location"
                      onChange={(e) => {
                        setPickup(e.target.value);
                        searchAddress(e.target.value, setPickupSuggestion);
                      }}
                      value={pickup}
                    />
                    <motion.button
                      onClick={getCurrentLocation}
                      whileTap={{ scale: 0.88 }}
                      className="w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition-colors flex items-center justify-center shrink-0"
                      disabled={locating}
                    >
                      <LocateFixed
                        size={14}
                        className={`text-zinc-700 ${
                          locating ? "animate-spin" : ""
                        }`}
                      />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {pickUpSuggestions?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-28 overflow-y-auto z-10"
                      >
                        {pickUpSuggestions.map((p, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
                            onClick={() => {
                              setPickup(suggestion(p));
                              setPickUpCountry(p.country || "");
                              setPickUpLat(p.lat);
                              setPickUpLon(p.lng);
                              setPickupSuggestion([]);
                            }}
                          >
                            <MapPin
                              size={13}
                              className="text-zinc-400 shrink-0"
                            />
                            <span className="text-sm text-zinc-800 font-medium truncate">
                              {suggestion(p)}
                            </span>
                            <ChevronRight
                              size={13}
                              className="text-zinc-300 shrink-0 ml-auto"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="h-px bg-zinc-200" />

                {/* ==============  DROP LOCATION  ============== */}
                <div className="relative z-20">
                  <div className="flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl transition-colors ">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow"></div>
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none"
                      placeholder={
                        pickUpCountry
                          ? "Drop Location"
                          : "Select Pickup Location First"
                      }
                      onChange={(e) => {
                        setDrop(e.target.value);
                        searchAddress(
                          e.target.value,
                          setDropSuggestion,
                          pickUpCountry
                        );
                      }}
                      disabled={!pickUpCountry}
                      value={drop}
                    />
                    <Navigation size={14} className="text-zinc-300 shrink-0" />
                  </div>

                  <AnimatePresence>
                    {dropSuggestions?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-28 overflow-y-auto z-50"
                      >
                        {dropSuggestions.map((d, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
                            onClick={() => {
                              setDrop(suggestion(d));
                              setDropCountry(d.country || "");
                              setDropLat(d.lat);
                              setDropLon(d.lng);
                              setDropSuggestion([]);
                            }}
                          >
                            <Navigation
                              size={13}
                              className="text-zinc-400 shrink-0"
                            />
                            <span className="text-sm text-zinc-800 font-medium truncate">
                              {suggestion(d)}
                            </span>
                            <ChevronRight
                              size={13}
                              className="text-zinc-300 shrink-0 ml-auto"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={setpVarients}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <motion.button
                disabled={!(progress === 4) || isNavigating}
                whileTap={
                  !(progress === 4) || isNavigating ? {} : { scale: 0.97 }
                }
                // whileHover={}
                className="w-full h-14 bg-zinc-900 rounded-2xl text-white font-black text-sm hover:bg-black disabled:opacity-35 tracking-wide flex items-center justify-center gap-2.5 transition-colors shadow-lg disabled:shadow-none"
                onClick={() => {
                  setIsNavigating(true);
                  router.push(
                    `/user/search?pickup=${encodeURIComponent(
                      pickup
                    )}&drop=${encodeURIComponent(
                      drop
                    )}&vehicle=${vehicle}&mobileNumber=${encodeURIComponent(
                      mobile
                    )}&pickLat=${pickUpLat}&pickLon=${pickUpLon}&dropLat=${dropLat}&dropLon=${dropLon}`
                  );
                }}
              >
                {isNavigating ? (
                  <CircleDashed className="animate-spin" />
                ) : (
                  "Continue"
                )}

                <ArrowRight size={17} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
