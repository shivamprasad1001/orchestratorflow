from .base import AbstractBaseAgent
from models.state import SystemState

class DesignAgent(AbstractBaseAgent):
    @property
    def name(self) -> str:
        return "Designer"

    def run(self, state: SystemState) -> SystemState:
        language = state.target_language
        prompt = f"""
        Design the architecture for the following task based on the plan.
        
        Task: "{state.task}"
        Target Language: {language}
        Plan:
        {state.plan}
        
        Design Requirements:
        - Design the architecture in {language}.
        - Use proper {language} types, structs/classes, and error handling patterns.
        - For compiled languages: specify build steps and dependencies if any (though we aim for standard library).
        - Define the function signatures and class structures.
        """
        
        import time
        system_prompt = f"You are a design agent for a {language} project."
        start_time = time.time()
        design = self.llm.generate(prompt, system_prompt)
        elapsed = (time.time() - start_time) * 1000
        
        state.design = design
        state.add_step(
            self.name, 
            "success", 
            f"Architecture designed in {language}",
            input_tokens=self._estimate_tokens(prompt + system_prompt),
            output_tokens=self._estimate_tokens(design),
            elapsed_ms=elapsed
        )
        return state
