import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect, useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function AmbientParticles({ isPlaying }: { isPlaying: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { scrollYProgress } = useScroll();
  
  // Parallax effect based on scroll
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    // Generate static particles
    const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <motion.div style={{ y: yOffset }} className="w-full h-full relative">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`, 
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              y: [`${particle.y}vh`, `${particle.y - 15}vh`, `${particle.y}vh`],
              x: [`${particle.x}vw`, `${particle.x + (Math.random() - 0.5) * 5}vw`, `${particle.x}vw`],
              opacity: [0, particle.opacity, particle.opacity * 0.5, 0],
              scale: [0.5, 1, 0.8, 0.5],
            }}
            transition={{
              duration: isPlaying ? particle.duration * 0.7 : particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
            className="absolute bg-white rounded-full blur-[1px]"
            style={{
              width: particle.size,
              height: particle.size,
              boxShadow: "0 0 10px rgba(255,255,255,0.2)",
            }}
          />
        ))}
        
        {/* Occasional larger "dust" motes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`, 
              opacity: 0 
            }}
            animate={{
              y: ["-10vh", "110vh"],
              x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
              opacity: [0, 0.15, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear",
            }}
            className="absolute bg-white/20 rounded-full blur-[8px]"
            style={{
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
