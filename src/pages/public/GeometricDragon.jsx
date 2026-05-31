import { useEffect, useRef } from "react";
import { useSettings } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const GeometricDragon = () => {
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

    // Mouse position
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const makeDragon = ({
      segments,
      segLen,
      color,
      headScale,
      variant,
      followSpeed,
      offset,
    }) => {
      const spine = Array.from({ length: segments }, () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }));
      return {
        spine,
        segments,
        segLen,
        color,
        headScale,
        variant,
        followSpeed,
        offset,
        headX: window.innerWidth / 2,
        headY: window.innerHeight / 2,
        time: Math.random() * 100,
      };
    };

    const dragons = [
      // Fastest — sticks close to cursor
      makeDragon({
        segments: 80,
        segLen: 18,
        color: C1,
        headScale: 1,
        variant: "diamond",
        followSpeed: 0.12,
        offset: { x: 0, y: 0 },
      }),
      // Medium — lags behind
      makeDragon({
        segments: 50,
        segLen: 14,
        color: C2,
        headScale: 0.7,
        variant: "spine",
        followSpeed: 0.06,
        offset: { x: 40, y: -30 },
      }),
      // Slowest — trails far behind
      makeDragon({
        segments: 35,
        segLen: 22,
        color: C3,
        headScale: 1.3,
        variant: "orb",
        followSpeed: 0.03,
        offset: { x: -50, y: 40 },
      }),
    ];

    const updateDragon = (d) => {
      d.time += 0.008;

      // Each dragon follows mouse at its own speed with a unique offset
      const targetX = mouse.x + d.offset.x;
      const targetY = mouse.y + d.offset.y;

      d.headX += (targetX - d.headX) * d.followSpeed;
      d.headY += (targetY - d.headY) * d.followSpeed;

      d.spine[0].x += (d.headX - d.spine[0].x) * 0.2;
      d.spine[0].y += (d.headY - d.spine[0].y) * 0.2;

      for (let i = 1; i < d.segments; i++) {
        const dx = d.spine[i - 1].x - d.spine[i].x;
        const dy = d.spine[i - 1].y - d.spine[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist > d.segLen) {
          const r = (dist - d.segLen) / dist;
          d.spine[i].x += dx * r * 0.85;
          d.spine[i].y += dy * r * 0.85;
        }
      }
    };

    const drawHead = (d) => {
      const s = d.spine[0];
      const next = d.spine[1];
      if (!next) return;
      const dx = s.x - next.x;
      const dy = s.y - next.y;
      const a = Math.atan2(dy, dx);
      const hs = d.headScale;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(a);

      ctx.beginPath();
      ctx.moveTo(16 * hs, 0);
      ctx.lineTo(0, 7 * hs);
      ctx.lineTo(-10 * hs, 0);
      ctx.lineTo(0, -7 * hs);
      ctx.closePath();
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(10 * hs, -5 * hs);
      ctx.lineTo(17 * hs, -13 * hs);
      ctx.moveTo(10 * hs, 5 * hs);
      ctx.lineTo(17 * hs, 13 * hs);
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(8 * hs, 0, 1.5 * hs, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = 0.4;
      ctx.fill();

      ctx.restore();
    };

    const drawDiamond = (d) => {
      for (let i = d.segments - 1; i >= 1; i--) {
        const t = i / d.segments;
        const s = d.spine[i];
        const prev = d.spine[i - 1];
        const dx = prev.x - s.x;
        const dy = prev.y - s.y;
        const a = Math.atan2(dy, dx);
        const w = (1 - t) * 11 * d.headScale + 1.5;
        const op = (1 - t) * 0.16 + 0.015;
        const pulse = 1 + Math.sin(d.time * 2.5 - i * 0.18) * 0.07;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(a);

        ctx.beginPath();
        ctx.moveTo(w * pulse, 0);
        ctx.lineTo(0, w * 0.45 * pulse);
        ctx.lineTo(-w * pulse, 0);
        ctx.lineTo(0, -w * 0.45 * pulse);
        ctx.closePath();
        ctx.globalAlpha = op;
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = d.color;
          ctx.globalAlpha = op * 2;
          ctx.fill();
        }
        ctx.restore();
      }
      drawHead(d);
    };

    const drawSpine = (d) => {
      for (let i = d.segments - 1; i >= 1; i--) {
        const t = i / d.segments;
        const s = d.spine[i];
        const prev = d.spine[i - 1];
        const dx = prev.x - s.x;
        const dy = prev.y - s.y;
        const a = Math.atan2(dy, dx);
        const w = (1 - t) * 7 * d.headScale + 1;
        const op = (1 - t) * 0.14 + 0.01;
        const wave = Math.sin(d.time * 3 - i * 0.25) * 3;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(a);

        ctx.beginPath();
        ctx.moveTo(w, wave);
        ctx.lineTo(0, w * 0.6 + wave);
        ctx.lineTo(-w, wave);
        ctx.lineTo(0, -w * 0.6 + wave);
        ctx.closePath();
        ctx.globalAlpha = op;
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(0, w * 0.8);
          ctx.lineTo(0, -w * 0.8);
          ctx.globalAlpha = op * 0.6;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
        ctx.restore();
      }
      drawHead(d);
    };

    const drawOrb = (d) => {
      for (let i = d.segments - 1; i >= 1; i--) {
        const t = i / d.segments;
        const s = d.spine[i];
        const op = (1 - t) * 0.12 + 0.01;
        const r = (1 - t) * 8 * d.headScale + 1;
        const pulse = 1 + Math.sin(d.time * 2 - i * 0.2) * 0.1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * pulse, 0, Math.PI * 2);
        ctx.globalAlpha = op;
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        if (i % 6 === 0) {
          const prev = d.spine[i - 1];
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(prev.x, prev.y);
          ctx.globalAlpha = op * 0.5;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
        ctx.restore();
      }
      drawHead(d);
    };

    let animId;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dragons.forEach((d) => {
        updateDragon(d);
        if (d.variant === "diamond") drawDiamond(d);
        else if (d.variant === "spine") drawSpine(d);
        else drawOrb(d);
      });
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
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

export default GeometricDragon;
