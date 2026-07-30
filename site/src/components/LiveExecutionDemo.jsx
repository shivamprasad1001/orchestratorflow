import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  BrainCircuit,
  Terminal,
  AlertTriangle
} from "lucide-react";
import { DEMO_STEPS } from "../data/executionScenarios";

export function LiveExecutionDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500);

  const currentStep = DEMO_STEPS[currentStepIndex];
  const totalSteps = DEMO_STEPS.length;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, playbackSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <section id="demo" className="py-16 sm:py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <Play className="w-3.5 h-3.5 text-white" />
            Execution Replay Simulator
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Watch Dynamic Re-Routing in Action
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            When Reviewer fails code verification, Supervisor intercepts the error payload and routes execution back
            to Coder for a self-healing retry loop.
          </p>
        </div>

        {/* Demo Simulator Panel */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-4 sm:p-8 shadow-2xl">
          {/* Top Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isPlaying
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isPlaying ? "Pause Replay" : "Run Demo"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-full bg-white/[0.06] border border-white/10 text-[#8a8f98] hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => currentStepIndex < totalSteps - 1 && setCurrentStepIndex(currentStepIndex + 1)}
                  disabled={currentStepIndex === totalSteps - 1}
                  className="p-2 rounded-full bg-white/[0.06] border border-white/10 text-[#8a8f98] hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-full bg-white/[0.06] border border-white/10 text-[#8a8f98] hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Speed & Step Counter */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs font-mono text-[#8a8f98]">
              <div className="flex items-center gap-1.5">
                <span>Speed:</span>
                {[
                  { label: "1x", speed: 2000 },
                  { label: "2x", speed: 1000 },
                  { label: "4x", speed: 500 }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setPlaybackSpeed(s.speed)}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md transition-all border text-xs ${
                      playbackSpeed === s.speed
                        ? "bg-white/10 border-white/30 text-white font-bold"
                        : "border-white/[0.06] text-[#8a8f98]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-[#8a8f98]">
                Step <span className="text-white font-bold">{currentStepIndex + 1}</span> / {totalSteps}
              </div>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="py-4 sm:py-6 overflow-x-auto">
            <div className="flex items-center min-w-[650px] sm:min-w-[700px] justify-between relative px-2">
              <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/10 -translate-y-1/2" />
              {DEMO_STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={step.stepIndex}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                      isActive
                        ? "bg-white text-black font-bold ring-4 ring-white/20 scale-110"
                        : isPassed
                        ? "bg-white/20 text-white"
                        : "bg-[#14161f] text-[#8a8f98] border border-white/10"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Visualizer & Logs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-2">
            {/* Active Step Panel */}
            <div className="lg:col-span-6 bg-[#08090c] rounded-xl p-4 sm:p-6 border border-white/[0.08] space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono font-bold text-white uppercase">
                  Active Node: {currentStep.agent}
                </span>
                {currentStep.isFailureStep && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Feedback Loop Triggered
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-sans">{currentStep.title}</h3>
              <p className="text-xs text-[#8a8f98] font-sans leading-relaxed">{currentStep.description}</p>

              <div className="p-3 sm:p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-1.5 font-mono text-xs">
                <div className="text-white/80 font-bold flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-white shrink-0" /> Supervisor Rationale:
                </div>
                <div className="text-[#8a8f98] leading-relaxed text-[11px]">"{currentStep.supervisorThought}"</div>
              </div>
            </div>

            {/* Log Output Console */}
            <div className="lg:col-span-6 bg-[#040508] rounded-xl p-4 sm:p-5 border border-white/[0.08] font-mono text-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 text-xs text-[#8a8f98]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-white/80 shrink-0" /> Runtime Event Stream
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <div className="space-y-2 overflow-y-auto max-h-52 sm:max-h-60 pr-1 text-[11px]">
                {currentStep.logs.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    className={`p-2 rounded border ${
                      log.includes("✖") || log.includes("⚠️")
                        ? "bg-rose-950/30 border-rose-500/30 text-rose-300"
                        : log.includes("✔")
                        ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                        : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98]"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
