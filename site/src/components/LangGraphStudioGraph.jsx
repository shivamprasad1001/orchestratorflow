import React, { useState } from "react";
import { BrainCircuit, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";

export function LangGraphStudioGraph() {
  const [viewMode, setViewMode] = useState("interactive"); // 'interactive' | 'screenshot'
  const [hoveredNode, setHoveredNode] = useState(null); // node id when hovered
  const [selectedNode, setSelectedNode] = useState("supervisor");

  const nodes = [
    { id: "start", label: "__start__", x: 500, y: 35, width: 110, height: 36, fill: "#161922", stroke: "#4b5563", textFill: "#d1d5db" },
    { id: "supervisor", label: "supervisor", x: 500, y: 105, width: 150, height: 46, fill: "#064e3b", stroke: "#10b981", textFill: "#34d399", isSupervisor: true },
    { id: "end", label: "__end__", x: 140, y: 55, width: 110, height: 36, fill: "#161922", stroke: "#4b5563", textFill: "#d1d5db" },
    { id: "coder", label: "coder", x: 120, y: 195, width: 120, height: 40, fill: "#064e3b", stroke: "#10b981", textFill: "#34d399" },
    { id: "designer", label: "designer", x: 190, y: 405, width: 130, height: 40, fill: "#172554", stroke: "#3b82f6", textFill: "#60a5fa" },
    { id: "human", label: "human", x: 390, y: 405, width: 120, height: 40, fill: "#1e1b4b", stroke: "#6366f1", textFill: "#818cf8" },
    { id: "planner", label: "planner", x: 590, y: 405, width: 130, height: 40, fill: "#422006", stroke: "#eab308", textFill: "#fde047" },
    { id: "reviewer", label: "reviewer", x: 770, y: 225, width: 130, height: 40, fill: "#4c0519", stroke: "#ec4899", textFill: "#f472b6" },
    { id: "tester", label: "tester", x: 900, y: 285, width: 120, height: 40, fill: "#3b0764", stroke: "#a855f7", textFill: "#c084fc" }
  ];

  const isEdgeActive = (edgeTargetNodeId) => {
    if (!hoveredNode) return true;
    if (hoveredNode === "supervisor") return true;
    return hoveredNode === edgeTargetNodeId;
  };

  const getNodeOpacity = (nodeId) => {
    if (!hoveredNode) return 1;
    if (hoveredNode === nodeId || nodeId === "supervisor") return 1;
    if (hoveredNode === "start" && nodeId === "start") return 1;
    if (hoveredNode === "end" && nodeId === "end") return 1;
    return 0.25;
  };

  return (
    <div className="bg-[#0b0c13] rounded-2xl border border-white/[0.08] p-3 sm:p-6 shadow-2xl space-y-4">
      {/* Header View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
          <BrainCircuit className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">LangGraph Studio View</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto justify-end">
          <button
            onClick={() => setViewMode("interactive")}
            className={`px-3 py-1 rounded-full transition-all text-xs ${
              viewMode === "interactive"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                : "bg-white/[0.04] text-[#8a8f98] hover:text-white"
            }`}
          >
            Vector Graph View
          </button>
          <button
            onClick={() => setViewMode("screenshot")}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 text-xs ${
              viewMode === "screenshot"
                ? "bg-white text-black font-bold"
                : "bg-white/[0.04] text-[#8a8f98] hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Original Screenshot
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "screenshot" ? (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black p-2 sm:p-4 flex justify-center">
          <img
            src="/orchestratorflow/Supervisor.png"
            alt="Official LangGraph Studio Supervisor Diagram"
            className="w-full max-w-4xl max-h-[450px] object-contain rounded-lg shadow-2xl"
          />
        </div>
      ) : (
        <div className="relative w-full bg-[#08090e] rounded-xl border border-white/[0.06] p-2 overflow-x-auto shadow-inner">
          <div className="min-w-[650px] sm:min-w-0">
            <svg
              viewBox="0 0 1020 470"
              className="w-full h-auto max-h-[520px] select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
                <marker id="arrowIndigo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                </marker>
                <marker id="arrowYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#eab308" />
                </marker>
                <marker id="arrowPink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ec4899" />
                </marker>
                <marker id="arrowPurple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                </marker>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Outbound Dashed Green Paths */}
              <g>
                <path d="M 500 53 L 500 82" stroke="#10b981" strokeWidth={isEdgeActive("start") ? (hoveredNode ? "3" : "2") : "1"} strokeDasharray="4,4" opacity={isEdgeActive("start") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 430 105 Q 260 70 180 175" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("coder") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("coder") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 440 120 Q 280 220 220 385" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("designer") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("designer") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 470 125 Q 400 240 390 385" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("human") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("human") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 530 125 Q 580 240 590 385" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("planner") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("planner") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 570 120 Q 690 140 760 205" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("reviewer") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("reviewer") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 575 105 Q 780 110 880 265" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("tester") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("tester") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
                <path d="M 425 95 Q 260 40 195 55" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("end") ? (hoveredNode ? "3" : "1.8") : "1"} strokeDasharray="5,5" opacity={isEdgeActive("end") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="animate-flow-dash transition-all duration-300" />
              </g>

              {/* Inbound Solid Curved Return Paths */}
              <g>
                <path d="M 180 215 Q 300 240 430 120" fill="none" stroke="#10b981" strokeWidth={isEdgeActive("coder") ? (hoveredNode ? "3" : "2") : "1"} opacity={isEdgeActive("coder") ? 1 : 0.15} markerEnd="url(#arrowGreen)" className="transition-all duration-300" />
                <path d="M 235 385 Q 330 260 455 125" fill="none" stroke="#3b82f6" strokeWidth={isEdgeActive("designer") ? (hoveredNode ? "3" : "2") : "1"} opacity={isEdgeActive("designer") ? 1 : 0.15} markerEnd="url(#arrowBlue)" className="transition-all duration-300" />
                <path d="M 405 385 Q 450 260 485 125" fill="none" stroke="#6366f1" strokeWidth={isEdgeActive("human") ? (hoveredNode ? "3" : "2") : "1"} opacity={isEdgeActive("human") ? 1 : 0.15} markerEnd="url(#arrowIndigo)" className="transition-all duration-300" />
                <path d="M 575 385 Q 530 260 515 125" fill="none" stroke="#eab308" strokeWidth={isEdgeActive("planner") ? (hoveredNode ? "3" : "2") : "1"} opacity={isEdgeActive("planner") ? 1 : 0.15} markerEnd="url(#arrowYellow)" className="transition-all duration-300" />
                <path d="M 730 240 Q 640 250 545 120" fill="none" stroke="#ec4899" strokeWidth={isEdgeActive("reviewer") ? (hoveredNode ? "3" : "2") : "1"} opacity={isEdgeActive("reviewer") ? 1 : 0.15} markerEnd="url(#arrowPink)" className="transition-all duration-300" />
                <path d="M 840 300 Q 690 320 550 115" fill="none" stroke="#a855f7" strokeWidth={isEdgeActive("tester") ? (hoveredNode ? "3" : "2") : "1"} opacity={isEdgeActive("tester") ? 1 : 0.15} markerEnd="url(#arrowPurple)" className="transition-all duration-300" />
              </g>

              {/* SVG Nodes */}
              {nodes.map((n) => {
                const isSelected = selectedNode === n.id;
                const isHovered = hoveredNode === n.id;
                const nodeOpacity = getNodeOpacity(n.id);
                const rx = 14;

                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x - n.width / 2}, ${n.y - n.height / 2})`}
                    onMouseEnter={() => setHoveredNode(n.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(n.id)}
                    opacity={nodeOpacity}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {(n.isSupervisor || isHovered) && (
                      <rect x="-4" y="-4" width={n.width + 8} height={n.height + 8} rx={rx + 2} fill={n.isSupervisor ? "#10b981" : n.stroke} opacity={isHovered ? "0.4" : "0.2"} filter="url(#glow)" />
                    )}

                    <rect width={n.width} height={n.height} rx={rx} fill={n.fill} stroke={isHovered || isSelected ? "#ffffff" : n.stroke} strokeWidth={isHovered || isSelected ? "3" : "1.5"} className="transition-all duration-200" />

                    <text x={n.width / 2} y={n.height / 2 + 4} textAnchor="middle" fill={isHovered ? "#ffffff" : n.textFill} fontSize={n.isSupervisor ? "13" : "12"} fontWeight={n.isSupervisor || isHovered ? "bold" : "600"} fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-2 px-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#8a8f98] gap-2">
            <span className="text-white font-bold">
              {hoveredNode ? (
                <span className="text-emerald-400">
                  Active Node: <strong>{hoveredNode.toUpperCase()}</strong>
                </span>
              ) : (
                <span>Hover or tap any agent node to isolate its Supervisor edges</span>
              )}
            </span>
            <span className="text-white/60">Vector View</span>
          </div>
        </div>
      )}
    </div>
  );
}
