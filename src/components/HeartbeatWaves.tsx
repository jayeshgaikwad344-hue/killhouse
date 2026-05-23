import { useEffect, useRef } from "react";

export default function HeartbeatWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isInViewRef = useRef(true);

  useEffect(() => {
    if (window.innerWidth < 1200) return; // Only enable on high-end desktop resolutions

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = isInViewRef.current;
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasInView) {
          animationFrameId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    setCanvasSize();

    const draw = () => {
      if (!isInViewRef.current) {
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Heartbeat pulse calculation
      // A quick double spike followed by a rest Period
      const pulseCycle = time % 4; // 4 second cycle
      let pulseIntensity = 0;
      if (pulseCycle < 0.3) {
        pulseIntensity = Math.sin((pulseCycle / 0.3) * Math.PI); // First spike
      } else if (pulseCycle > 0.4 && pulseCycle < 0.8) {
        pulseIntensity = Math.sin(((pulseCycle - 0.4) / 0.4) * Math.PI) * 0.7; // Second spike
      }

      const waveCount = 5;
      const verticalSpacing = canvas.height / (waveCount + 1);

      for (let i = 0; i < waveCount; i++) {
        const yBase = verticalSpacing * (i + 1);
        
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = i % 2 === 0 
          ? `rgba(255, 255, 255, ${0.03 + (pulseIntensity * 0.05)})` 
          : `rgba(220, 38, 38, ${0.02 + (pulseIntensity * 0.04)})`; // Subtle Red Tint for alternating waves

        for (let x = 0; x < canvas.width; x += 16) {
          // Distance from mouse
          const dx = x - mouseRef.current.x;
          const dy = yBase - mouseRef.current.y;
          const distSq = dx * dx + dy * dy;
          const mouseEffect = distSq < 160000 ? 1 - Math.sqrt(distSq) / 400 : 0;
          
          // Wave composition
          const baseWave = Math.sin(x * 0.01 + time) * 10;
          const pulseWave = Math.sin(x * 0.05 + time * 5) * 20 * pulseIntensity;
          const distortion = mouseEffect > 0 ? Math.sin(x * 0.02 + time * 2) * 50 * mouseEffect : 0;
          
          const y = yBase + baseWave + pulseWave + distortion;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
    />
  );
}
