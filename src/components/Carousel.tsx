"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import Card, { CardProps } from "@/components/card";

interface CarouselProps {
  items: CardProps[];
}

const CARD_WIDTH = 520;
const SIDE_X = 480;
const SIDE_SCALE = 0.8;
const SIDE_OPACITY = 0.35;
const SIDE_ROTATE_Y = 10;
const DURATION = 0.6;

function getOffset(i: number, active: number, len: number) {
  let offset = (i - active + len) % len;
  if (offset > len / 2) offset -= len;
  return offset;
}

function getProps(offset: number) {
  if (offset === 0) {
    return { x: 0, scale: 1, opacity: 1, rotateY: 0, filter: "blur(0px)", zIndex: 10 };
  }
  if (offset === -1) {
    return { x: -SIDE_X, scale: SIDE_SCALE, opacity: SIDE_OPACITY, rotateY: SIDE_ROTATE_Y, filter: "blur(2px)", zIndex: 5 };
  }
  if (offset === 1) {
    return { x: SIDE_X, scale: SIDE_SCALE, opacity: SIDE_OPACITY, rotateY: -SIDE_ROTATE_Y, filter: "blur(2px)", zIndex: 5 };
  }
  return {
    x: offset < 0 ? -SIDE_X * 2.2 : SIDE_X * 2.2,
    scale: 0.65,
    opacity: 0,
    rotateY: offset < 0 ? SIDE_ROTATE_Y : -SIDE_ROTATE_Y,
    filter: "blur(4px)",
    zIndex: 0,
  };
}

export default function Carousel({ items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const len = items.length;

  useEffect(() => {
    // 1. Set semua card ke posisi final mereka (tanpa animasi dulu)
    items.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const props = getProps(getOffset(i, 0, len));
      el.style.zIndex = String(props.zIndex);
      gsap.set(el, {
        x: props.x,
        scale: props.scale,
        opacity: 0,         // semua mulai invisible
        rotateY: props.rotateY,
        filter: props.filter,
        y: 60,              // mulai dari bawah
      });
    });

    // 2. Entrance animation — staggered dari bawah ke atas
    const tl = gsap.timeline({ delay: 0.15 });

    // Card aktif (index 0) masuk pertama dari bawah
    const activeEl = cardRefs.current[0];
    if (activeEl) {
      tl.to(activeEl, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      }, 0);
    }

    // Card kiri dan kanan masuk bersamaan, sedikit terlambat
    const prevEl = cardRefs.current[(0 - 1 + len) % len];
    const nextEl = cardRefs.current[1 % len];

    if (prevEl) {
      tl.to(prevEl, {
        y: 0,
        opacity: SIDE_OPACITY,
        duration: 0.65,
        ease: "power3.out",
      }, 0.15);
    }

    if (nextEl && nextEl !== prevEl) {
      tl.to(nextEl, {
        y: 0,
        opacity: SIDE_OPACITY,
        duration: 0.65,
        ease: "power3.out",
      }, 0.15);
    }

    // Konten aktif card muncul setelah card masuk
    const activeInner = innerRefs.current[0];
    if (activeInner) {
      gsap.set(activeInner, { y: 16, opacity: 0 });
      tl.to(activeInner, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      }, 0.5);
    }

    // Dots masuk terakhir
    if (dotsRef.current) {
      gsap.set(dotsRef.current, { y: 12, opacity: 0 });
      tl.to(dotsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      }, 0.6);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateAll = useCallback(
    (newActive: number) => {
      items.forEach((_, i) => {
        const el = cardRefs.current[i];
        const inner = innerRefs.current[i];
        if (!el) return;

        const offset = getOffset(i, newActive, len);
        const props = getProps(offset);

        el.style.zIndex = String(props.zIndex);

        gsap.to(el, {
          x: props.x,
          y: 0,
          scale: props.scale,
          opacity: props.opacity,
          rotateY: props.rotateY,
          filter: props.filter,
          duration: DURATION,
          ease: "power3.inOut",
          overwrite: true,
        });

        if (!inner) return;

        if (offset === 0) {
          gsap.fromTo(
            inner,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", delay: 0.28, overwrite: true },
          );
        } else {
          gsap.to(inner, {
            y: 8,
            opacity: 0.6,
            duration: 0.2,
            ease: "power2.in",
            overwrite: true,
          });
        }
      });
    },
    [items, len],
  );

  const go = (index: number) => {
    if (isAnimating.current) return;
    const next = ((index % len) + len) % len;
    if (next === activeIndex) return;
    isAnimating.current = true;
    setActiveIndex(next);
    animateAll(next);
    setTimeout(() => {
      isAnimating.current = false;
    }, DURATION * 1000 + 150);
  };

  return (
    <section className="w-full h-auto flexpb-10 flex-col items-center justify-center">
      {/* Stage */}
      <div
        className="relative w-full h-[100vh]pt-45 pb-30 flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute"
            style={{
              width: `${CARD_WIDTH}px`,
              left: "12%",
              willChange: "transform, opacity, filter",
            }}
          >
            <div ref={(el) => { innerRefs.current[i] = el; }}>
              <Card {...item} />
            </div>
          </div>
        ))}

        <button
          onClick={() => go(activeIndex - 1)}
          aria-label="Previous card"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-violet-50 hover:border-violet-300 active:scale-95 transition-all duration-200"
        >
          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => go(activeIndex + 1)}
          aria-label="Next card"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-violet-50 hover:border-violet-300 active:scale-95 transition-all duration-200"
        >
          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div ref={dotsRef} className="flex gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-7 bg-violet-600"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}