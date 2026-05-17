import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

export default function FireEffect({ active, intensity = 5 }: { active: boolean, intensity?: number }) {
  const [embers, setEmbers] = useState<{ id: number; left: string; size: number; duration: string; delay: string }[]>([]);

  useEffect(() => {
    if (!active) {
      setEmbers([]);
      return;
    }

    const intervalDuration = Math.max(100, 500 - (intensity * 40));

    const interval = setInterval(() => {
      const now = Date.now();
      setEmbers(prev => [
        ...prev.slice(-(2 + intensity * 2)),
        {
          id: now + Math.random(),
          left: `${Math.random() * 100}%`,
          size: Math.random() * (3 + intensity) + 2,
          duration: `${Math.random() * 2 + 1.5}s`,
          delay: `${Math.random() * 0.2}s`
        }
      ]);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [active, intensity]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
          >
            <div className="fire-glow" />
            <div className="fire-container">
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
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`flame-${i}`}
                  className="flame-element"
                  style={{
                    left: `${(i / 12) * 100}%`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    height: `${120 + Math.random() * 100}px`,
                    width: `${80 + Math.random() * 60}px`
                  } as React.CSSProperties}
                />
              ))}
            </div>
            
            <div className="heat-haze" />
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {active && `
          @keyframes crash-shake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-1px, 1px); }
            50% { transform: translate(1px, -1px); }
            75% { transform: translate(-1px, -1px); }
          }
          .fire-active-root {
            animation: crash-shake 0.2s infinite;
          }
        `}
      </style>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] pointer-events-none bg-orange-600/5 mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
