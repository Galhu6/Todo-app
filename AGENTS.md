# AGENTS.md

This file defines the autonomous agents used in the MCP (Model Context Protocol) system. Each agent has a distinct role and set of responsibilities. Together, they enable recursive task execution, self-improvement, and modular development.

---

## 🧠 ArchitectAgent
- **Role**: Task strategist and planner.
- **Responsibilities**:
  - Parse natural language requests into structured task definitions.
  - Decompose large goals into smaller subtasks.
  - Select appropriate agents for each step.
- **Inputs**:
  - User prompts
- **Outputs**:
  - Valid task JSON schemas
  - Delegation to other agents

---

## 🛠️ EngineerAgent
- **Role**: Code generator and implementer.
- **Responsibilities**:
  - Generate function implementations based on task JSON.
  - Choose appropriate programming language and structure.
  - Handle logic, parameterization, and return types.
- **Inputs**:
  - Task JSON
- **Outputs**:
  - Full function code with documentation

---

## 🧪 EvaluatorAgent
- **Role**: Code quality inspector.
- **Responsibilities**:
  - Execute generated functions.
  - Analyze outputs and verify if results meet task expectations.
  - Report success/failure with rationale.
- **Inputs**:
  - Function code and expected output
- **Outputs**:
  - Evaluation report and pass/fail result

---

## 🔁 FixerAgent
- **Role**: Error resolver and refiner.
- **Responsibilities**:
  - Analyze function errors (runtime, logical, or type-based).
  - Modify and regenerate faulty code.
  - Maintain functional integrity during fixes.
- **Inputs**:
  - Function code + Error output
- **Outputs**:
  - Fixed version of the function

---

## 🧠 MetaArchitectAgent
- **Role**: Overseer of the entire system.
- **Responsibilities**:
  - Monitor task flow and progress.
  - Trigger fallback plans on failure.
  - Ask clarifying questions if goals are ambiguous.
- **Inputs**:
  - Task state, failures, user goals
- **Outputs**:
  - Adjusted task plans, improvement prompts

---

## 🧱 BuilderAgent
- **Role**: Code integration agent.
- **Responsibilities**:
  - Assemble multiple function files into a coherent module.
  - Create index files, folders, and exports.
  - Ensure naming conventions and file structure integrity.
- **Inputs**:
  - Validated functions
- **Outputs**:
  - Project folder with full structure

---

## 💾 MemoryAgent
- **Role**: Persistent context handler.
- **Responsibilities**:
  - Save function metadata, task history, and schema usage.
  - Retrieve relevant memory for future task generation.
  - Prevent duplication and encourage self-evolution.
- **Inputs**:
  - Completed task objects
- **Outputs**:
  - Memory record updates

---

## 📊 LoggerAgent
- **Role**: Task tracking and diagnostics.
- **Responsibilities**:
  - Log input/output at each step.
  - Summarize agent decisions and status.
  - Assist with debugging and transparency.
- **Inputs**:
  - All agent outputs
- **Outputs**:
  - Logs, status dashboards

---

## 🔒 SecurityAgent (Planned)
- **Role**: Safety and permission controller.
- **Responsibilities**:
  - Prevent dangerous or unauthorized function execution.
  - Verify trust level of agents before allowing critical changes.
- **Inputs**:
  - Task context and permission level
- **Outputs**:
  - Approval or rejection signal

