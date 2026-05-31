import { useEffect, useRef } from "react";
import { useSettings } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const OBJECTS = [
  { char: "⬡", size: 14 },
  { char: "◎", size: 12 },
  { char: "✦", size: 11 },
  { char: "⌘", size: 13 },
  { char: "▣", size: 10 },
  { char: "◈", size: 12 },
  { char: "⬢", size: 14 },
  { char: "✤", size: 11 },
  { char: "⊞", size: 13 },
  { char: "◉", size: 10 },
  { char: "⟐", size: 12 },
  { char: "❋", size: 11 },
  { char: "⌖", size: 13 },
  { char: "◫", size: 12 },
  { char: "⬖", size: 11 },
  { char: "✥", size: 10 },
  { char: "⊡", size: 13 },
  { char: "◬", size: 12 },
];

const FloatingDesignObjects = () => {
  const canvasRef = useRef(null);
  const { data: settings } = useSettings();
  const { theme } = useTheme(settings?.defaultTheme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const C1 = theme === "black" ? "#C6FF34" : "#2563eb";
    const C2 = theme === "black" ? "#9FE870" : "#0ea5e9";
    const C3 = theme === "black" ? "#ffffff" : "#6366f1";

    const colorSets = [
      { color: C1, opacity: 0.22 },
      { color: C1, opacity: 0.14 },
      { color: C2, opacity: 0.18 },
      { color: C2, opacity: 0.1 },
      { color: C3, opacity: 0.08 },
    ];

    const makeParticle = (x, y, burst = false) => {
      const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
      const col = colorSets[Math.floor(Math.random() * colorSets.length)];
      const speed = burst ? 2 + Math.random() * 5 : 0.1 + Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: x ?? Math.random() * window.innerWidth,
        y: y ?? Math.random() * window.innerHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 0.006,
        wander: Math.random() * Math.PI * 2,
        ws: 0.004 + Math.random() * 0.008,
        char: obj.char,
        size: obj.size + Math.random() * 4,
        color: col.color,
        opacity: col.opacity,
        targetOpacity: col.opacity,
        burst,
        life: burst ? 1 : null,
      };
    };

    const particles = Array.from({ length: 35 }, () => makeParticle());

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 12; i++) {
        particles.push(makeParticle(cx, cy, true));
      }
    };
    window.addEventListener("click", onClick);

    let animId;

    const drawCamera = (ctx, x, y, angle, opacity, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;

      const s = size * 0.9;
      // Body
      ctx.beginPath();
      ctx.roundRect(-s, -s * 0.65, s * 2, s * 1.3, 3);
      ctx.stroke();
      // Lens
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      // Viewfinder bump
      ctx.beginPath();
      ctx.rect(-s * 0.25, -s * 0.95, s * 0.5, s * 0.3);
      ctx.stroke();
      // Shutter button
      ctx.beginPath();
      ctx.arc(s * 0.65, -s * 0.55, s * 0.12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawPen = (ctx, x, y, angle, opacity, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;

      const s = size;
      // Pen body
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.4);
      ctx.lineTo(s * 0.3, s * 0.6);
      ctx.lineTo(-s * 0.3, s * 0.6);
      ctx.closePath();
      ctx.stroke();
      // Nib
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, s * 0.6);
      ctx.lineTo(0, s * 1.4);
      ctx.lineTo(s * 0.15, s * 0.6);
      ctx.stroke();
      // Clip line
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(0, s * 0.4);
      ctx.globalAlpha = opacity * 0.5;
      ctx.stroke();

      ctx.restore();
    };

    const drawRuler = (ctx, x, y, angle, opacity, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;

      const s = size;
      ctx.beginPath();
      ctx.rect(-s * 1.4, -s * 0.3, s * 2.8, s * 0.6);
      ctx.stroke();
      for (let i = -4; i <= 4; i++) {
        const h = i % 2 === 0 ? s * 0.3 : s * 0.15;
        ctx.beginPath();
        ctx.moveTo(i * s * 0.3, -h);
        ctx.lineTo(i * s * 0.3, h);
        ctx.globalAlpha = opacity * 0.7;
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawCompass = (ctx, x, y, angle, opacity, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;

      const s = size;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const inner = i % 2 === 0 ? s * 0.5 : s * 0.65;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * s * 0.8, Math.sin(a) * s * 0.8);
        ctx.globalAlpha = opacity * (i % 2 === 0 ? 1 : 0.4);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2);
      ctx.globalAlpha = opacity;
      ctx.stroke();

      ctx.restore();
    };

    const drawTriangle = (ctx, x, y, angle, opacity, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;

      const s = size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s, s);
      ctx.lineTo(-s, s);
      ctx.closePath();
      ctx.stroke();

      // Inner guide lines
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(s * 0.3, s * 0.3);
      ctx.globalAlpha = opacity * 0.4;
      ctx.stroke();

      ctx.restore();
    };

    const drawGrid = (ctx, x, y, angle, opacity, color, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;

      const s = size;
      const step = s * 0.5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * step, -s);
        ctx.lineTo(i * step, s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s, i * step);
        ctx.lineTo(s, i * step);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.rect(-s, -s, s * 2, s * 2);
      ctx.globalAlpha = opacity * 1.5;
      ctx.stroke();

      ctx.restore();
    };

    const DRAWERS = [
      drawCamera,
      drawPen,
      drawRuler,
      drawCompass,
      drawTriangle,
      drawGrid,
    ];

    // Assign a drawer to each particle
    particles.forEach((p, i) => {
      p.drawer = DRAWERS[i % DRAWERS.length];
    });

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.burst) {
          p.life -= 0.012;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.opacity = p.targetOpacity * p.life;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          p.wander += p.ws;
          p.vx += Math.cos(p.wander) * 0.008;
          p.vy += Math.sin(p.wander) * 0.008;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 0.35) {
            p.vx = (p.vx / spd) * 0.35;
            p.vy = (p.vy / spd) * 0.35;
          }
          if (p.x < -60) p.x = W + 60;
          if (p.x > W + 60) p.x = -60;
          if (p.y < -60) p.y = H + 60;
          p.y > H + 60 && (p.y = -60);
        }

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;

        if (p.drawer) {
          p.drawer(ctx, p.x, p.y, p.angle, p.opacity, p.color, p.size);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    // Assign drawers to burst particles too
    const origPush = particles.push.bind(particles);
    particles.push = (...args) => {
      args.forEach((p) => {
        p.drawer = DRAWERS[Math.floor(Math.random() * DRAWERS.length)];
      });
      return origPush(...args);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 100 }}
    />
  );
};

export default FloatingDesignObjects;
