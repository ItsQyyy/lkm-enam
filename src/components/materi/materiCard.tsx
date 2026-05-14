"use client";

import Link from "next/link";
import { Materi } from "@/app/materi/types/materi";
import { LEVEL_STYLE } from "@/app/materi/constanst/index";
import { useCardTilt } from "@/app/materi/hooks/usecardtilt";
import { useScrollEntrance } from "@/app/materi/hooks/usescrollentrance";

interface MateriCardProps {
  item: Materi;
  index: number;
}
 
export function MateriCard({ item, index }: MateriCardProps) {
  const { cardRef, hovered, handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardTilt();
 
  useScrollEntrance(cardRef, { delay: (index % 3) * 0.1 });
 
  return (
    <Link href={item.href}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 cursor-pointer will-change-transform"
        style={{
          boxShadow: hovered
            ? "0 20px 48px rgba(99,102,241,0.12)"
            : "0 2px 12px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.3s",
        }}
      >
        {/* Top accent bar */}
        <span className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
        {/* Nomor + Icon */}
        <div className="flex items-start justify-between">
          <span className="text-xs font-mono text-slate-300 tracking-widest">{item.nomor}</span>
          <span className="text-2xl">{item.icon}</span>
        </div>
 
        {/* Tag */}
        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 border border-slate-200 rounded-full px-3 py-1 w-fit">
          {item.tag}
        </span>
 
        {/* Judul */}
        <h3 className="text-[15px] font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors duration-200">
          {item.judul}
        </h3>
 
        {/* Deskripsi */}
        <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2 flex-1">
          {item.deskripsi}
        </p>
 
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${LEVEL_STYLE[item.level]}`}>
            {item.level}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ClockIcon />
            {item.durasi}
          </span>
        </div>
 
        {/* Progress */}
        <ProgressBar value={item.progress} />
 
        {/* Arrow */}
        <div className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-indigo-50 transition-all duration-200">
          <ChevronRightIcon />
        </div>
      </div>
    </Link>
  );
}
 
// ─── Sub-components ──────────────────────────────────────────────────────────
 
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-auto pt-2 border-t border-slate-50">
      <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
        <span>Progress</span>
        <span className="font-medium text-slate-600">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
 
function ClockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
  );
}
 
function ChevronRightIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}