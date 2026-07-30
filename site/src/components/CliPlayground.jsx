import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export function CliPlayground() {
  const [activeTab, setActiveTab] = useState("start");
  const [copied, setCopied] = useState(false);

  const commands = {
    start: {
      cmd: 'orchestratorflow "Build a FastAPI OAuth2 service with SQLite"',
      output: `[16:20:01] 🚀 OrchestratorFlow v1.4.0 (LangGraph Engine)
[16:20:01] 🧠 Supervisor Initialized. Target workspace: workspace/run_042
[16:20:02] 📋 Planner Node: Generated 4 architectural tasks
[16:20:03] 🎨 Designer Node: Formulated Pydantic schemas & SQLite models
[16:20:05] 💻 Coder Node: Wrote initial files (main.py, auth.py, db.py)
[16:20:06] 🛡️ Reviewer Node: ✖ AST Audit failed (missing Exception handler)
[16:20:06] ⚠️ Supervisor: Feedback loop triggered! Retrying Coder (1/5)
[16:20:08] 💻 Coder Node: Applied precision git diff patch to auth.py
[16:20:09] 🛡️ Reviewer Node: ✔ Code audit PASSED cleanly
[16:20:11] ⚡ Tester Node: 6 unit tests PASSED (0.14s)
[16:20:11] ✨ Supervisor: Workflow Complete! Output ready at workspace/run_042`
    },
    debug: {
      cmd: 'orchestratorflow --debug "Create a health-check microservice"',
      output: `[16:21:00] 🔍 Debug Mode Enabled (Verbose State Tracing)
[16:21:00] [GraphState] current_agent=Supervisor iteration=0
[16:21:01] [LangSmith Trace] TraceID: ls_7728a9b1 Event: node_enter -> Planner
[16:21:02] [GraphState] plan={"files":["main.py","test_main.py"]}`
    },
    resume: {
      cmd: "orchestratorflow resume --thread run_042 --input database=PostgreSQL",
      output: `[16:22:00] 🔄 Resuming checkpoint from SQLite checkpointer...
[16:22:00] 👤 Human Interrupt Node cleared. Injected user choice: PostgreSQL
[16:22:01] 🧠 Supervisor: Routing execution -> Designer`
    }
  };

  const currentCmd = commands[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCmd.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <Terminal className="w-3.5 h-3.5 text-white" />
            CLI Interface
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Production CLI Command
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            Execute complex multi-agent workflows directly from your terminal.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-2 font-mono text-xs">
              {[
                { id: "start", label: "Default Run" },
                { id: "debug", label: "Debug Tracing" },
                { id: "resume", label: "Resume Interrupt" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-black font-bold"
                      : "bg-white/[0.04] text-[#8a8f98] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Command"}
            </button>
          </div>

          {/* Terminal Box */}
          <div className="bg-[#040508] rounded-xl p-5 border border-white/[0.08] font-mono text-xs space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm bg-black/60 p-3 rounded-lg border border-white/[0.08]">
              <span className="text-[#8a8f98]">$</span>
              <span>{currentCmd.cmd}</span>
            </div>

            <div className="space-y-1 text-[#8a8f98] text-[11px] max-h-56 overflow-y-auto">
              {currentCmd.output.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
