import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SolarSystem from './components/SolarSystem';
import { Loader } from '@react-three/drei';
import { useStore } from './store';
import { Settings2, ArrowLeft } from 'lucide-react';
import { PLANETS } from './constants';

const getPlanetSurfaceStyle = (planetId: string, baseColor: string) => {
  switch (planetId) {
    case 'mercury':
      return {
        background: `
          radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 10%),
          radial-gradient(circle at 70% 60%, rgba(0,0,0,0.2) 0%, transparent 15%),
          radial-gradient(circle at 40% 80%, rgba(0,0,0,0.15) 0%, transparent 20%),
          radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 12%),
          ${baseColor}`
      };
    case 'venus':
      return {
        background: `
          linear-gradient(15deg, rgba(255,255,255,0.15) 20%, rgba(0,0,0,0.1) 40%, rgba(255,255,255,0.2) 60%, transparent 80%),
          linear-gradient(-15deg, transparent 10%, rgba(0,0,0,0.05) 30%, rgba(255,255,255,0.1) 70%, transparent 90%),
          ${baseColor}`
      };
    case 'earth':
      return {
        background: `
          radial-gradient(circle at 30% 50%, #4ade80 0%, #22c55e 20%, transparent 40%),
          radial-gradient(circle at 70% 30%, #4ade80 0%, #16a34a 25%, transparent 50%),
          radial-gradient(circle at 60% 80%, #4ade80 0%, #15803d 15%, transparent 30%),
          linear-gradient(rgba(255,255,255,0.4) 5%, transparent 15%, transparent 85%, rgba(255,255,255,0.4) 95%),
          ${baseColor}`
      };
    case 'mars':
      return {
        background: `
          radial-gradient(circle at 40% 40%, rgba(0,0,0,0.25) 0%, transparent 30%),
          radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 0%, transparent 25%),
          radial-gradient(circle at 20% 80%, rgba(0,0,0,0.25) 0%, transparent 20%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 15%),
          ${baseColor}`
      };
    case 'jupiter':
      return {
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0.1) 5%,
            rgba(0,0,0,0.1) 5%,
            rgba(0,0,0,0.1) 12%,
            rgba(255,255,255,0.15) 12%,
            rgba(255,255,255,0.15) 18%,
            rgba(0,0,0,0.05) 18%,
            rgba(0,0,0,0.05) 25%
          ),
          radial-gradient(ellipse at 60% 40%, rgba(200,50,0,0.4) 0%, transparent 15%),
          ${baseColor}`
      };
    case 'saturn':
      return {
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.15) 0%,
            rgba(255,255,255,0.15) 8%,
            rgba(0,0,0,0.05) 8%,
            rgba(0,0,0,0.05) 15%
          ),
          ${baseColor}`
      };
    case 'uranus':
      return {
        background: `
          linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%),
          linear-gradient(0deg, transparent 40%, rgba(255,255,255,0.05) 45%, transparent 50%),
          ${baseColor}`
      };
    case 'neptune':
      return {
        background: `
          radial-gradient(ellipse at 30% 60%, rgba(0,0,0,0.3) 0%, transparent 20%),
          radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 15%),
          linear-gradient(0deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.05) 100%),
          ${baseColor}`
      };
    default:
      return { backgroundColor: baseColor };
  }
};

