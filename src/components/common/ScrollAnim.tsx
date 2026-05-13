"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

interface ScrollAnimationsProps {
  children: React.ReactNode;
}

export default function ScrollAnim({ children }: ScrollAnimationsProps) {
  const component = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize animation context
    const ctx = gsap.context(() => {
      // Fade in elements with the .fade-in class when they enter the viewport
      gsap.utils.toArray<HTMLElement>(".fade-in").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Scale in elements with the .scale-in class
      gsap.utils.toArray<HTMLElement>(".scale-in").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Slide in from left
      gsap.utils.toArray<HTMLElement>(".slide-in-left").forEach((el) => {
        gsap.fromTo(
          el,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Slide in from right
      gsap.utils.toArray<HTMLElement>(".slide-in-right").forEach((el) => {
        gsap.fromTo(
          el,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Stagger items
      gsap.utils.toArray<HTMLElement>(".stagger-container").forEach((container) => {
        const items = container.querySelectorAll(".stagger-item");
        
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, component);

    return () => ctx.revert(); // Cleanup animations on component unmount
  }, []);

  return <div ref={component}>{children}</div>;
}