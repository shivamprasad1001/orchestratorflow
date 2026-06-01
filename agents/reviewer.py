from .base import AbstractBaseAgent
from models.state import SystemState

class ReviewerAgent(AbstractBaseAgent):
    @property
    def name(self) -> str:
        return "Reviewer"

    def run(self, state: SystemState) -> SystemState:
        language = state.target_language
        prompt = f"""
        Review this {language} code for correctness, performance, and idiomatic style.
        
        Task: "{state.task}"
        Code:
        ```{language}
        {state.code}
        ```
        
        Review Criteria for {language}:
        - Correct syntax and idioms.
        - Memory safety (C++/Rust), null safety (Java/Go).
        - Proper error handling in {language} style.
        - Correct entry point for {language}.
        - Does it solve the original task?
        
        If there are issues, provide specific feedback. If it's perfect, say "LGTM".
        """
        
        import time
        system_prompt = f"You are a code reviewer expert in {language}."
        start_time = time.time()
        review = self.llm.generate(prompt, system_prompt)
        elapsed = (time.time() - start_time) * 1000
        
        state.review = review
        state.add_step(
            self.name, 
            "success", 
            f"Code review completed for {language}",
            input_tokens=self._estimate_tokens(prompt + system_prompt),
            output_tokens=self._estimate_tokens(review),
            elapsed_ms=elapsed
        )
        return state
