import React from "react";
import { X, BookOpen, Terminal, CheckCircle2, ShieldCheck, BrainCircuit } from "lucide-react";

export function DocumentationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0c0d12] border border-white/20 rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-4 sm:p-8 relative text-[#8a8f98] shadow-2xl space-y-5 sm:space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4 pr-10">
          <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans">OrchestratorFlow Documentation</h3>
            <p className="text-[11px] sm:text-xs font-mono text-[#8a8f98]">Official Framework Architecture v1.0.0</p>
          </div>
        </div>

        {/* Installation */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-white font-bold flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" /> 1. Installation
          </h4>
          <pre className="p-3 sm:p-4 rounded-xl bg-black/80 border border-white/[0.08] text-emerald-400 font-mono text-[11px] sm:text-xs overflow-x-auto">
            <code>{`python -m venv .venv
source .venv/bin/activate
pip install orchestratorflow

orchestratorflow init`}</code>
          </pre>
        </div>

        {/* Python API */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-white font-bold flex items-center gap-2">
            <BrainCircuit className="w-3.5 h-3.5" /> 2. Python API
          </h4>
          <pre className="p-3 sm:p-4 rounded-xl bg-black/80 border border-white/[0.08] text-cyan-300 font-mono text-[11px] sm:text-xs overflow-x-auto">
            <code>{`from orchestratorflow import OrchestratorEngine

engine = OrchestratorEngine(checkpointer="sqlite", checkpoint_db="runs.db")
result = engine.run(prompt="Build a FastAPI JWT auth service")`}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-neutral-200 w-full sm:w-auto text-center"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
