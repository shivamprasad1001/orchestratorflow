import React from "react";
import { FEATURES_LIST } from "../data/featuresData";
import {
  Compass,
  Cpu,
  Folder,
  GitBranch,
  ShieldCheck,
  TestTube2,
  UserCheck,
  Database,
  Activity,
  Sparkles,
  Terminal
} from "lucide-react";

export function FeaturesSection() {
  const getIcon = (name) => {
    switch (name) {
      case "Compass":
        return Compass;
      case "Cpu":
        return Cpu;
      case "Folder":
        return Folder;
      case "GitBranch":
        return GitBranch;
      case "ShieldCheck":
        return ShieldCheck;
      case "TestTube2":
        return TestTube2;
      case "UserCheck":
        return UserCheck;
      case "Database":
        return Database;
      case "Activity":
        return Activity;
      case "Sparkles":
        return Sparkles;
      case "Terminal":
        return Terminal;
      default:
        return Sparkles;
    }
  };

  return (
    <section className="py-24 bg-canvas hairline-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8a8f98] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
            Built for Enterprise Orchestration
          </h2>
          <p className="mt-4 text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
            Every feature is engineered to eliminate hallucinated code dumps and provide strict feedback verification.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES_LIST.map((feat) => {
            const Icon = getIcon(feat.icon);
            return (
              <div
                key={feat.id}
                className="p-6 rounded-xl bg-[#0c0d12] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mb-5">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-sans">{feat.title}</h3>
                  <p className="text-xs text-[#8a8f98] leading-relaxed font-sans">{feat.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
                  <span>Production Ready</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
