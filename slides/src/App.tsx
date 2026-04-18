import { useEffect, useState, useCallback, useRef } from "react";
import PixellateTransform from "./PixellateTransform";
import heroImg from "./assets/hero.png";

interface Slide {
  label: string;
  title: string;
  bullets: string[];
  accent?: string;
}

const SLIDES: Slide[] = [
  {
    label: "problem",
    title: "The Problem",
    bullets: [
      "Hundreds of people, one room — mentors invisible, issues invisible",
      "Participants have no way to reach the right person for their problem",
      "Connectivity failures go unnoticed until half the room is affected",
    ],
  },
  {
    label: "solution",
    title: "How HyperLive Fixes It",
    bullets: [
      "Hackers pick their table and describe what they need — one tap",
      "An AI agent matches the request to the right mentor and pings them on Discord by name with the table number",
      "A second agent probes internet speed across all rooms every 10 seconds and auto-posts warnings before anyone notices",
    ],
    accent: "blue",
  },
  {
    label: "stack",
    title: "The Stack",
    bullets: [
      "Next.js dashboard · React context store · Tailwind 4",
      "Express Discord bot exposed publicly via ngrok",
      "Ara AI agents on cron — tool-use loops for dispatch and monitoring",
    ],
  },
];

// Title screen with tilt hero
function TitleSlide({ onNext }: { onNext: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: dy * 5, y: dx * -5 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full max-w-4xl mx-8 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onNext}
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-blue-600" />
        <div className="flex flex-col">
          {/* Hero image */}
          <div className="px-10 pt-10">
            <img
              src={heroImg}
              alt="HyperLive hero"
              className="w-full h-96 object-cover rounded-xl"
              style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.12s ease-out",
              }}
            />
          </div>
          {/* Title below */}
          <div className="px-14 py-12">
            <p className="text-base font-semibold tracking-widest uppercase text-zinc-400 mb-4">
              Ara Hackathon 2026
            </p>
            <h1 className="text-8xl font-semibold tracking-tight text-blue-600 leading-none mb-4">
              HyperLive
            </h1>
            <p className="text-2xl text-zinc-500 leading-snug">
              Real-time operations for Hackathons & Live Tech Events
            </p>
          </div>
        </div>
      </div>
      <p className="text-center text-white/40 text-base mt-5">
        click or press → to begin
      </p>
    </div>
  );
}

const ALL_COUNT = SLIDES.length + 1; // +1 for title

export default function App() {
  const [index, setIndex] = useState(0); // 0 = title, 1..N = slides
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

  const go = useCallback(
    (next: number) => {
      if (animating || next === index) return;
      setDirection(next > index ? "next" : "prev");
      setAnimating(true);
      setVisible(false);
      setTimeout(() => {
        setIndex(next);
        setVisible(true);
        setAnimating(false);
      }, 260);
    },
    [animating, index],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ")
        go(Math.min(index + 1, ALL_COUNT - 1));
      if (e.key === "ArrowLeft") go(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const nudge = direction === "next" ? "-16px" : "16px";
  const transitionStyle = {
    transition: "opacity 260ms ease, transform 260ms ease",
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateX(0) scale(1)"
      : `translateX(${nudge}) scale(0.97)`,
  };

  const slide = index > 0 ? SLIDES[index - 1] : null;
  const isBlue = slide?.accent === "blue";

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0">
        <PixellateTransform />
      </div>

      <div style={transitionStyle}>
        {index === 0 ? (
          <TitleSlide onNext={() => go(1)} />
        ) : (
          <div className="relative z-10 w-full max-w-4xl mx-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div
                className={`h-1 w-full ${isBlue ? "bg-blue-600" : "bg-zinc-800"}`}
              />
              <div className="px-14 py-12">
                <p className="text-base font-semibold tracking-widest uppercase text-zinc-400 mb-5">
                  {String(index).padStart(2, "0")} /{" "}
                  {String(SLIDES.length).padStart(2, "0")} · {slide!.label}
                </p>
                <h2
                  className={`text-7xl font-semibold tracking-tight mb-10 ${isBlue ? "text-blue-600" : "text-zinc-900"}`}
                >
                  {slide!.title}
                </h2>
                <ul className="flex flex-col gap-7">
                  {slide!.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-5 text-zinc-700 text-3xl leading-snug"
                    >
                      <span
                        className={`mt-3.5 w-2.5 h-2.5 rounded-full shrink-0 ${isBlue ? "bg-blue-500" : "bg-zinc-400"}`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2">
        {Array.from({ length: ALL_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-200 cursor-pointer ${
              i === index
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
