# OrchestratorFlow v2.0.0

A language-agnostic, production-grade multi-agent coding system that generates, executes, and verifies code in Python, JavaScript, C++, Java, Go, and Rust.

## Features

- **Multi-Language Runtimes:** Pluggable runtime layer for 6+ languages.
- **Production-Grade Architecture:** Modularized agents, backends, and utilities.
- **Advanced Orchestration:** Planning, Design, Coder, Reviewer, and Tester agents working in harmony.
- **Rich CLI:** Typer-based CLI with stunning Rich UI and environment diagnostics.
- **Flexible LLM Backends:** Support for Groq, Gemini, and Ollama.

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your `.env` file (see `.env.example`).

## Usage

### Run a Task
```bash
python main.py run "Create a binary search algorithm" --lang javascript
```

### Check Environment
```bash
python main.py check-env
```

## Project Structure

```
orchestratorflow/
├── main.py                # Typer CLI entry point
├── orchestrator.py        # Core routing loop
├── config.py              # Pydantic Settings
├── agents/                # Multi-agent team
├── languages/             # Language runtime layer
├── llm/                   # LLM backends and routing
├── models/                # Pydantic data models
├── ui/                    # Rich UI components
└── utils/                 # Extraction and file management
```
