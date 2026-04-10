import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion as Motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";

const PHASES = [
  "Analyzing your idea...",
  "Desinging layout & structure...",
  "Writing HTML & CSS...",
  "Adding animation & interactions...",
  "Final quality checks...",
];
function Generate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [indexOfPhases, setIndexOfPhases] = useState(0);
  const [error, setError] = useState("");

  const handleGenerateWebiste = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      );
      setProgress(100);
      setLoading(false);
      navigate(`/editor/${result.data.websiteId}`);
      console.log("Fetched result:::", result);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message || "Somthing went wrong");
      console.log("Errorrr::::", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      setIndexOfPhases(0);
      setProgress(0);
      return;
    }
    let value = 0;
    let phase = 0;
    const interval = setInterval(() => {
      const increament =
        value < 20
          ? Math.random() * 1.5
          : value < 60
          ? Math.random() * 1.2
          : Math.random() * 0.6;
      value += increament;
      if (value >= 93) value = 93;
      phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1
      );

      setProgress(Math.floor(value));
      setIndexOfPhases(phase);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">
              SiteForge<span className="text-zinc-400">.ai</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl mb:text-5xl font-bold mb-5 leading-tight">
            Build Website with{" "}
            <span className="block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            This process may take several minutes. SiteForge.ai focus on quality,
            not shortcuts
          </p>
        </Motion.div>

        <div className="mb-14">
          <h1 className="text-xl font-semibold mb-2">Describe your website</h1>
          <div className="relative">
            <textarea
              placeholder="Desscribe your website in details..."
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            ></textarea>
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex justify-center">
          <Motion.button
            disabled={!prompt.trim() && loading}
            className={`px-14 py-4 rounded-2xl font-semibold text-lg ${
              prompt.trim() && !loading
                ? "bg-white text-black"
                : "bg-white/20 text-zinc-400 cursor-not-allowed"
            }`}
            onClick={handleGenerateWebiste}
          >
            Generate Website
          </Motion.button>
        </div>
        {loading && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto mt-12"
          >
            <div className="flex justify-between mb-2 text-xs text-zinc-400">
              <span>{PHASES[indexOfPhases]}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <Motion.div
                className="h-full bg-linear-to-r from-white to-zinc-300"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.8 }}
              />
            </div>

            <div className="text-center text-xs text-zinc-400 mt-4">
              Estimated time remainingL{" "}
              <span className="text-white font-medium"> ~8-12 minutes</span>
            </div>
          </Motion.div>
        )}
      </div>
    </div>
  );
}

export default Generate;
