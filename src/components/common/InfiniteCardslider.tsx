"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

export interface CardItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  tag?: string;
  progress?: number;
  duration?: string;
  level?: string;
}

interface InfiniteCardSliderProps {
  cards: CardItem[];
  cardWidth?: number;
  cardGap?: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
}

const CARD_COLORS = [
  { bg: "#1a1a2e", accent: "#e94560", tag: "#16213e" },
  { bg: "#0f3460", accent: "#a78bfa", tag: "#1e1b4b" },
  { bg: "#16213e", accent: "#38bdf8", tag: "#0c1929" },
  { bg: "#1e1b4b", accent: "#fb923c", tag: "#0f3460" },
  { bg: "#042f2e", accent: "#34d399", tag: "#022c22" },
];

function LevelBadge({ level }: { level?: string }) {
  const map: Record<string, string> = {
    Pemula: "#22c55e",
    Menengah: "#f59e0b",
    Lanjutan: "#ef4444",
  };
  const color = map[level ?? ""] ?? "#818cf8";
  return (
    <span style={{
      background: color + "22", color,
      border: `1px solid ${color}66`,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700,
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      {level ?? "—"}
    </span>
  );
}

function ProgressBar({ value = 0, accent }: { value?: number; accent?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
        <span>Progress</span><span>{pct}%</span>
      </div>
      <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: accent ? `linear-gradient(90deg,${accent},${accent}99)` : "linear-gradient(90deg,#6366f1,#e94560)", borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── Rect dari DOM element ──────────────────────────────────────────────────
interface Rect { top: number; left: number; width: number; height: number }

// ── Expanded fullscreen overlay ────────────────────────────────────────────
function ExpandedCard({
  card,
  colorIdx,
  originRect,
  onClose,
}: {
  card: CardItem;
  colorIdx: number;
  originRect: Rect;
  onClose: () => void;
}) {
  const col = CARD_COLORS[colorIdx % CARD_COLORS.length];
  const [phase, setPhase] = useState<"from" | "to" | "closing">("from");

  // Ukuran viewport
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;

  const fromStyle: React.CSSProperties = {
    top: originRect.top,
    left: originRect.left,
    width: originRect.width,
    height: originRect.height,
    borderRadius: 20,
  };

  const toStyle: React.CSSProperties = {
    top: 0,
    left: 0,
    width: vw,
    height: vh,
    borderRadius: 0,
  };

  const current = phase === "to" ? toStyle : fromStyle;

  useEffect(() => {
    // Satu frame delay supaya "from" ter-render dulu, lalu animasi ke "to"
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("to"));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Lock body scroll saat expanded
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleClose() {
    setPhase("closing");
    setTimeout(onClose, 380);
  }

  const isOpen = phase === "to";
  const contentVisible = isOpen;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        ...current,
        background: col.bg,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        transition: "top 0.38s cubic-bezier(0.76,0,0.24,1), left 0.38s cubic-bezier(0.76,0,0.24,1), width 0.38s cubic-bezier(0.76,0,0.24,1), height 0.38s cubic-bezier(0.76,0,0.24,1), border-radius 0.38s cubic-bezier(0.76,0,0.24,1)",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: col.accent + "18", pointerEvents: "none", transition: "opacity 0.3s" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: col.accent + "10", pointerEvents: "none" }} />

      {/* Close button — muncul setelah expand selesai */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "scale(1)" : "scale(0.5)",
          transition: "opacity 0.25s 0.25s, transform 0.25s 0.25s",
          backdropFilter: "blur(8px)",
        }}
      >
        ✕
      </button>

      {/* Konten — fade-in setelah expand */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px clamp(1.5rem, 8vw, 6rem) 3rem",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.3s 0.2s, transform 0.3s 0.2s",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 640 }}>
          {/* Tag */}
          {card.tag && (
            <span style={{
              display: "inline-block",
              background: col.tag,
              color: "rgba(255,255,255,0.75)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              marginBottom: 20,
            }}>
              {card.tag}
            </span>
          )}

          {/* Icon */}
          {card.icon && (
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: col.accent + "2a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34,
              border: `1px solid ${col.accent}44`,
              marginBottom: 24,
            }}>
              {card.icon}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            margin: "0 0 16px",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}>
            {card.title}
          </h1>

          {/* Description */}
          <p style={{
            margin: "0 0 32px",
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.8,
          }}>
            {card.description}
          </p>

          {/* Progress */}
          {card.progress !== undefined && (
            <div style={{ marginBottom: 28 }}>
              <ProgressBar value={card.progress} accent={col.accent} />
            </div>
          )}

          {/* Meta */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 20,
            paddingBottom: 32,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            flexWrap: "wrap",
          }}>
            {card.duration && (
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
                ⏱ {card.duration}
              </span>
            )}
            <LevelBadge level={card.level} />
          </div>

          {/* CTA */}
          <button style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 16,
            border: "none",
            background: `linear-gradient(135deg,${col.accent},${col.accent}bb)`,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.02em",
            boxShadow: `0 8px 32px ${col.accent}44`,
          }}>
            Mulai Belajar →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card dalam slider ──────────────────────────────────────────────────────
