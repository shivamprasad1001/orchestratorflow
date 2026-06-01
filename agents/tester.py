from .base import AbstractBaseAgent
from models.state import SystemState
from languages import get_runtime

class TesterAgent(AbstractBaseAgent):
    @property
    def name(self) -> str:
        return "Tester"

    def run(self, state: SystemState) -> SystemState:
        language = state.target_language
        runtime = get_runtime(language)
        
        if not runtime.is_available():
            msg = f"Runtime for {language} is not available. Please install it."
            state.test_results = msg
            state.add_step(self.name, "fail", msg)
            return state

        # Execute code
        result = runtime.execute(state.code)
        
        if result.compile_error:
            state.test_results = runtime.format_error(result)
            state.add_step(self.name, "fail", f"Compilation failed: {result.compile_error[:100]}...")
            return state
            
        if result.timed_out:
            state.test_results = "Execution timed out after 15s"
            state.add_step(self.name, "fail", "Execution timed out")
            return state

        # LLM validation of output
        prompt = f"""
        Analyze the execution results of the following {language} code for the task: "{state.task}"
        
        Code:
        ```{language}
        {state.code}
        ```
        
        STDOUT:
        {result.stdout}
        
        STDERR:
        {result.stderr}
        
        EXIT CODE: {result.exit_code}
        
        Does the output satisfy the task requirements? Provide a brief summary.
        If it failed, explain why based on the output.
        """
        
        import time
        system_prompt = f"You are a test verification agent for {language} code."
        start_time = time.time()
        validation = self.llm.generate(prompt, system_prompt)
        elapsed = (time.time() - start_time) * 1000
        
        state.test_results = f"{validation}\n\n--- Raw Output ---\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
        
        input_tokens = self._estimate_tokens(prompt + system_prompt)
        output_tokens = self._estimate_tokens(validation)

        if result.success:
            state.add_step(self.name, "success", "Tests passed and verified", input_tokens, output_tokens, elapsed)
        else:
            state.add_step(self.name, "fail", f"Execution failed with exit code {result.exit_code}", input_tokens, output_tokens, elapsed)
            
        return state
