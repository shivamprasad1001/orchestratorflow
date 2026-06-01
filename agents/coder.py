from .base import AbstractBaseAgent
from models.state import SystemState
from utils.code_extractor import strip_fences

class CoderAgent(AbstractBaseAgent):
    @property
    def name(self) -> str:
        return "Coder"

    def run(self, state: SystemState) -> SystemState:
        language = state.target_language
        prompt = f"""
        Write complete, immediately executable {language} code for the following task.
        
        Task: "{state.task}"
        Target Language: {language}
        Plan: {state.plan}
        Design: {state.design}
        
        Coding Requirements:
        - Output ONLY valid {language} code.
        - Include the standard entry point for {language}:
          Python:     if __name__ == '__main__':
          JavaScript: // Run directly with node
          C++:        int main() {{ ... }}
          Java:       public static void main(String[] args)
          Go:         func main() {{ ... }}
          Rust:       fn main() {{ ... }}
        - Do not include markdown fences in your final code output if possible, but if you do, ensure the code is clearly marked.
        - Ensure all imports/includes are present.
        - The code must be self-contained and solve the task completely.
        """
        
        import time
        
        # Adjust prompt based on mode
        if self.mode == "review_fix":
            prompt = f"Fix the following {language} code based on the review feedback.\n\nFeedback: {state.review}\n\nCode:\n{state.code}"
        elif self.mode == "test_fix":
            prompt = f"Fix the following {language} code based on the test results.\n\nResults: {state.test_results}\n\nCode:\n{state.code}"
        
        system_prompt = f"You are a coding agent specializing in {language}. Output ONLY code."
        start_time = time.time()
        raw_code = self.llm.generate(prompt, system_prompt)
        elapsed = (time.time() - start_time) * 1000
        
        code = strip_fences(raw_code, language)
        state.code = code
        state.add_step(
            self.name, 
            "success", 
            f"Code generated in {language} (Mode: {self.mode})",
            input_tokens=self._estimate_tokens(prompt + system_prompt),
            output_tokens=self._estimate_tokens(raw_code),
            elapsed_ms=elapsed
        )
        return state
