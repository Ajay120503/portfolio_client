import { useEffect, useRef } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useSettings } from "../../hooks/usePortfolioData";

const OBJECTS = [
  { char: "</>", size: 13 },
  { char: "{  }", size: 12 },
  { char: "( )", size: 11 },
  { char: "●", size: 6 },
  { char: "◆", size: 7 },
  { char: "▲", size: 8 },
  { char: "[ ]", size: 12 },
  { char: "=>", size: 11 },
  { char: "○", size: 10 },
  { char: "···", size: 10 },
  { char: "&&", size: 11 },
  { char: "◉", size: 8 },
  { char: "fn()", size: 12 },
  { char: "~~", size: 10 },
  { char: "**", size: 11 },
];

const FloatingObjects = () => {
  const canvasRef = useRef(null);
  const { data: settings } = useSettings();
  const { theme } = useTheme(settings?.defaultTheme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Colors based on theme
    const primaryColor = theme === "black" ? "#C6FF34" : "#2563eb";
    const secondaryColor = theme === "black" ? "#9FE870" : "#0ea5e9";
    const tertiaryColor = theme === "black" ? "#FFFFFF" : "#000000";

    const colorSets = [
      { color: primaryColor, opacity: 0.65 },
      { color: primaryColor, opacity: 0.45 },
      { color: secondaryColor, opacity: 0.55 },
      { color: secondaryColor, opacity: 0.35 },
      { color: tertiaryColor, opacity: 0.15 },
    ];

    const particles = Array.from({ length: 28 }, (_, i) => {
      const obj = OBJECTS[i % OBJECTS.length];
      const col = colorSets[i % colorSets.length];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 0.008,
        wander: Math.random() * Math.PI * 2,
        ws: 0.005 + Math.random() * 0.012,
        char: obj.char,
        size: obj.size,
        color: col.color,
        opacity: col.opacity * (0.6 + Math.random() * 0.4),
      };
    });

    let animId;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        // Wander steering
        p.wander += p.ws;
        p.vx += Math.cos(p.wander) * 0.012;
        p.vy += Math.sin(p.wander) * 0.012;

        // Clamp speed
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 0.85) {
          p.vx = (p.vx / speed) * 0.85;
          p.vy = (p.vy / speed) * 0.85;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;

        // Wrap edges
        if (p.x < -40) p.x = W + 40;
        if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40;
        if (p.y > H + 40) p.y = -40;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.font = `500 ${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default FloatingObjects;
