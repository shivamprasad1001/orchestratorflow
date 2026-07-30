import React, { useState } from "react";
import { BrainCircuit, Layers, Cpu, Terminal, ShieldCheck, Zap, UserCheck, CheckCircle } from "lucide-react";
import { LangGraphStudioGraph } from "./LangGraphStudioGraph";

export function SupervisorSection() {
  return (
    <section id="supervisor" className="py-24 bg-canvas hairline-t hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            Official LangGraph Studio Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            The Supervisor Star Topology
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            The Supervisor is the central brain. Every specialized agent (Planner, Designer, Coder, Reviewer, Tester, Human)
            returns control back to the Supervisor. Agents NEVER communicate directly or decide downstream routing.
          </p>
        </div>

        {/* Studio Graph Component */}
        <LangGraphStudioGraph />
      </div>
    </section>
  );
}
