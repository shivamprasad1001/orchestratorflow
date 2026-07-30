import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SupervisorSection } from "./components/SupervisorSection";
import { LiveExecutionDemo } from "./components/LiveExecutionDemo";
import { AgentsSection } from "./components/AgentsSection";
import { SupervisorDecisionEngine } from "./components/SupervisorDecisionEngine";
import { WorkspaceSection } from "./components/WorkspaceSection";
import { StateManagementSection } from "./components/StateManagementSection";
import { LangGraphSection } from "./components/LangGraphSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { CliPlayground } from "./components/CliPlayground";
import { DocumentationModal } from "./components/DocumentationModal";
import { ResearchPaperModal } from "./components/ResearchPaperModal";
import { Footer } from "./components/Footer";

export default function App() {
  const [docsOpen, setDocsOpen] = useState(false);
  const [paperOpen, setPaperOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07080d] text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <Navbar onOpenDocs={() => setDocsOpen(true)} onOpenPaper={() => setPaperOpen(true)} />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenDocs={() => setDocsOpen(true)} onOpenPaper={() => setPaperOpen(true)} />
        <SupervisorSection />
        <LiveExecutionDemo />
        <AgentsSection />
        <SupervisorDecisionEngine />
        <WorkspaceSection />
        <StateManagementSection />
        <LangGraphSection />
        <FeaturesSection />
        <ComparisonSection />
        <CliPlayground />
      </main>

      {/* Footer */}
      <Footer onOpenDocs={() => setDocsOpen(true)} onOpenPaper={() => setPaperOpen(true)} />

      {/* Modals */}
      <DocumentationModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
      <ResearchPaperModal isOpen={paperOpen} onClose={() => setPaperOpen(false)} />
    </div>
  );
}
