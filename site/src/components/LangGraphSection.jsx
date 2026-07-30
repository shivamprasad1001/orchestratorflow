import React, { useState } from "react";
import { LANGGRAPH_CONCEPTS } from "../data/langgraphData";
import { BrainCircuit, Code2, Copy, Check } from "lucide-react";

export function LangGraphSection() {
  const [selectedConceptId, setSelectedConceptId] = useState("stategraph");
  const [copied, setCopied] = useState(false);

  const activeConcept =
    LANGGRAPH_CONCEPTS.find((c) => c.id === selectedConceptId) || LANGGRAPH_CONCEPTS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeConcept.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="langgraph" className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-white" />
            Underlying Framework
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Powered by LangGraph
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            Typed graph schemas, persistent checkpointers, time-travel debugging, and native human-in-the-loop interrupts.
          </p>
        </div>

        {/* Concept Selector Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          {LANGGRAPH_CONCEPTS.map((concept) => {
            const isSelected = concept.id === selectedConceptId;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConceptId(concept.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-white text-black font-bold border-white"
                    : "bg-[#0c0d12] border-white/[0.08] text-[#8a8f98] hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-xs font-mono">{concept.title}</div>
                <div className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{concept.tagline}</div>
              </button>
            );
          })}
        </div>

        {/* Concept Inspector */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Description */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {activeConcept.title}
              </span>
              <h3 className="text-xl font-bold text-white font-sans">{activeConcept.tagline}</h3>
              <p className="text-xs text-[#8a8f98] font-sans leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                {activeConcept.description}
              </p>
            </div>

            {/* Python Code Window */}
            <div className="lg:col-span-7 bg-[#040508] rounded-xl p-6 border border-white/[0.08] font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-[#8a8f98]">
                <span className="text-white font-bold">{activeConcept.id}_implementation.py</span>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] text-cyan-300 overflow-x-auto text-[11px] leading-relaxed">
                <code>{activeConcept.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