export default function App() {
  const { 
    speedMultiplier, setSpeedMultiplier, 
    showOrbits, setShowOrbits, 
    showLabels, setShowLabels,
    gameStatus, selectedPlanet, currentQuestion, progress, totalQuestions, 
    submitAnswer, quitGame, selectPlanet 
  } = useStore();

  const selectedPlanetData = PLANETS.find(p => p.id === selectedPlanet);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-white text-3xl font-light tracking-widest uppercase">Solar System</h1>
        <p className="text-white/60 text-sm mt-2 font-mono">Interactive 3D Model</p>
        <div className="mt-4 text-white/40 text-xs font-mono max-w-xs">
          <p>Drag to rotate</p>
          <p>Scroll to zoom</p>
          <p>Pan to move</p>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 w-72 text-white">
        <div className="flex items-center gap-2 mb-6 text-white/80">
          <Settings2 size={18} />
          <h2 className="text-sm font-medium uppercase tracking-wider">Controls</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-white/60 font-mono">
              <label>Simulation Speed</label>
              <span>{speedMultiplier.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.1" 
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
              className="w-full accent-white/80 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-white/60 font-mono cursor-pointer" htmlFor="toggle-orbits">Show Orbits</label>
            <button 
              id="toggle-orbits"
              onClick={() => setShowOrbits(!showOrbits)}
              className={`w-10 h-5 rounded-full transition-colors relative ${showOrbits ? 'bg-white/80' : 'bg-white/20'}`}
            >
              <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-transform ${showOrbits ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-white/60 font-mono cursor-pointer" htmlFor="toggle-labels">Show Labels</label>
            <button 
              id="toggle-labels"
              onClick={() => setShowLabels(!showLabels)}
              className={`w-10 h-5 rounded-full transition-colors relative ${showLabels ? 'bg-white/80' : 'bg-white/20'}`}
            >
              <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-transform ${showLabels ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {gameStatus === 'idle' && (
        <div className="absolute top-1/2 left-6 -translate-y-1/2 z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 w-80 text-white">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Nhiệm vụ Giải cứu</h2>
          <p className="text-sm text-white/80 mb-4">Chọn một hành tinh để giải cứu. Hành tinh càng gần Mặt Trời sẽ càng có nhiều thử thách!</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => selectPlanet(p.id, p.questionCount)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">{p.questionCount} câu</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameStatus === 'playing' && currentQuestion && selectedPlanetData && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-xl flex flex-col">
          {/* Back Button */}
          <button 
            onClick={quitGame}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 z-30"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          {/* Top: Journey Section */}
          <div className="w-full pt-20 px-16 flex items-center justify-between">
            {/* Track */}
            <div className="flex-1 relative h-4 bg-white/10 rounded-full mr-24">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                style={{ width: `${(progress / totalQuestions) * 100}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-10"
                style={{ left: `${(progress / totalQuestions) * 100}%` }}
              >
                <div className="relative animate-float">
                  <div className="text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10">
                    🚀
                  </div>
                  {/* Fire effect */}
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-12 h-8 bg-gradient-to-r from-orange-500 via-yellow-400 to-transparent rounded-full blur-md animate-fire -z-10" />
                </div>
              </div>
            </div>

            {/* Planet */}
            <div className="w-80 flex flex-col items-center shrink-0 relative">
              <div 
                className="w-64 h-64 rounded-full relative overflow-hidden"
                style={{ 
                  ...getPlanetSurfaceStyle(selectedPlanetData.id, selectedPlanetData.color),
                  boxShadow: `inset -24px -24px 60px rgba(0,0,0,0.7), 0 0 60px ${selectedPlanetData.color}`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/30" />
              </div>
              {selectedPlanetData.hasRings && (
                <div className="absolute top-[128px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[100px] border-[24px] border-[#cda87c]/60 rounded-[100%] rotate-12 pointer-events-none" />
              )}
              <div className="mt-8 text-center">
                <h2 className="text-4xl font-bold text-white tracking-widest uppercase">{selectedPlanetData.name}</h2>
                <p className="text-emerald-400 mt-2 font-mono text-xl">{progress} / {totalQuestions} điểm</p>
              </div>
            </div>
          </div>

          {/* Bottom: Question Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-5xl mx-auto w-full">
            <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-12 shadow-2xl">
              <div className="text-center mb-12">
                <h3 className="text-5xl font-medium text-white leading-tight">{currentQuestion.text}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => submitAnswer(opt)}
                    className="py-8 rounded-2xl bg-white/5 hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all text-4xl font-bold text-white border border-white/10 hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameStatus === 'won' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-emerald-900/90 backdrop-blur-md border border-emerald-500 rounded-2xl p-10 text-center text-white shadow-2xl shadow-emerald-900/50">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Thành công!</h2>
          <p className="text-xl text-emerald-200 mb-8">Bạn đã giải cứu thành công {selectedPlanetData?.name}!</p>
          <button
            onClick={quitGame}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-lg transition-colors"
          >
            Chơi tiếp
          </button>
        </div>
      )}
      
      <Canvas camera={{ position: [0, 60, 100], fov: 45 }}>
        <Suspense fallback={null}>
          <SolarSystem />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
