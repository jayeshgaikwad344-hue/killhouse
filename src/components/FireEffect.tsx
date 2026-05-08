import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

export default function FireEffect({ active, intensity = 5 }: { active: boolean, intensity?: number }) {
  const [embers, setEmbers] = useState<{ id: number; left: string; size: number; duration: string; delay: string }[]>([]);
  const [smoke, setSmoke] = useState<{ id: number; left: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    if (!active) {
      setEmbers([]);
      setSmoke([]);
      return;
    }

    // Inverse intensity: higher intensity = lower interval duration (more frequent)
    const intervalDuration = Math.max(50, 400 - (intensity * 35));

    const interval = setInterval(() => {
      const now = Date.now();
      setEmbers(prev => [
        ...prev.slice(-(5 + intensity * 5)), // More embers with higher intensity
        {
          id: now + Math.random(),
          left: `${Math.random() * 100}%`,
          size: Math.random() * (4 + intensity) + 3,
          duration: `${Math.random() * 2 + 2}s`,
          delay: `${Math.random() * 0.5}s`
        }
      ]);
      
      setSmoke(prev => [
        ...prev.slice(-(2 + intensity)), // More smoke with higher intensity
        {
          id: now + Math.random() + 10,
          left: `${(Math.random() * 100)}%`,
          duration: `${Math.random() * 3 + 4}s`,
          delay: `${Math.random() * 2}s`
        }
      ]);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9998] pointer-events-none"
          >
            <div className="fire-glow" />
            <div className="fire-container">
              {smoke.map(s => (
                <div
                    key={s.id}
                    className="smoke-element"
                    style={{
                        left: s.left,
                        animationDuration: s.duration,
                        animationDelay: s.delay
                    } as React.CSSProperties}
                />
              ))}
              {embers.map(e => (
                <div
                  key={e.id}
                  className="fire-ember"
                  style={{
                    left: e.left,
                    width: `${e.size}px`,
                    height: `${e.size * 2}px`,
                    animationDuration: e.duration,
                    animationDelay: e.delay,
                  } as React.CSSProperties}
                />
              ))}
            </div>

            <div className="flames-overlay">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`flame-${i}`}
                  className="flame-element"
                  style={{
                    left: `${(i / 20) * 100}%`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    height: `${150 + Math.random() * 200}px`,
                    width: `${100 + Math.random() * 100}px`
                  } as React.CSSProperties}
                />
              ))}
            </div>
            
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <filter id="heatDistortion">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5">
                  <animate attributeName="baseFrequency" dur="10s" values="0.02;0.03;0.02" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="35" />
              </filter>
            </svg>
            <div className="heat-haze" />
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {active && `
          body {
            filter: sepia(0.3) saturate(2.2) hue-rotate(-10deg);
            transition: filter 0.5s ease;
            animation: crash-shake 0.15s infinite;
          }
          @keyframes crash-shake {
            0%, 100% { transform: translate(0, 0); }
            20% { transform: translate(-3px, 3px); }
            40% { transform: translate(-3px, -3px); }
            60% { transform: translate(3px, 3px); }
            80% { transform: translate(3px, -3px); }
          }
          .liquid-mesh {
            background: radial-gradient(circle at center, #2a0000 0%, #450a0a 50%, #1a0000 100%) !important;
          }
          .blob {
             background: #7f1d1d !important;
             opacity: 0.5 !important;
          }
        `}
      </style>
    </>
  );
}
