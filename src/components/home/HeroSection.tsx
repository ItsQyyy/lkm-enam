"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ── Helper: split teks jadi span per karakter ─────────────────
function SplitChars({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden">
          {word.split("").map((char, ci) => (
            <span key={ci} className="char inline-block" aria-hidden="true">
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="inline-block" aria-hidden="true">
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textEls = [labelRef.current, headingRef.current].filter(Boolean);

      gsap.from(textEls, {
        x: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sticky top-0 min-h-[95vh] overflow-hidden flex items-center px-10 pt-28">
      {/* ── Video Background ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <video
          src="https://7sqr8euvtsm1cutd.public.blob.vercel-storage.com/team/bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-black/10 to-transparent" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 flex items-center gap-2 
                   bg-white/10 hover:bg-white/20 backdrop-blur-sm
                   border border-white/20 hover:border-white/40
                   text-white rounded-full px-4 py-2
                   transition-all duration-300 cursor-pointer"
        aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
      >
        {isMuted ? (
          // Icon muted
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          </>
        ) : (
          // Icon unmuted
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </>
        )}
      </button>

      {/* ── Konten Teks ─────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-16 pb-10">
        <div className="flex flex-col gap-5 max-w-3xl">

          <span
            ref={labelRef}
            className="text-xs font-semibold tracking-widest text-white/55 uppercase"
          >
            Kelompok 6 · LKM
          </span>

          <h1
            className="font-serif text-5xl md:text-6xl font-bold leading-none tracking-tight text-white mb-4 select-none"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <span className="block" style={{ overflow: "hidden", paddingBottom: "0.06em" }}>
              <span ref={headingRef}>
                <SplitChars text="Orang-Orang" /> <br />
                <SplitChars text="Kece Dibalik" />
              </span>
              <span className="ml-4">
                <SplitChars text="VI-sion" className="text-indigo-300 italic" />
              </span>
            </span>
          </h1>

        </div>
      </div>
    </section>
  );
}