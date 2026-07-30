import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Play,
  FileText,
  BookOpen,
  ArrowRight,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Cpu,
  UserCheck
} from "lucide-react";

export function Hero({ onOpenDocs, onOpenPaper }) {
  return (
    <section className="relative min-h-[85vh] pt-32 sm:pt-36 pb-16 sm:pb-20 flex flex-col justify-center bg-canvas bg-grid-subtle overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[350px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-[11px] sm:text-xs font-mono tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              OrchestratorFlow v1.0.0 • LangGraph Framework
            </span>
          </motion.div>

          {/* Large Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[1.1]"
          >
            One Supervisor. <br className="hidden sm:inline" />
            <span className="text-gradient-white">Unlimited Specialized Agents.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-[#8a8f98] max-w-3xl mx-auto font-normal leading-relaxed px-2"
          >
            OrchestratorFlow is an adaptive AI orchestration framework built with LangGraph that coordinates specialized software engineering agents through a central Supervisor using dynamic state-driven execution.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2"
          >
            {/* Architecture Scroll Button */}
            <a
              href="#supervisor"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-neutral-200 transition-all shadow-md w-full sm:w-auto"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              Architecture
            </a>

            {/* Documentation Button */}
            <button
              onClick={onOpenDocs}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-white font-medium text-xs transition-all w-full sm:w-auto"
            >
              <BookOpen className="w-3.5 h-3.5 text-white/70" />
              Documentation
            </button>

            {/* Research Paper Button */}
            <button
              onClick={onOpenPaper}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-white font-medium text-xs transition-all w-full sm:w-auto"
            >
              <FileText className="w-3.5 h-3.5 text-white/70" />
              Research Paper
            </button>

            {/* GitHub Button */}
            <a
              href="https://github.com/shivamprasad1001/orchestratorflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-white font-medium text-xs transition-all w-full sm:w-auto"
            >
              <Github className="w-3.5 h-3.5 text-white/70" />
              GitHub
            </a>
          </motion.div>
        </div>

        {/* Hero Hub-and-Spoke Canvas Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-4 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] mb-4 sm:mb-6 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="text-[11px] sm:text-xs font-mono text-[#8a8f98] ml-1 sm:ml-2 truncate max-w-[200px] sm:max-w-none">
                  langgraph_supervisor_star_topology.py
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                State-Driven Execution
              </div>
            </div>

            {/* Central Supervisor Hub Radial Diagram Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 text-center">
              {[
                { name: "Supervisor", icon: BrainCircuit, role: "Central Hub", isCenter: true },
                { name: "Planner", icon: Layers, role: "DAG Spec" },
                { name: "Designer", icon: Cpu, role: "Schemas" },
                { name: "Coder", icon: Terminal, role: "Git Patch" },
                { name: "Reviewer", icon: ShieldCheck, role: "AST Audit" },
                { name: "Tester", icon: Zap, role: "Pytest" },
                { name: "Human", icon: UserCheck, role: "Interrupt" }
              ].map((item) => (
                <div
                  key={item.name}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                    item.isCenter
                      ? "bg-white text-black border-white font-bold shadow-lg col-span-2 sm:col-span-1"
                      : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98]"
                  }`}
                >
                  <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.isCenter ? "text-black" : "text-white/80"}`} />
                  <div className={`text-xs font-semibold ${item.isCenter ? "text-black" : "text-white"}`}>
                    {item.name}
                  </div>
                  <div className={`text-[10px] font-mono ${item.isCenter ? "text-neutral-700 font-bold" : "text-[#8a8f98]"}`}>
                    {item.role}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-[11px] text-[#8a8f98] font-mono gap-2">
              <span>All control loops through Supervisor.</span>
              <a href="#supervisor" className="text-white hover:underline flex items-center gap-1 font-medium font-sans">
                Interactive Canvas <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
