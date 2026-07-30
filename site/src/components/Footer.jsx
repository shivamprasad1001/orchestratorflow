import React from "react";
import { Workflow, Github } from "lucide-react";

export function Footer({ onOpenDocs, onOpenPaper }) {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] text-[#8a8f98] py-16 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">OrchestratorFlow</span>
            </div>
            <p className="text-[#8a8f98] max-w-md leading-relaxed text-xs">
              Adaptive multi-agent AI orchestration framework built with LangGraph. Dynamic supervision, conditional
              routing, persistent workspaces, and human-in-the-loop execution.
            </p>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-white/80">
                v1.4.0 (LangGraph 0.2)
              </span>
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-white/80">
                MIT License
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#supervisor" className="hover:text-white transition-colors">Supervisor Hub</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Execution Replay</a></li>
              <li><a href="#agents" className="hover:text-white transition-colors">Specialist Roster</a></li>
              <li><a href="#workspace" className="hover:text-white transition-colors">Workspace Patching</a></li>
              <li><a href="#state" className="hover:text-white transition-colors">GraphState Engine</a></li>
              <li><a href="#langgraph" className="hover:text-white transition-colors">LangGraph Deep Dive</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenDocs} className="hover:text-white transition-colors text-left">
                  Documentation Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenPaper} className="hover:text-white transition-colors text-left">
                  Research Whitepaper
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/shivamprasad1001/orchestratorflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#8a8f98]">
          <div>© {new Date().getFullYear()} OrchestratorFlow Framework. All rights reserved.</div>
          <div>Built for production AI agent orchestration.</div>
        </div>
      </div>
    </footer>
  );
}
