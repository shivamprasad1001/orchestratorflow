import React, { useState } from "react";
import { Database, RefreshCw, Sparkles, Sliders, History } from "lucide-react";

export function StateManagementSection() {
  const [stateValues, setStateValues] = useState({
    current_agent: "Supervisor",
    current_phase: "feedback_loop_retry",
    iteration: 2,
    review_status: "failed",
    test_status: "pending",
    workspace_path: "workspace/run_001",
    clarification_needed: false,
    execution_history: [
      "START -> Supervisor",
      "Supervisor -> Planner",
      "Planner -> Supervisor",
      "Supervisor -> Designer",
      "Designer -> Supervisor",
      "Supervisor -> Coder",
      "Coder -> Supervisor",
      "Supervisor -> Reviewer",
      "Reviewer (Failed) -> Supervisor",
      "Supervisor -> Coder (Retry 2)"
    ]
  });

  const toggleReview = () => {
    setStateValues((prev) => ({
      ...prev,
      review_status: prev.review_status === "failed" ? "passed" : "failed",
      current_phase: prev.review_status === "failed" ? "review_passed" : "review_failed",
      execution_history: [
        ...prev.execution_history,
        prev.review_status === "failed"
          ? "Coder (Patched) -> Supervisor -> Reviewer (Passed)"
          : "Reviewer (Failed) -> Supervisor"
      ]
    }));
  };

  const toggleClarification = () => {
    setStateValues((prev) => ({
      ...prev,
      clarification_needed: !prev.clarification_needed,
      execution_history: [
        ...prev.execution_history,
        !prev.clarification_needed
          ? "Supervisor -> Human (Interrupt)"
          : "Human (Answered) -> Supervisor"
      ]
    }));
  };

  return (
    <section id="state" className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <Database className="w-3.5 h-3.5 text-white" />
            GraphState Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Shared GraphState Schema
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            The Supervisor uses GraphState to dictate execution choices. Every agent mutation is recorded atomically.
          </p>
        </div>

        {/* Visual Box */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Toggles */}
            <div className="lg:col-span-5 space-y-3 font-mono text-xs">
              <div className="text-[#8a8f98] uppercase text-[10px] mb-2 font-bold">Simulate State Mutations</div>

              <button
                onClick={toggleReview}
                className="w-full p-4 rounded-xl bg-[#08090c] border border-white/[0.08] hover:border-white/20 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="text-[#8a8f98] text-[11px]">review_status</div>
                  <div className="text-sm font-bold text-white font-sans mt-0.5">
                    {stateValues.review_status.toUpperCase()}
                  </div>
                </div>
                <RefreshCw className="w-4 h-4 text-white/70" />
              </button>

              <button
                onClick={toggleClarification}
                className="w-full p-4 rounded-xl bg-[#08090c] border border-white/[0.08] hover:border-white/20 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="text-[#8a8f98] text-[11px]">clarification_needed</div>
                  <div className="text-sm font-bold text-white font-sans mt-0.5">
                    {stateValues.clarification_needed ? "TRUE (Interrupt Node)" : "FALSE"}
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-white/70" />
              </button>

              <div className="pt-2">
                <div className="text-[#8a8f98] uppercase text-[10px] mb-2 font-bold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-white" /> Execution History (Trajectory)
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] space-y-1.5 max-h-40 overflow-y-auto text-[11px]">
                  {stateValues.execution_history.map((step, idx) => (
                    <div key={idx} className="text-[#8a8f98]">
                      {idx + 1}. {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* JSON State Inspector */}
            <div className="lg:col-span-7 bg-[#040508] rounded-xl p-6 border border-white/[0.08] font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-[#8a8f98]">
                <span className="text-white font-bold">TypedDict GraphState Schema</span>
                <span>Atomic Reducer</span>
              </div>

              <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] text-cyan-300 text-[12px] leading-relaxed">
                <code>{`{
  "current_agent": "${stateValues.current_agent}",
  "current_phase": "${stateValues.current_phase}",
  "iteration": ${stateValues.iteration},
  "review_status": "${stateValues.review_status}",
  "test_status": "${stateValues.test_status}",
  "workspace_path": "${stateValues.workspace_path}",
  "clarification_needed": ${stateValues.clarification_needed},
  "execution_history": [ ... ${stateValues.execution_history.length} steps recorded ]
}`}</code>
              </pre>

              <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-[#8a8f98]">Supervisor Next Action:</span>
                <span className="text-white font-bold">
                  {stateValues.clarification_needed
                    ? "Supervisor ➔ Human (Interrupt)"
                    : stateValues.review_status === "failed"
                    ? "Supervisor ➔ Coder (Feedback Loop)"
                    : "Supervisor ➔ Tester"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
