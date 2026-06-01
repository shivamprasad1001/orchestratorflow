from .base import AbstractBaseAgent
from models.state import SystemState

class PlanningAgent(AbstractBaseAgent):
    @property
    def name(self) -> str:
        return "Planner"

    def run(self, state: SystemState) -> SystemState:
        language = state.target_language
        prompt = f"""
        You are an expert software architect planning a solution for the following task:
        "{state.task}"
        
        The target language is: {language}.
        
        Your goal is to create a detailed implementation plan.
        - Use {language} idioms, standard library, and conventions.
        - Specify the entry point: {self._get_main_pattern(language)}.
        - Outline the logic, data structures, and edge cases to handle.
        - Keep it concise but comprehensive.
        """
        
        import time
        system_prompt = f"You are a planning agent for a {language} project."
        start_time = time.time()
        plan = self.llm.generate(prompt, system_prompt)
        elapsed = (time.time() - start_time) * 1000
        
        state.plan = plan
        state.add_step(
            self.name, 
            "success", 
            f"Plan created for {language}",
            input_tokens=self._estimate_tokens(prompt + system_prompt),
            output_tokens=self._estimate_tokens(plan),
            elapsed_ms=elapsed
        )
        return state

    def _get_main_pattern(self, language: str) -> str:
        patterns = {
            "python": "if __name__ == '__main__':",
            "javascript": "Direct execution or main() call",
            "cpp": "int main() { ... }",
            "java": "public static void main(String[] args)",
            "go": "func main() { ... }",
            "rust": "fn main() { ... }"
        }
        return patterns.get(language.lower(), "standard entry point")
