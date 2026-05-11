"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextHeadingProps {
  subtitle?: string;
  title: string;
  titleItalic?: boolean;
  subtitleItalic?: boolean;
  lineColor?: string;
  className?: string;
  animateOnScroll?: boolean;
  align?: "left" | "center" | "right";
  subtitleSize?: "sm" | "md" | "lg" | "xl" | "8xl";
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "8xl" | "9xl";
  lineWidth?: "sm" | "md" | "lg";
  showLine?: boolean;
}

export default function TextHeading({
  subtitle,
  title,
  titleItalic = false,
  subtitleItalic = false,
  lineColor = "bg-gray-400",
  className = "",
  animateOnScroll = true,
  align = "left",
  subtitleSize = "md",
  titleSize = "lg",
  lineWidth = "md",
  showLine = true,
}: TextHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const flexAlign = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align];

  const textAlign = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  const subtitleSizes: Record<string, string> = {
    sm: "text-base sm:text-lg md:text-xl",
    md: "text-xl sm:text-2xl md:text-3xl",
    lg: "text-2xl sm:text-3xl md:text-4xl",
    xl: "text-3xl sm:text-4xl md:text-5xl",
    "8xl": "text-8xl sm:text-[5rem] md:text-[6rem]",
  };

  const titleSizes: Record<string, string> = {
    sm: "text-xl sm:text-2xl md:text-3xl",
    md: "text-2xl sm:text-3xl md:text-4xl",
    lg: "text-3xl sm:text-4xl md:text-5xl",
    xl: "text-4xl sm:text-5xl md:text-6xl",
    "2xl": "text-5xl sm:text-6xl md:text-7xl",
    "3xl": "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
    "8xl": "text-8xl sm:text-[5rem] md:text-[6rem]",
    "9xl": "text-9xl sm:text-[5.625rem] md:text-[6.25rem]",
  };

  const lineWidths: Record<string, string> = {
    sm: "w-8 sm:w-12 md:w-16",
    md: "w-12 sm:w-16 md:w-20",
    lg: "w-16 sm:w-20 md:w-24",
  };

  useEffect(() => {
    if (!animateOnScroll) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      if (subtitle && subtitleRef.current) {
        tl.from(subtitleRef.current, {
          x: align === "right" ? 30 : -30,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
        });
      }

      if (showLine && lineRef.current) {
        tl.from(
          lineRef.current,
          { width: 0, duration: 0.9, ease: "power2.out" },
          subtitle ? "-=0.4" : 0
        );
      }

      if (titleRef.current) {
        tl.from(
          titleRef.current,
          { y: 24, opacity: 0, duration: 1, ease: "power2.out" },
          "-=0.5"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animateOnScroll, subtitle, showLine, align]);

  const subtitleRow = subtitle && (
    <div className={`flex items-center gap-2 ${flexAlign}`}>
      {showLine && align === "right" && (
        <div
          ref={lineRef}
          className={`h-0.5 sm:h-1 ${lineWidths[lineWidth]} ${lineColor} shrink-0`}
        />
      )}

      <span
        ref={subtitleRef}
        className={`${subtitleSizes[subtitleSize]} font-semibold leading-tight`}
      >
        {subtitleItalic ? <i>{subtitle}</i> : subtitle}
      </span>

      {showLine && align !== "right" && (
        <div
          ref={lineRef}
          className={`h-0.5 sm:h-1 ${lineWidths[lineWidth]} ${lineColor} shrink-0`}
        />
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`text-black ${className}`}
    >
      {subtitleRow}
      <span
        ref={titleRef}
        className={`${titleSizes[titleSize]} font-bold block mt-1 ${textAlign}`}
      >
        {titleItalic ? <i>{title}</i> : title}
      </span>
    </div>
  );
}