import React from "react";
import { COMPARISON_FRAMEWORKS, COMPARISON_FEATURES } from "../data/comparisonData";
import { Sparkles } from "lucide-react";

export function ComparisonSection() {
  return (
    <section id="comparison" className="py-16 sm:py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Framework Differentiation
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Architectural Comparison
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            How dynamic supervisor routing and LangGraph state management compare with other multi-agent frameworks.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-3 sm:p-8 overflow-x-auto shadow-2xl">
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-3 sm:py-4 px-3 sm:px-4 text-[11px] font-mono uppercase text-[#8a8f98] w-1/4">
                    Capability
                  </th>
                  {COMPARISON_FRAMEWORKS.map((fw) => (
                    <th
                      key={fw.id}
                      className={`py-3 sm:py-4 px-2 sm:px-3 text-center text-xs font-bold font-sans ${
                        fw.highlight ? "text-white bg-white/10 rounded-t-xl border-t border-x border-white/20" : "text-[#8a8f98]"
                      }`}
                    >
                      {fw.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {COMPARISON_FEATURES.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 font-sans text-xs font-semibold text-white/90">{item.title}</td>
                    {COMPARISON_FRAMEWORKS.map((fw) => {
                      const value = item.values[fw.id];
                      const isOrchestrator = fw.highlight;

                      return (
                        <td
                          key={fw.id}
                          className={`py-3 sm:py-4 px-2 sm:px-3 text-center ${
                            isOrchestrator ? "bg-white/[0.04] border-x border-white/20 text-white font-bold" : "text-[#8a8f98]"
                          }`}
                        >
                          <span
                            className={`inline-block px-2 py-1 rounded text-[11px] ${
                              isOrchestrator ? "bg-white/10 text-white border border-white/20" : "bg-white/[0.02]"
                            }`}
                          >
                            {value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
