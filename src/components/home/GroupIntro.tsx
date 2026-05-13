"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextHeading from "@/components/ui/TextHeading";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ── Data Gambar ────────────────────────────────────────────────────────────────
// Tambah atau kurangi gambar di sini sesuai kebutuhan
const groupImages = [
  { id: 0, src: "/group/foto-1.jpg", alt: "Foto kelompok 1" },
  { id: 1, src: "/group/foto-2.jpg", alt: "Foto kelompok 2" },
  { id: 2, src: "/group/foto-3.jpg", alt: "Foto kelompok 3" },
  // { id: 3, src: "/group/foto-4.jpg", alt: "Foto kelompok 4" }, // aktifkan jika ada
];

// ── Data Kelompok ──────────────────────────────────────────────────────────────
const groupInfo = {
  number: "6",
  name: "Kelompok 6",
  tagline: "Engineering we trust!!",
  description:
    "Kami adalah Kelompok 6 dari rangkaian Latihan Kepemimpinan Mahasiswa (LKM) Jurusan Informatika. Terbentuk dari berbagai latar belakang dan karakter yang berbeda, kami percaya bahwa keberagaman adalah kekuatan.",
  details: [
    { label: "Angkatan", value: "2025" },
    { label: "Jurusan", value: "Informatika" },
    { label: "Jumlah Anggota", value: "9 Orang" },
  ],
};

// ── ImageStack ─────────────────────────────────────────────────────────────────
function ImageStack({ images }: { images: typeof groupImages }) {
  const [order, setOrder] = useState(() => images.map((_, i) => i));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate setiap 3 detik
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        const first = next.shift()!;
        next.push(first);
        return next;
      });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const posStyles: Record<number, string> = {
    0: "translate-x-0 translate-y-0 z-30 w-72 h-52 md:w-96 md:h-64 lg:w-[26rem] lg:h-72 shadow-2xl",
    1: "-translate-x-5 translate-y-14 z-20 w-64 h-48 md:w-88 md:h-60 lg:w-96 lg:h-64 shadow-xl opacity-90",
    2: "-translate-x-10 translate-y-28 z-10 w-56 h-44 md:w-80 md:h-56 lg:w-88 lg:h-60 shadow-lg opacity-75",
  };

  // untuk gambar ke-4 dst (jika ada lebih dari 3)
  const hiddenStyle = "opacity-0 pointer-events-none z-0 w-56 h-44";

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-80 lg:w-104 lg:h-88 shrink-0">
      {order.map((imageIdx, stackPos) => {
        const img = images[imageIdx];
        const style = posStyles[stackPos] ?? hiddenStyle;

        return (
          <div
            key={img.id}
            className={`absolute left-0 top-0 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${style}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        );
      })}
    </div>
  );
}

// ── GroupIntro ─────────────────────────────────────────────────────────────────
export default function GroupIntro() {
  const textRef = useRef<HTMLDivElement>(null);

  // Scroll parallax masuk dari bawah
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Fade in teks saat scroll
      gsap.fromTo(
        textRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="GroupSection"
      className="relative bg-white"
    >
      <div className="px-6 md:px-16 lg:px-24 pt-16 md:pt-20">
        <TextHeading
          subtitle="Tentang Kami"
          title="Kenali Kelompoknya"
          titleItalic
          subtitleSize="sm"
          animateOnScroll
        />
      </div>

      {/* ── Layout: Gambar kiri, Teks kanan ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 lg:gap-32 py-16 md:py-24 px-6 md:px-16 lg:px-24">

        {/* Gambar (auto-rotate) */}
        <ImageStack images={groupImages} />

        {/* Teks pengenalan kelompok */}
        <div ref={textRef} className="flex flex-col gap-6 max-w-md">

          {/* Nama & tagline */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {groupInfo.name}
            </h2>
            <p className="text-indigo-400 font-medium mt-1 italic">
              &quot;{groupInfo.tagline}&quot;
            </p>
          </div>

          {/* Deskripsi */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            {groupInfo.description}
          </p>

          {/* Detail kelompok */}
          <div className="grid grid-cols-3 gap-4 mt-2">
            {groupInfo.details.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}