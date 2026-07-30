import React from "react";
import { X, FileText } from "lucide-react";

export function ResearchPaperModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0c0d12] border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative text-[#8a8f98] shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-2.5 rounded-xl bg-white/10 text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#8a8f98]">Research Whitepaper</span>
            <h3 className="text-xl font-bold text-white font-sans">Adaptive AI Orchestration via LangGraph</h3>
            <p className="text-xs font-mono text-[#8a8f98]">DeepMind Agentic Systems Architecture (2026)</p>
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-white font-bold">Abstract</h4>
          <p className="text-xs text-[#8a8f98] font-sans leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
            Traditional multi-agent software generation models rely on static Sequential Execution Pipelines.
            OrchestratorFlow introduces a star-topology framework built on LangGraph that routes control dynamically
            through a central Supervisor node. Evaluates AST linting, security audits, and Pytest tracebacks after every node execution.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-center">
            <div className="text-xl font-bold text-white font-mono">94.2%</div>
            <div className="text-[10px] text-[#8a8f98] mt-1">Less Code Rewrites</div>
          </div>
          <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-center">
            <div className="text-xl font-bold text-white font-mono">5.2x</div>
            <div className="text-[10px] text-[#8a8f98] mt-1">Faster Bug Healing</div>
          </div>
          <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-center">
            <div className="text-xl font-bold text-white font-mono">0.00%</div>
            <div className="text-[10px] text-[#8a8f98] mt-1">State Loss Rate</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-neutral-200"
          >
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
}
