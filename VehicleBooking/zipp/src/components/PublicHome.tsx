"use client";
import React, { useState } from "react";

import VehicalSlider from "./VehicalSlider";
import AuthModal from "./AuthModal";
import HeroSection from "./HeroSection";

function PublicHome() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <VehicalSlider />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default PublicHome;
