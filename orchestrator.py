import time
import asyncio
from models.state import SystemState
from agents.planning import PlanningAgent
from agents.design import DesignAgent
from agents.coder import CoderAgent
from agents.reviewer import ReviewerAgent
from agents.tester import TesterAgent
from llm.router import get_llm_backend
from ui.console import print_step
from utils.file_manager import save_output

class OrchestratorFlow:
    def __init__(self, config):
        self.config = config
        self.llm = get_llm_backend(config)
        
        # Initialize agents
        self.planner = PlanningAgent(self.llm)
        self.designer = DesignAgent(self.llm)
        self.coder = CoderAgent(self.llm)
        self.reviewer = ReviewerAgent(self.llm)
        self.tester = TesterAgent(self.llm)
        self.state = None

    def run(self, task: str, language: str = "python") -> SystemState:
        """Synchronous run for CLI usage."""
        self.state = SystemState(task=task, target_language=language)
        
        try:
            # Step 1: Planning
            print_step("Planner", "running", "Creating implementation plan...")
            self.state = self.planner.run(self.state)
            print_step("Planner", "success", "Plan finalized.")

            # Step 2: Design
            print_step("Designer", "running", "Designing architecture...")
            self.state = self.designer.run(self.state)
            print_step("Designer", "success", "Architecture defined.")

            # Step 3: Coding
            print_step("Coder", "running", f"Generating {language} code...")
            self.state = self.coder.run(self.state)
            print_step("Coder", "success", "Initial code generated.")

            # Correction Loop
            while self.state.iteration < self.config.max_iterations:
                self.state.iteration += 1
                
                # Step 4: Review
                print_step("Reviewer", "running", f"Reviewing code (Iter {self.state.iteration})...")
                self.state = self.reviewer.run(self.state)
                
                is_lgtm = "LGTM" in self.state.review.upper()
                
                if not is_lgtm:
                    print_step("Reviewer", "fail", "Review feedback: Routing back to Coder...")
                    self.coder.mode = "review_fix"
                    print_step("Coder", "running", "Fixing code based on review...")
                    self.state = self.coder.run(self.state)
                    self.coder.mode = "initial"
                    print_step("Coder", "success", "Code updated.")
                    continue
                
                print_step("Reviewer", "success", "Code approved (LGTM).")
                
                # Step 5: Testing
                print_step("Tester", "running", "Executing and verifying code...")
                self.state = self.tester.run(self.state)
                
                if not self.state.history:
                    break
                    
                last_step = self.state.history[-1]
                if last_step.agent == "Tester" and last_step.status == "success":
                    print_step("Tester", "success", "Execution verified successfully.")
                    self.state.is_complete = True
                    break
                else:
                    print_step("Tester", "fail", "Execution failed: Routing back to Coder...")
                    self.coder.mode = "test_fix"
                    print_step("Coder", "running", "Fixing code based on test failure...")
                    self.state = self.coder.run(self.state)
                    self.coder.mode = "initial"
                    print_step("Coder", "success", "Code updated.")

            if not self.state.is_complete:
                print_step("System", "fail", f"Failed to complete task after {self.config.max_iterations} iterations.")

            # Finalize
            if self.state.is_complete:
                save_paths = save_output(self.state, self.config)
                self.state.add_step("System", "success", f"Files saved to {save_paths['code_path']}")

        except Exception as e:
            if self.state:
                self.state.error = str(e)
            print_step("System", "fail", f"Orchestration error: {e}")
            
        return self.state

    async def run_async(self, user_task: str, language: str = "python", event_callback=None):
        """Asynchronous run for WebSocket/Web UI usage."""
        self.state = SystemState(task=user_task, target_language=language)
        
        async def emit(event_type, **kwargs):
            event = {"type": event_type, "timestamp": time.time(), **kwargs}
            await event_callback(event)

        try:
            await emit("session_started", task=user_task)

            # Step 1: Planning
            await emit("agent_start", agent="Planner", message="Creating implementation plan...")
            self.state = await asyncio.to_thread(self.planner.run, self.state)
            await emit("agent_end", agent="Planner", status="success")

            # Step 2: Design
            await emit("agent_start", agent="Designer", message="Designing architecture...")
            self.state = await asyncio.to_thread(self.designer.run, self.state)
            await emit("agent_end", agent="Designer", status="success")

            # Step 3: Coding
            await emit("agent_start", agent="Coder", message="Generating initial code...")
            self.state = await asyncio.to_thread(self.coder.run, self.state)
            await emit("code_generated", code=self.state.code, language=self.state.target_language)
            await emit("agent_end", agent="Coder", status="success")

            # Correction Loop
            while self.state.iteration < self.config.max_iterations:
                self.state.iteration += 1
                
                # Step 4: Review
                await emit("agent_start", agent="Reviewer", message=f"Reviewing code (Iteration {self.state.iteration})...")
                self.state = await asyncio.to_thread(self.reviewer.run, self.state)
                await emit("agent_end", agent="Reviewer", status="success")
                
                is_lgtm = "LGTM" in self.state.review.upper()
                
                if not is_lgtm:
                    await emit("routing", next_agent="Coder", reason="Reviewer feedback")
                    self.coder.mode = "review_fix"
                    await emit("agent_start", agent="Coder", message="Fixing code based on review...")
                    self.state = await asyncio.to_thread(self.coder.run, self.state)
                    self.coder.mode = "initial"
                    await emit("code_generated", code=self.state.code, language=self.state.target_language)
                    await emit("agent_end", agent="Coder", status="success")
                    continue
                
                # Step 5: Testing
                await emit("agent_start", agent="Tester", message="Executing and verifying code...")
                self.state = await asyncio.to_thread(self.tester.run, self.state)
                
                if not self.state.history:
                    break
                    
                last_step = self.state.history[-1]
                if last_step.agent == "Tester" and last_step.status == "success":
                    await emit("agent_end", agent="Tester", status="success")
                    self.state.is_complete = True
                    break
                else:
                    await emit("agent_end", agent="Tester", status="fail")
                    await emit("routing", next_agent="Coder", reason="Test failure")
                    self.coder.mode = "test_fix"
                    await emit("agent_start", agent="Coder", message="Fixing code based on test failure...")
                    self.state = await asyncio.to_thread(self.coder.run, self.state)
                    self.coder.mode = "initial"
                    await emit("code_generated", code=self.state.code, language=self.state.target_language)
                    await emit("agent_end", agent="Coder", status="success")

            if self.state.is_complete:
                await emit("complete", success=True, payload={"code": self.state.code})
            else:
                await emit("complete", success=False, message="Max iterations reached without success")

        except Exception as e:
            import traceback
            traceback.print_exc()
            await emit("error", message=str(e))
            
        return self.state