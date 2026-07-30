import React, { useState } from "react";
import { Folder, FolderOpen, FileText, FileCode, FileJson, GitBranch } from "lucide-react";

export function WorkspaceSection() {
  const [selectedFile, setSelectedFile] = useState("src/auth.py");

  const files = [
    {
      path: "workspace/run_001/src/auth.py",
      name: "src/auth.py",
      status: "patched",
      diff: `@@ -10,6 +10,12 @@
- SECRET_KEY = "hardcoded_fallback_dev" # Security flaw!
+ SECRET_KEY = os.getenv("JWT_SECRET_KEY")
+ if not SECRET_KEY:
+     raise ValueError("JWT_SECRET_KEY environment variable missing")

  def decode_token(token: str):
      try:
          return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
+     except jwt.ExpiredSignatureError:
+         raise HTTPException(status_code=401, detail="Token has expired")`
    },
    {
      path: "workspace/run_001/src/main.py",
      name: "src/main.py",
      status: "untouched",
      diff: `# Untouched source file — preserved intact
from fastapi import FastAPI
from src.auth import auth_router

app = FastAPI(title="FastAPI OAuth2 Service")
app.include_router(auth_router)`
    },
    {
      path: "workspace/run_001/tests/test_auth.py",
      name: "tests/test_auth.py",
      status: "untouched",
      diff: `import pytest
from src.auth import decode_token

def test_jwt_valid_signature():
    token = create_test_jwt()
    payload = decode_token(token)
    assert payload["sub"] == "test_user"`
    },
    {
      path: "workspace/run_001/README.md",
      name: "README.md",
      status: "untouched",
      diff: `# FastAPI JWT Microservice
Generated via OrchestratorFlow v1.4.0`
    },
    {
      path: "workspace/run_001/metadata.json",
      name: "metadata.json",
      status: "updated",
      diff: `{
  "run_id": "run_001",
  "iterations": 2,
  "last_modified_files": ["src/auth.py"],
  "review_status": "passed",
  "test_status": "passed"
}`
    }
  ];

  const activeFileObj = files.find((f) => f.name === selectedFile) || files[0];

  return (
    <section id="workspace" className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <GitBranch className="w-3.5 h-3.5 text-white" />
            Workspace Persistence
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Incremental File Patching
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            The project is generated once. Subsequent retries modify only changed files using precision Git diff patches.
            Never regenerate the whole repository.
          </p>
        </div>

        {/* Workspace IDE Container */}
        <div className="bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar (Left) */}
            <div className="lg:col-span-4 bg-[#08090c] rounded-xl p-4 border border-white/[0.08] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[#8a8f98]">
                <span className="flex items-center gap-2 font-bold text-white">
                  <FolderOpen className="w-4 h-4 text-white" /> workspace/
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white">run_001</span>
              </div>

              <div className="space-y-1 text-[#8a8f98] pt-2">
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-left transition-all ${
                      selectedFile === file.name
                        ? "bg-white/10 text-white font-bold"
                        : "hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-white/70" />
                      {file.name}
                    </span>
                    {file.status === "patched" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        DIFF
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Patch Viewer (Right) */}
            <div className="lg:col-span-8 bg-[#040508] rounded-xl p-6 border border-white/[0.08] font-mono text-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-[#8a8f98]">
                <span className="text-white font-bold">{activeFileObj.path}</span>
                <span>
                  {activeFileObj.status === "patched" ? (
                    <span className="text-emerald-400 font-bold">✔ Precision Diff Patch Applied</span>
                  ) : (
                    <span className="opacity-60">Preserved Intact</span>
                  )}
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] overflow-x-auto text-[11px] leading-relaxed flex-1">
                <code>
                  {activeFileObj.diff.split("\n").map((line, idx) => {
                    let lineStyle = "text-[#8a8f98]";
                    if (line.startsWith("+")) lineStyle = "text-emerald-400 bg-emerald-950/40 font-bold";
                    if (line.startsWith("-")) lineStyle = "text-rose-400 bg-rose-950/40 font-bold";
                    if (line.startsWith("@@")) lineStyle = "text-cyan-300 font-bold";

                    return (
                      <div key={idx} className={`${lineStyle} py-0.5 px-1 rounded`}>
                        {line}
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
