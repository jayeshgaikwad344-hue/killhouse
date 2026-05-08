import { motion } from "motion/react";

export default function AmbientBackground({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="liquid-mesh">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
    </div>
  );
}
