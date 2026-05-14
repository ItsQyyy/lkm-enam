import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface UseScrollEntranceOptions {
  delay?: number;
  threshold?: number;
  y?: number;
  duration?: number;
}

export function useScrollEntrance(
  ref: React.RefObject<HTMLElement | null>,
  { delay = 0, threshold = 0.15, y = 48, duration = 0.65 }: UseScrollEntranceOptions = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { y, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { y: 0, opacity: 1, duration, delay, ease: "power3.out" });
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay, threshold, y, duration]);
}