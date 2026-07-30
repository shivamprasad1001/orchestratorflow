import React, { useState, useEffect } from "react";
import { Workflow, Github, Play, BookOpen, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar({ onOpenDocs, onOpenPaper }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Supervisor", href: "#supervisor" },
    { label: "Execution Replay", href: "#demo" },
    { label: "Agents", href: "#agents" },
    { label: "Workspace", href: "#workspace" },
    { label: "GraphState", href: "#state" },
    { label: "LangGraph", href: "#langgraph" },
    { label: "Comparison", href: "#comparison" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#08090a]/90 backdrop-blur-md border-b border-white/[0.08] py-3"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#top" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center group-hover:border-white/30 transition-all">
            <Workflow className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-tight text-sm sm:text-base">OrchestratorFlow</span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 border border-white/10 hidden sm:inline-block">
              v1.0.0
            </span>
          </div>
        </a>

        {/* Desktop & Tablet Nav */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-[#8a8f98]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/90 text-xs font-medium hover:bg-white/[0.1] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-white/70" />
            Docs
          </button>

          <a
            href="https://github.com/shivamprasad1001/orchestratorflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-all text-xs font-medium"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-50" />
          </a>

          <a
            href="#demo"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-medium text-xs hover:bg-neutral-200 transition-all shadow-sm shrink-0"
          >
            <Play className="w-3 h-3 fill-current" />
            Run Replay
          </a>
        </div>

        {/* Mobile & Tablet Hamburger Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden text-white/80 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[60px] bg-[#0a0b0e]/95 backdrop-blur-2xl border-b border-white/10 p-6 space-y-4 shadow-2xl z-50">
          <div className="flex flex-col gap-2.5 font-medium text-sm text-[#8a8f98]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white transition-all border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDocs();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/[0.08] border border-white/10 text-white text-xs font-medium"
            >
              <BookOpen className="w-4 h-4" /> Documentation
            </button>
            <a
              href="https://github.com/shivamprasad1001/orchestratorflow"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white text-black text-xs font-medium"
            >
              <Github className="w-4 h-4" /> View GitHub Repository
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
