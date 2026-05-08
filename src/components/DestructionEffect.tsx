import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

interface Fracture {
  id: number;
  points: string;
  duration: number;
  delay: number;
}

export default function DestructionEffect({ active, intensity = 5 }: { active: boolean, intensity?: number }) {
  const [fractures, setFractures] = useState<Fracture[]>([]);
  const [glitchBlocks, setGlitchBlocks] = useState<{ id: number; top: string; left: string; width: string; height: string; color: string }[]>([]);
  const [popups, setPopups] = useState<{ id: number; top: string; left: string; text: string }[]>([]);

  useEffect(() => {
    if (!active) {
      setFractures([]);
      setGlitchBlocks([]);
      setPopups([]);
      return;
    }

    // Generate fractures
    const newFractures = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      points: `${i * 10}% 0, ${i * 10 + 5}% 100%`,
      duration: 0.2 + Math.random() * 0.3,
      delay: Math.random() * 2
    }));
    setFractures(newFractures);

    const errorMessages = [
      "CRITICAL: HEAP_OVERFLOW",
      "SEGMENTATION FAULT",
      "KILLHOUSE.SYS NOT FOUND",
      "MEMORY CORRUPTION DETECTED",
      "0x0000005C: ACCESS_VIOLATION",
      "CORE DUMPING...",
      "REBOOT REQUIRED"
    ];

    // Dynamic glitch blocks and popups
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        setGlitchBlocks(prev => {
          const newBlock = {
            id: Date.now(),
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${5 + Math.random() * 20}%`,
            height: `${2 + Math.random() * 10}%`,
            color: Math.random() > 0.5 ? "rgba(255, 0, 0, 0.4)" : "rgba(0, 255, 255, 0.4)"
          };
          return [...prev.slice(-10), newBlock];
        });
      }

      if (Math.random() > 0.7) {
        setPopups(prev => {
          const newPopup = {
            id: Date.now(),
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            text: errorMessages[Math.floor(Math.random() * errorMessages.length)]
          };
          return [...prev.slice(-5), newPopup];
        });
      }
    }, 150);

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
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          >
            {/* Glitch Overlay */}
            <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay animate-glitch-fast" />
            
            {/* Glitch Blocks */}
            {glitchBlocks.map(block => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                className="absolute"
                style={{
                  top: block.top,
                  left: block.left,
                  width: block.width,
                  height: block.height,
                  backgroundColor: block.color,
                  boxShadow: `0 0 20px ${block.color}`,
                  filter: "blur(2px)"
                }}
              />
            ))}

            {/* Error Popups */}
            {popups.map(popup => (
              <motion.div
                key={popup.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="absolute bg-red-600 text-white font-mono text-[10px] p-2 border-2 border-white shadow-[0_0_30px_rgba(255,0,0,0.8)]"
                style={{
                  top: popup.top,
                  left: popup.left,
                }}
              >
                <div className="flex justify-between items-center bg-white text-red-600 px-1 mb-1 font-bold">
                  <span>ERROR</span>
                  <span>X</span>
                </div>
                {popup.text}
              </motion.div>
            ))}

            {/* Fractures / Cracks */}
            <svg className="absolute inset-0 w-full h-full opacity-40">
              {fractures.map(f => (
                <motion.line
                  key={f.id}
                  x1={`${Math.random() * 100}%`}
                  y1="0"
                  x2={`${Math.random() * 100}%`}
                  y2="100%"
                  stroke="white"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: f.duration, delay: f.delay }}
                />
              ))}
            </svg>

            {/* Digital Debris */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 0.95, 1] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="text-[20vw] font-black opacity-10 select-none text-red-600"
                >
                    CRITICAL ERROR
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {active && `
          body {
            animation: extreme-shake 0.1s infinite !important;
            filter: contrast(1.5) brightness(1.2) hue-rotate(${intensity * 5}deg) !important;
          }
          
          #root {
            clip-path: polygon(
              0% 0%, 
              100% 0%, 
              100% 30%, 
              80% 30%, 
              80% 35%, 
              100% 35%, 
              100% 70%, 
              20% 70%, 
              20% 75%, 
              100% 75%, 
              100% 100%, 
              0% 100%
            );
            animation: clip-shift 0.2s infinite;
          }

          @keyframes extreme-shake {
            0% { transform: translate(0,0) rotate(0); }
            25% { transform: translate(-10px, 5px) rotate(-1deg); }
            50% { transform: translate(10px, -5px) rotate(1deg); }
            75% { transform: translate(-5px, -10px) rotate(-0.5deg); }
            100% { transform: translate(5px, 10px) rotate(0.5deg); }
          }

          @keyframes clip-shift {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-20px); filter: invert(1); }
          }

          @keyframes glitch-fast {
            0% { opacity: 0.1; transform: scale(1); }
            10% { opacity: 0.3; transform: scale(1.02) skewX(5deg); }
            20% { opacity: 0.1; transform: scale(0.98) skewX(-5deg); }
            100% { opacity: 0.1; }
          }
          
          .glass-card {
            border-color: rgba(255, 0, 0, 0.5) !important;
            backdrop-filter: blur(2px) !important;
            animation: card-distort 0.3s infinite;
          }
          
          @keyframes card-distort {
            0% { transform: skew(0deg); }
            25% { transform: skew(2deg); }
            75% { transform: skew(-2deg); }
          }
        `}
      </style>
    </>
  );
}
