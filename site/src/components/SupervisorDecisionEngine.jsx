import React, { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Layers, Terminal, UserCheck, CheckCircle } from "lucide-react";
import { STATE_MACHINE_DECISIONS } from "../data/executionScenarios";

export function SupervisorDecisionEngine() {
  const [selectedDecisionId, setSelectedDecisionId] = useState("review_failed");

  const currentDecision =
    STATE_MACHINE_DECISIONS.find((d) => d.id === selectedDecisionId) || STATE_MACHINE_DECISIONS[1];

  const getTargetIcon = (target) => {
    switch (target) {
      case "Planner":
        return Layers;
      case "Coder":
        return Terminal;
      case "Human":
        return UserCheck;
      case "END":
        return CheckCircle;
      default:
        return BrainCircuit;
    }
  };

  return (
    <section className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-white" />
            Conditional State Machine
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Supervisor Decision Matrix
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            Simulate how the Supervisor evaluates real-time GraphState flags to trigger target node transitions.
          </p>
        </div>

        {/* Condition Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {STATE_MACHINE_DECISIONS.map((item) => {
            const isSelected = item.id === selectedDecisionId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedDecisionId(item.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-white text-black font-bold border-white"
                    : "bg-[#0c0d12] border-white/[0.08] text-[#8a8f98] hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-[10px] font-mono opacity-60 mb-1 uppercase">CONDITION</div>
                <div className="text-xs font-bold font-sans mb-1">{item.condition}</div>
                <div className="text-[11px] font-mono opacity-80">➔ {item.targetNode}</div>
              </button>
            );
          })}
        </div>

        {/* State Machine Diagram Box */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Edge (Left) */}
            <div className="lg:col-span-7 bg-[#08090c] rounded-xl p-6 border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8a8f98]">Evaluated Rule:</span>
                <span className="text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {currentDecision.trigger}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-6 rounded-xl bg-black/60 border border-white/[0.06]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-2">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white font-sans">Supervisor</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1 px-2">
                  <span className="text-[10px] font-mono text-[#8a8f98]">{currentDecision.condition}</span>
                  <div className="w-full h-[1px] bg-white/30 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8a8f98]">Conditional Edge</span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-2">
                    {React.createElement(getTargetIcon(currentDecision.targetNode), { className: "w-6 h-6" })}
                  </div>
                  <span className="text-xs font-bold text-white font-sans">{currentDecision.targetNode}</span>
                </div>
              </div>

              <p className="text-xs text-[#8a8f98] font-sans leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                {currentDecision.desc}
              </p>
            </div>

            {/* Router Code View (Right) */}
            <div className="lg:col-span-5 bg-[#040508] rounded-xl p-6 border border-white/[0.08] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs text-[#8a8f98]">
                <span>Router Function Schema</span>
                <span className="text-white font-bold">Python</span>
              </div>

              <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] text-cyan-300 text-[11px] leading-relaxed">
                <code>{`def evaluate_supervisor_route(state: GraphState) -> str:
    # Condition match:
    if ${currentDecision.trigger}:
        return "${currentDecision.targetNode}"
        
    return "Supervisor"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
