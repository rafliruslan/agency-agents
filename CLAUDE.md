# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Agency** is a community-driven collection of specialized AI agent personalities. Each agent is a `.md` file with YAML frontmatter defining a distinct expert persona for use with Claude Code, Cursor, Aider, Windsurf, Gemini, OpenClaw, Qwen, and other AI tools. Source agents live in category directories; conversion scripts generate tool-specific formats.

## Commands

```bash
# Lint agent files (validates frontmatter + structure)
./scripts/lint-agents.sh                    # All agents
./scripts/lint-agents.sh path/to/agent.md   # Single file

# Convert agents to tool-specific integration formats
./scripts/convert.sh                        # All tools
./scripts/convert.sh --tool cursor          # Single tool (antigravity|gemini-cli|opencode|cursor|aider|windsurf|openclaw|qwen)

# Install agents to local tool config directories
./scripts/install.sh                        # Interactive
./scripts/install.sh --tool claude-code     # Specific tool
```

CI runs `lint-agents.sh` on PRs that touch agent directories.

## Agent File Format

Every agent file requires YAML frontmatter with three required fields (`name`, `description`, `color`) and optional fields (`emoji`, `vibe`, `services`):

```yaml
---
name: Agent Name
description: One-line specialty description
color: colorname or "#hexcode"
emoji: 🎯                                    # optional
vibe: One-line personality hook               # optional
services:                                     # optional — external API dependencies
  - name: Service Name
    url: https://service-url.com
    tier: free                                # free, freemium, or paid
---
```

Sections are grouped into two semantic categories (used by OpenClaw converter to split files):

- **Persona** (who the agent is): Identity & Memory, Communication Style, Critical Rules
- **Operations** (what the agent does): Core Mission, Technical Deliverables, Workflow Process, Success Metrics, Advanced Capabilities

The linter enforces:
- **ERROR** (blocks merge): YAML frontmatter with `name`, `description`, `color` fields
- **WARN**: Recommended sections — "Identity", "Core Mission", "Critical Rules"
- **WARN**: Body shorter than 50 words

File naming convention: `<division>-<agent-slug>.md` (e.g., `engineering-frontend-developer.md`), using lowercase kebab-case.

## Repository Structure

```
design/              # UI, UX, brand, visual storytelling agents
engineering/         # Frontend, backend, mobile, AI, DevOps, security agents
game-development/    # Game design, audio; subdirs: godot/, unity/, unreal-engine/, roblox-studio/
marketing/           # Growth, social media, content, regional/China-market agents
paid-media/          # PPC, programmatic, paid social, tracking agents
sales/               # Pipeline, coaching, proposals, outbound agents
product/             # Prioritization, trends, feedback agents
project-management/  # Producer, shepherd, operations agents
testing/             # QA, performance, API, accessibility agents
support/             # Customer service, analytics, finance agents
spatial-computing/   # XR, Vision Pro, WebXR agents
specialized/         # Orchestrator, compliance, identity, blockchain agents
strategy/            # NEXUS orchestration framework with playbooks and runbooks
examples/            # Multi-agent workflow demonstrations
integrations/        # Tool-specific output dirs (generated, mostly gitignored)
scripts/             # convert.sh, install.sh, lint-agents.sh
```

## Tool Integration Pipeline

`convert.sh` reads `.md` agents from division directories and generates tool-specific files in `integrations/<tool>/`. Generated files under `integrations/` are gitignored — only the scripts and per-tool README files are committed.

## Key Conventions

- Agent files use emoji headers (🧠, 🎯, 🚨, 📋, etc.) for visual scanning
- Agents must have narrow specialization, distinct personality, concrete code examples, and measurable success metrics with specific numbers
- Code examples must be real/runnable with language-specified fenced blocks, not pseudo-code
- Some categories have subdirectories (e.g., `game-development/godot/`) — the linter and converter scan recursively
- Agents depending on external services must declare them in `services` frontmatter and still be useful without the API
- Generated integration files under `integrations/` are gitignored — only `integrations/*/README.md` and `integrations/claude-code/` are committed
- Line endings are LF for `.md`, `.yml`, `.yaml`, `.sh` (enforced via `.gitattributes`)
- PR titles follow: "Add [Agent Name] - [Category]"
- Branch names follow: `add-agent-name`

## What Not to Do

- Do not commit generated integration files (they're gitignored)
- Do not create agents with overly broad scope
- Do not add agents without testing them in real scenarios
- Do not duplicate vendor documentation inside agent files — reference it instead
- Do not strip personality from agents during edits
