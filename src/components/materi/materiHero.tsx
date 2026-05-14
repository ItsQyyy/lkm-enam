"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { Materi } from "@/app/materi/types/materi";

interface MateriHeroProps {
  items: Materi[];
}

export function MateriHero({ items }: MateriHeroProps) {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [labelRef.current, headingRef.current, subRef.current, statsRef.current];
    gsap.set(elements, { y: 30, opacity: 0 });

    gsap
      .timeline({ delay: 0.1 })
      .to(labelRef.current,   { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0)
      .to(headingRef.current, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" }, 0.1)
      .to(subRef.current,     { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.22)
      .to(statsRef.current,   { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.32);
  }, []);

  const stats = computeStats(items);

  return (
    <section className="px-6 md:px-16 pt-20 pb-16 max-w-6xl mx-auto">
      <p ref={labelRef} className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-500 mb-5">
        — Materi Pembelajaran
      </p>

      <h1 ref={headingRef} className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-5">
        Semua yang perlu<br />
        kamu{" "}
        <span className="text-indigo-500">kuasai,</span>{" "}
        <span className="text-violet-500">satu tempat.</span>
      </h1>

      <p ref={subRef} className="text-base text-slate-400 max-w-xl leading-relaxed mb-10">
        Sembilan modul terstruktur — dari dasar hingga lanjutan. Belajar dengan ritme kamu sendiri, pantau progresmu, dan tumbuh bersama.
      </p>

      <div ref={statsRef} className="flex flex-wrap gap-8">
        {stats.map(({ val, label }) => (
          <div key={label}>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{val}</p>
            <p className="text-xs text-slate-400 tracking-wide mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeStats(items: Materi[]) {
  const selesai   = items.filter((m) => m.progress === 100).length;
  const berjalan  = items.filter((m) => m.progress > 0 && m.progress < 100).length;
  const totalJam  = items.reduce((acc, m) => acc + parseInt(m.durasi), 0);

  return [
    { val: String(items.length), label: "Total Materi" },
    { val: `${totalJam}+`,       label: "Jam Konten" },
    { val: String(berjalan),     label: "Sedang Berjalan" },
    { val: String(selesai),      label: "Selesai" },
  ];
}