# Synthesis and Iteration

Process discipline before and after authoring. Source: skill-writer `synthesis-path.md` and `iteration-path.md`, adapted.

## Synthesis: before you write

### Source collection

1. Identify local source files first, then primary external sources for tools, APIs, standards, and current behavior.
2. Record source names or URLs when adapting material (provenance).
3. Separate facts from assumptions; list unresolved gaps as explicit assumptions.

### Coverage checklist

Confirm the planned skill covers:

- When to use and when not to use it.
- Required inputs and permissions.
- Main workflow.
- Expected outputs.
- Validation commands or checks.
- Common failure modes.
- Safety boundaries.

### Depth gates

Do not move to authoring until:

- The core task can be executed from the skill alone (no hidden context).
- Risky or irreversible actions have prerequisites.
- External sources are credited when required.
- Missing information is either resolved or listed as an explicit assumption.

## Iteration: improving from outcomes

### Gather examples

Collect positive examples (skill helped), negative examples (skill misfired), fix examples (desired behavior), and any validation output or user correction. Remove secrets and unrelated personal data before storing examples.

### Diagnose

For each example, identify whether the problem is:

- **Triggering**: skill loaded too often or not often enough.
- **Routing**: wrong reference or workflow branch.
- **Instruction gap**: missing step, safety rule, or output requirement.
- **Validation gap**: no check caught the failure.
- **Overload**: too much context or too many steps.

### Patch

Make the smallest instruction change that would have changed the outcome. Retest against at least one positive and one negative example when feasible. Record remaining gaps in the closeout report.
