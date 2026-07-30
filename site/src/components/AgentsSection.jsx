import React, { useState } from "react";
import { AGENTS_DATA } from "../data/agentsData";
import {
  BrainCircuit,
  Layers,
  Cpu,
  Terminal,
  ShieldCheck,
  Zap,
  UserCheck,
  ChevronRight,
  Sliders,
  FileJson,
  Code2
} from "lucide-react";

export function AgentsSection() {
  const [selectedAgentId, setSelectedAgentId] = useState("supervisor");
  const [activeTab, setActiveTab] = useState("responsibilities");

  const activeAgent = AGENTS_DATA.find((a) => a.id === selectedAgentId) || AGENTS_DATA[0];

  const getAgentIcon = (id) => {
    switch (id) {
      case "supervisor":
        return BrainCircuit;
      case "planner":
        return Layers;
      case "designer":
        return Cpu;
      case "coder":
        return Terminal;
      case "reviewer":
        return ShieldCheck;
      case "tester":
        return Zap;
      case "human":
        return UserCheck;
      default:
        return BrainCircuit;
    }
  };

  return (
    <section id="agents" className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-white" />
            Specialized Corps
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            The Specialist Agent Roster
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            Every agent has isolated responsibilities and strict typed contracts. No single LLM prompt attempts to do everything.
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {AGENTS_DATA.map((agent) => {
            const Icon = getAgentIcon(agent.id);
            const isSelected = agent.id === selectedAgentId;

            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? "bg-white/10 border-white text-white shadow-xl"
                    : "bg-[#0c0d12] border-white/[0.08] text-[#8a8f98] hover:border-white/20 hover:text-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/10 text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8a8f98]">
                      {agent.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans">{agent.name}</h3>
                  <p className="text-xs font-mono text-[#8a8f98] mb-2">{agent.role.split("&")[0]}</p>
                  <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed font-sans">{agent.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-white/80">
                  <span>Inspect Spec</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Agent Specification Details Drawer */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Overview */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/10 text-white">
                  {React.createElement(getAgentIcon(activeAgent.id), { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">{activeAgent.name}</h3>
                  <p className="text-xs font-mono text-[#8a8f98]">{activeAgent.role}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-[#8a8f98]">Domain Purpose</div>
                <p className="text-xs text-[#8a8f98] font-sans leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                  {activeAgent.purpose}
                </p>
              </div>
            </div>

            {/* Right Tabs */}
            <div className="lg:col-span-8 bg-[#08090c] rounded-xl p-6 border border-white/[0.08]">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08] mb-6">
                {[
                  { id: "responsibilities", label: "Responsibilities", icon: Sliders },
                  { id: "input", label: "Input Schema", icon: FileJson },
                  { id: "output", label: "Output Schema", icon: Code2 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-black font-semibold"
                        : "bg-white/[0.04] text-[#8a8f98] hover:text-white"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "responsibilities" && (
                <div className="space-y-2 font-sans text-xs text-[#8a8f98]">
                  {activeAgent.responsibilities.map((resp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/60 border border-white/[0.06] flex items-start gap-3">
                      <span className="font-mono text-white font-bold">{idx + 1}.</span>
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "input" && (
                <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{activeAgent.input}</code>
                </pre>
              )}

              {activeTab === "output" && (
                <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{activeAgent.output}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
