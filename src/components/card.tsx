import React from "react";
import Link from "next/link";

export interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  tag?: string;
  href?: string;
  progress?: number; // 0–100
  duration?: string;
  level?: string;
}

const levelColor: Record<string, string> = {
  Pemula: "bg-emerald-100 text-emerald-700",
  Menengah: "bg-amber-100 text-amber-700",
  Lanjutan: "bg-rose-100 text-rose-700",
};

export default function Card({
  title,
  description,
  icon,
  tag,
  href = "#",
  progress,
  duration,
  level,
}: CardProps) {
  return (
    <Link href={href} className="group block focus:outline-none">
      <div
        className="
          items-center flex flex-col h-full
          bg-white rounded-2xl
          border w-3xl border-slate-100
          shadow-sm hover:shadow-xl
          transition-all duration-300
          hover:-translate-y-1
          overflow-hidden
        "
      >
        {/* Top accent bar */}
        <span className=" w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon area */}
        <div className="flex flex-col gap-y-2 items-center px-6 pt-6 pb-3">
          <div className="flex col-span-1 items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 text-2xl shadow-inner">
            {icon ?? "📚"}
          </div>
          {tag && (
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center flex-1 px-6 pb-5 gap-2">
          <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-center text-slate-500 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Meta row */}
          {(level || duration) && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {level && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${levelColor[level]}`}
                >
                  {level}
                </span>
              )}
              {duration && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                  {duration}
                </span>
              )}
            </div>
          )}

          {/* Progress bar */}
          {typeof progress === "number" && (
            <div className="mt-3 w-full">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}