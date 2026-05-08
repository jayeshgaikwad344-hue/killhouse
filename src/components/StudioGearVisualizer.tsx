import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { 
  Layers, 
  Volume2, 
  Mic2, 
  Headphones as HeadphonesIcon, 
  Disc, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Synthesizer, StudioMonitor, Microphone, Headphones, Turntable } from './StudioModels';

const CameraController = ({ zoomTarget, setZoomTarget }: { zoomTarget: number | null, setZoomTarget: (val: number | null) => void }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (zoomTarget !== null) {
      const factor = 0.1;
      const currentLen = camera.position.length();
      const diff = zoomTarget - currentLen;
      
      if (Math.abs(diff) > 0.01) {
        const newPos = camera.position.clone().normalize().multiplyScalar(currentLen + diff * factor);
        camera.position.copy(newPos);
      } else {
        setZoomTarget(null);
      }
    }
  });
  return null;
};

const StudioGearVisualizer = () => {
  const controlsRef = useRef<any>(null);
  const [zoomTarget, setZoomTarget] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState<'synth' | 'monitor' | 'mic' | 'head' | 'deck'>('synth');

  const handleZoomIn = useCallback(() => setZoomTarget(prev => (prev || 8) * 0.8), []);
  const handleZoomOut = useCallback(() => setZoomTarget(prev => (prev || 8) * 1.25), []);
  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setZoomTarget(8);
    }
  }, []);

  return (
    <div 
      className="h-[600px] w-full bg-black/40 rounded-3xl overflow-hidden border border-white/5 relative group cursor-grab active:cursor-grabbing"
      onDoubleClick={handleReset}
    >
      <div className="absolute top-10 left-10 z-10 space-y-4 pointer-events-none">
        <h4 className="text-[12px] font-mono text-red-600 uppercase tracking-[0.5em] font-black">Hardware_Preview_V.2</h4>
        <p className="text-5xl font-display font-black tracking-tighter uppercase text-white">Studio Showroom</p>
      </div>

      <div className="absolute top-10 right-10 z-20 flex flex-col gap-3">
        {[
          { id: 'synth', label: 'SYNTH V.1', icon: <Layers className="w-4 h-4" /> },
          { id: 'monitor', label: 'MONITOR 8', icon: <Volume2 className="w-4 h-4" /> },
          { id: 'mic', label: 'PRO MIC 2', icon: <Mic2 className="w-4 h-4" /> },
          { id: 'head', label: 'H-PHONES', icon: <HeadphonesIcon className="w-4 h-4" /> },
          { id: 'deck', label: 'DECK 1200', icon: <Disc className="w-4 h-4" /> }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveModel(btn.id as any)}
            className={cn(
              "px-6 py-3 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em]",
              activeModel === btn.id 
                ? "bg-red-600 text-white border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]" 
                : "bg-black/80 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
            )}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      <div className="absolute bottom-10 left-10 z-20 flex gap-4">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-white group/btn shadow-2xl"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-white group/btn shadow-2xl"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
        </button>
        <button 
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-white group/btn shadow-2xl"
          title="Reset Camera"
        >
          <RotateCcw className="w-5 h-5 transition-transform group-hover/btn:rotate-[-45deg]" />
        </button>
      </div>

      <Canvas shadows onCreated={({ gl }) => { gl.setClearColor('#000000', 0); }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <CameraController zoomTarget={zoomTarget} setZoomTarget={setZoomTarget} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff4400" />
        
        {activeModel === 'synth' && <Synthesizer />}
        {activeModel === 'monitor' && <StudioMonitor />}
        {activeModel === 'mic' && <Microphone />}
        {activeModel === 'head' && <Headphones />}
        {activeModel === 'deck' && <Turntable />}

        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
        <Environment preset="city" />
        <OrbitControls 
          ref={controlsRef} 
          enableZoom={true} 
          enablePan={false} 
          minDistance={4} 
          maxDistance={15} 
          makeDefault 
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute bottom-10 right-10 z-10 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity">
        <p className="text-[10px] font-mono text-white uppercase tracking-[0.5em]">Orbit Controls Active</p>
      </div>
    </div>
  );
};

export default StudioGearVisualizer;
