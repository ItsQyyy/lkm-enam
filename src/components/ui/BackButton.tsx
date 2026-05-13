"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: "light" | "dark";
  /** Pesan konfirmasi custom (opsional) */
  confirmMessage?: string;
  /** Nonaktifkan modal konfirmasi, langsung navigate (default: false) */
  noConfirm?: boolean;
}

export default function BackButton({
  href,
  label = "Kembali",
  variant = "light",
  confirmMessage = "Apakah kamu yakin ingin keluar?",
  noConfirm = false,
}: BackButtonProps) {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      btnRef.current,
      { x: -24, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  const navigate = () => {
    setShowModal(false);
    if (href) router.push(href);
    else router.back();
  };

  const handleClick = () => {
    if (noConfirm) { navigate(); return; }
    setShowModal(true);
  };

  const isLight = variant === "light";

  return (
    <>
      {/* ── Button ──────────────────────────────────────────────────── */}
      <motion.button
        ref={btnRef}
        onClick={handleClick}
        whileHover="hover"
        whileTap={{ scale: 0.94 }}
        className={`
          fixed top-6 left-6 z-50
          flex items-center gap-2
          px-4 py-2.5 rounded-2xl
          border backdrop-blur-md
          transition-colors duration-200
          cursor-pointer group
          ${isLight
            ? "bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm hover:shadow-md"
            : "bg-black/30 border-white/20 hover:bg-black/50 hover:border-white/40 shadow-lg"
          }
        `}
      >
        <motion.div
          variants={{ hover: { x: -3 } }}
          transition={{ duration: 0.2 }}
          className={`flex items-center justify-center ${isLight ? "text-gray-700" : "text-white"}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <span
          className={`text-sm font-semibold tracking-wide ${isLight ? "text-gray-700" : "text-white"}`}
          style={{ fontFamily: '"Georgia", serif' }}
        >
          {label}
        </span>
      </motion.button>

      {/* ── Confirmation Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 20 }}
                className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl mx-auto mb-5"
              >
                🚪
              </motion.div>

              {/* Title */}
              <h3
                className="text-xl font-black text-gray-900 mb-2"
                style={{ fontFamily: '"Georgia", serif' }}
              >
                Mau keluar dulu?
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-400 leading-relaxed mb-7">
                {confirmMessage}
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={navigate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-bold cursor-pointer"
                >
                  Ya, keluar
                </motion.button>
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl bg-gray-100 cursor-pointer text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  Tidak, lanjut
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}