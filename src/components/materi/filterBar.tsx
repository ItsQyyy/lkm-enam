"use client";

import { useRef, useState } from "react";
import { FILTER_OPTIONS } from "@/app/materi/constanst";
import { useScrollEntrance } from "@/app/materi/hooks/usescrollentrance";

export function FilterBar() {
  const [active, setActive] = useState<string>("Semua");
  const barRef = useRef<HTMLDivElement>(null);
 
  useScrollEntrance(barRef, { y: 20, threshold: 0.3, duration: 0.5 });
 
  return (
    <div ref={barRef} className="px-6 md:px-16 py-6 max-w-6xl mx-auto">
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`text-xs font-semibold tracking-wide px-4 py-2 rounded-full border transition-all duration-200 ${
              active === f
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
 