function SliderCard({
  card,
  colorIdx,
  width,
  onClick,
}: {
  card: CardItem;
  colorIdx: number;
  width: number;
  onClick: (rect: Rect) => void;
}) {
  const col = CARD_COLORS[colorIdx % CARD_COLORS.length];
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleClick() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    onClick({ top: r.top, left: r.left, width: r.width, height: r.height });
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width,
        flexShrink: 0,
        background: col.bg,
        borderRadius: 20,
        padding: "28px 24px 22px",
        border: hovered ? `1px solid ${col.accent}88` : "1px solid rgba(255,255,255,0.08)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "scale(1.04) translateY(-4px)" : "scale(1) translateY(0)",
        boxShadow: hovered ? `0 20px 40px ${col.accent}33` : "none",
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border 0.2s ease",
      }}
    >
      <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: col.accent + "22", pointerEvents: "none" }} />

      {card.tag && (
        <span style={{
          alignSelf: "flex-start",
          background: col.tag, color: "rgba(255,255,255,0.7)",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)",
        }}>{card.tag}</span>
      )}

      {card.icon && (
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: col.accent + "2a",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, border: `1px solid ${col.accent}44`,
        }}>{card.icon}</div>
      )}

      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
        {card.title}
      </h3>

      <p style={{
        margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, flex: 1,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{card.description}</p>

      {card.progress !== undefined && <ProgressBar value={card.progress} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {card.duration && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{"\u23F1"} {card.duration}</span>}
        <LevelBadge level={card.level} />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function InfiniteCardSlider({
  cards,
  cardWidth = 300,
  cardGap = 24,
  autoPlay = true,
  autoPlaySpeed = 50,
}: InfiniteCardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const offsetRef = useRef(0);
  const velRef = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const isSnapping = useRef(false);
  const isPausedRef = useRef(false);

  const [expanded, setExpanded] = useState<{ card: CardItem; colorIdx: number; rect: Rect } | null>(null);

  const REPEAT = Math.max(3, Math.ceil(8 / (cards.length || 1)));
  const repeated = Array.from({ length: REPEAT }, () => cards).flat();
  const unitWidth = cardWidth + cardGap;
  const totalWidth = cards.length * unitWidth;

  const wrapOffset = useCallback((x: number) => ((x % totalWidth) + totalWidth) % totalWidth, [totalWidth]);

  function applyOffset(x: number) {
    if (trackRef.current) trackRef.current.style.transform = `translateX(${-x}px)`;
  }

  // Sync pause ref ke state
  useEffect(() => {
    isPausedRef.current = expanded !== null;
  }, [expanded]);

  useEffect(() => {
    if (!cards.length) return;
    offsetRef.current = totalWidth;
    applyOffset(offsetRef.current);

    let lastTime: number | null = null;
    function tick(ts: number) {
      if (!isDragging.current && !isSnapping.current && autoPlay && !isPausedRef.current) {
        const dt = lastTime == null ? 0 : (ts - lastTime) / 1000;
        lastTime = ts;
        offsetRef.current = wrapOffset(offsetRef.current + autoPlaySpeed * dt);
        applyOffset(offsetRef.current);
      } else {
        lastTime = null;
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, totalWidth, autoPlay, autoPlaySpeed, wrapOffset]);

  function onPointerDown(e: React.PointerEvent) {
    isDragging.current = true;
    didDrag.current = false;
    isSnapping.current = false;
    startX.current = e.clientX;
    startOffset.current = offsetRef.current;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    velRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) didDrag.current = true;
    const now = performance.now();
    const dt = (now - lastT.current) / 1000 || 0.016;
    velRef.current = (lastX.current - e.clientX) / dt;
    lastX.current = e.clientX;
    lastT.current = now;
    offsetRef.current = wrapOffset(startOffset.current - dx);
    applyOffset(offsetRef.current);
  }

  function onPointerUp() {
    if (!isDragging.current) return;
    isDragging.current = false;
    const target = offsetRef.current + velRef.current * 0.12;
    const snapped = Math.round(target / unitWidth) * unitWidth;
    const wrapped = wrapOffset(snapped);
    isSnapping.current = true;
    const start = offsetRef.current;
    const diff = wrapped - start;
    const shortDiff = Math.abs(diff) > totalWidth / 2 ? diff - Math.sign(diff) * totalWidth : diff;
    const duration = 400;
    const startTime = performance.now();
    function snapAnim(ts: number) {
      const t = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      offsetRef.current = wrapOffset(start + shortDiff * ease);
      applyOffset(offsetRef.current);
      if (t < 1) requestAnimationFrame(snapAnim);
      else isSnapping.current = false;
    }
    requestAnimationFrame(snapAnim);
  }

  if (!cards.length) return <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>Tidak ada materi tersedia.</div>;

  return (
    <>
      {expanded && (
        <ExpandedCard
          card={expanded.card}
          colorIdx={expanded.colorIdx}
          originRect={expanded.rect}
          onClose={() => setExpanded(null)}
        />
      )}

      <div
        style={{ width: "100%", overflow: "hidden", position: "relative", cursor: "grab", userSelect: "none", WebkitUserSelect: "none", touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div style={{ position: "absolute", inset: "0 auto 0 0", width: 100, background: "linear-gradient(to right,#ffffff 0%,transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: "0 0 0 auto", width: 100, background: "linear-gradient(to left,#ffffff 0%,transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

        <div ref={trackRef} style={{ display: "flex", gap: cardGap, padding: "2.5rem 0", width: "max-content", willChange: "transform" }}>
          {repeated.map((card, i) => (
            <SliderCard
              key={i}
              card={card}
              colorIdx={i % CARD_COLORS.length}
              width={cardWidth}
              onClick={(rect) => {
                if (!didDrag.current) setExpanded({ card, colorIdx: i % CARD_COLORS.length, rect });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}