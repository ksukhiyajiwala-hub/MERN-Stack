"use client";
import React from "react";
import { motion } from "motion/react";
import { ReceiptIndianRupee } from "lucide-react";
function Footer() {
  return (
    <div className="w-full bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h2 className="text-2xl font-bold tracking-wide">Zipp</h2>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Book any vehicle - from bikes to trucks. Trusted owners, seamless
              rentals, and 24/7 support. Your ride, your way.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                ReceiptIndianRupee,
                ReceiptIndianRupee,
                ReceiptIndianRupee,
                ReceiptIndianRupee,
              ].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -3 }}
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-white uppercase tracking-wider">
              Company
            </h2>
            <ul className="mt-4 space-y-2">
              {["About Us", "Careers", "Blog", "Contact"].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-white uppercase tracking-wider">
              Services
            </h2>
            <ul className="mt-4 space-y-2">
              {["Bike Rental", "Car Rental", "SUV & Van", "Truck Booking"].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-white uppercase tracking-wider">
              stay updated
            </h2>
            <p className="mt-4 text-gray-400 text-sm">
              Subscribe for updates & offers.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-white/10 mt-5">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>©{new Date().getFullYear()} Zipp. All rights reserved.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Footer;
