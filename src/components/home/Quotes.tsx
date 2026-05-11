"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Quotes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const introLine1Ref = useRef<HTMLDivElement>(null);
  const introLine2Ref = useRef<HTMLDivElement>(null);
  const introLine3Ref = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const roleContainerRef = useRef<HTMLDivElement>(null);

  // ── Register plugin sekali, sebelum paint pertama ──────────────────────────
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // ── ScrollTrigger timeline ─────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(nameContainerRef.current, {
        opacity: 0,
        scale: 0.2,
        filter: "blur(15px)",
      });
      gsap.set(roleContainerRef.current, {
        opacity: 0,
        scale: 0.2,
        filter: "blur(15px)",
      });

      const pinDuration = 7000;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${pinDuration}`,
          scrub: 1.5,
          pin: true,
        },
      });

      // --- SCENE 1: Quote baris 1 keluar ---
      tl.to(
        introLine1Ref.current,
        { x: "-100vw", opacity: 0, ease: "power2.in", duration: 2 },
        0
      )
        .to(
          introLine2Ref.current,
          { x: "100vw", opacity: 0, ease: "power2.in", duration: 2 },
          0
        )
        .to(
          introLine3Ref.current,
          { x: "-100vw", opacity: 0, ease: "power2.in", duration: 2 },
          0
        );

      // --- SCENE 2: Quote baris 2 ---
      tl.to(
        nameContainerRef.current,
        { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 2 },
        2
      );
      tl.to(
        nameContainerRef.current,
        { y: -100, opacity: 0, ease: "power2.in", duration: 1.5 },
        3.5
      );

      // --- SCENE 3: Quote baris 3 ---
      tl.to(
        roleContainerRef.current,
        { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 2 },
        5
      );
      tl.to(
        roleContainerRef.current,
        { opacity: 0, y: -100, ease: "power2.in", duration: 1.5 },
        6.5
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Entrance animation (letter stagger) ───────────────────────────────────
  const renderLetterSpans = (text: string, keyPrefix = "") => {
    return (
      <>
        {text.split("").map((ch, i) => (
          <span
            key={`${keyPrefix}-${i}`}
            className="intro-letter inline-block"
            aria-hidden="true"
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </>
    );
  };

  useEffect(() => {
    const runEntrance = () => {
      const ctx = gsap.context(() => {
        const letters =
          containerRef.current?.querySelectorAll<HTMLElement>(".intro-letter");

        if (letters && letters.length) {
          gsap.set(letters, { y: 50, opacity: 0 });
          gsap.to(letters, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: { each: 0.03, from: "start" },
          });
        }
      }, containerRef);

      return ctx;
    };

    const splashExists = !!document.getElementById("site-splash-wrapper");
    if (!splashExists) {
      const ctx = runEntrance();
      return () => ctx?.revert();
    }

    const observer = new MutationObserver(() => {
      const existsNow = !!document.getElementById("site-splash-wrapper");
      if (!existsNow) {
        observer.disconnect();
        runEntrance();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen text-black overflow-hidden bg-white"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center">

        {/* ── SCENE 1 ── Quote bagian pertama ─────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-[Raleway] z-40 px-8 md:px-20 gap-3">
          <div
            ref={introLine1Ref}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug"
          >
            {renderLetterSpans("Kalkulus mengajarkan bahwa", "l1")}
          </div>
          <div
            ref={introLine2Ref}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug"
          >
            {renderLetterSpans("setiap perubahan memiliki makna dan pola.", "l2")}
          </div>
          <div
            ref={introLine3Ref}
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-400 mt-4"
          >
            {renderLetterSpans("— Kelompok 9, 2026", "l3")}
          </div>
        </div>

        {/* ── SCENE 2 ── Quote bagian kedua ───────────────────────────────── */}
        <div
          ref={nameContainerRef}
          className="absolute inset-0 flex flex-col items-center justify-center font-[Raleway] z-40 px-8 md:px-24 gap-2"
        >
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug text-center">
            Tidak semua hal bisa dipahami secara instan,
          </p>
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug text-center">
            karena proses adalah bagian penting dari hasil.
          </p>
        </div>

        {/* ── SCENE 3 ── Quote bagian ketiga ──────────────────────────────── */}
        <div
          ref={roleContainerRef}
          className="absolute inset-0 flex flex-col items-center justify-center font-[Raleway] z-40 px-8 md:px-24 gap-2"
        >
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug text-center">
            Seperti dalam hidup, memahami langkah demi langkah
          </p>
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug text-center">
            akan membawa kita pada jawaban yang lebih jelas.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Quotes;