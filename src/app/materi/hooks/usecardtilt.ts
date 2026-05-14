import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function useCardTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    gsap.to(el, {
      rotateX: y,
      rotateY: x,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
    setHovered(false);
  };

  return { cardRef, hovered, handleMouseMove, handleMouseEnter, handleMouseLeave };
}