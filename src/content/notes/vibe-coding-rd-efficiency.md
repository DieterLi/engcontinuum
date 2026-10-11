---
title: A Vibe Coding workflow that ships
summary: A personal practice for turning a PRD into a running frontend, API, and database — contract first, then code.
date: 2026-10-10
category: practice
tags:
  - vibe-coding
  - workflow
  - fullstack
---

This is a Vibe Coding workflow I have reused across personal projects and day-to-day development. The goal is to make AI coding tools reliable, not occasionally impressive.

---

## 1. The idea in one line

**PRD in, stack out.** Feed in a product requirements document and have AI coding tools produce a runnable full-stack app: frontend, API, and database. The path from requirements to something you can actually run is end to end.

The point is not to build another platform. It is a personal workflow and a prompt method you can repeat — prove it on a demo, then keep using it on real work.

---

## 2. Why this method exists

### 2.1 Where time actually goes

| Stage | What goes wrong | Cost |
| --- | --- | --- |
| Requirements | Endless alignment; the implementation drifts from the intent | High communication overhead |
| Technical design | Schema design and API definition take too long | Hours to days |
| Implementation | Boilerplate dominates (CRUD and the rest) | 60%+ of the cycle |
| Integration and deploy | Environment setup, contract mismatches, and deploy config | Slow and error-prone |
| Frontend / API boundary | Field names and types disagree; integration time is spent reconciling payloads | Constant rework |

### 2.2 What I kept seeing

- Most day-to-day work is patterned: tables, CRUD endpoints, form screens.
- AI coding tools can already read a requirement, generate code, and run commands. The hard part is steering them.
- The missing piece is not another tool. It is a standard prompt and a workflow that turns tool capability into something you can ship.
- The usual failure mode in AI-generated full-stack apps is a broken contract. When frontend and backend are generated separately, field names and types diverge.

The leverage is in making “use the AI well” into a method, not a mood.

---

## 3. The workflow

### 3.1 Tool roles

| Tool | Role | What it owns here |
| --- | --- | --- |
| Cursor | IDE-level coding agent | Primary environment: generation, refactors, multi-file edits |
| OpenCode | Terminal agent | Headless work: run commands, scripts, and bulk edits |
| Hermes CLI | Lightweight assistant | Fast Q&A, PRD analysis, prompt drafts |

Use each for what it is good at. Cursor writes. OpenCode runs. Hermes thinks.

### 3.2 Six steps, from PRD to a running app

```
1 Structure the PRD     2 Design prompts      3 Generate code       4 Bring it up
   (Hermes)                (you + Hermes)        (Cursor)              (OpenCode)
+--------------+        +--------------+      +--------------+      +--------------+
| Paste the    | -----> | Break into   | ---> | Generate one | ---> | Migrate,     |
| PRD          |        | a task list  |      | module       |      | install, run |
+--------------+        +--------------+      +--------------+      +--------------+
                                                                         |
                                                                         v
                                                              +--------------+      +--------------+
                                                              | Browser and  | ---> | Iterate until|
                                                              | API checks   |      | it ships     |
                                                              +--------------+      +--------------+
                                                                   5 Verify              6 Deliver
```

| Step | What you do | Tool | Why it saves time |
| --- | --- | --- | --- |
| 1. Structure the PRD | Extract entities, features, and business rules into a task list | Hermes CLI | Do not let the model write code until the shape is clear |
| 2. Design prompts | Turn the task list into per-module instructions with hard constraints | You + Hermes | A good prompt is the method |
| 3. Generate code | One module at a time: data model, then API, then UI | Cursor | Small steps and small commits keep the model from drifting |
| 4. Bring it up | Let the agent create tables, install dependencies, and start both servers | OpenCode | “Make it run” is also the agent’s job |
| 5. Verify | Check in the browser and against the API; describe failures back to the model | Cursor + OpenCode | You accept. You do not implement |
| 6. Iterate to done | Repeat generate → verify → feedback until it is usable | All of them | Each loop is minutes, not a day |

### 3.3 The contract problem, and the fix

When the UI and the API are generated apart, the model has to guess the shape of the interface. That shows up as:

- Field names and types that do not match (`user_name` on the wire, `username` in the client)
- Inconsistent pagination and response envelopes (`code` / `message` / `data`)
- Integration time spent reconciling payloads, then rewriting both sides

**Fix: contract first.**

| Move | How | Effect |
| --- | --- | --- |
| Contract before code | During prompt design, have the model emit an API contract: paths, methods, request and response fields, types, and example payloads. Both sides treat that document as the only source | Frontend and backend speak the same language. The model stops guessing |
| Shared types | After the models and API types exist, the client reuses that type file, or types are generated from the contract | Drift fails at compile time |
| One response convention | Lock the envelope, pagination params, and error codes in the prompt | The model follows the convention. You do not negotiate it during integration |

Anything you can agree up front, agree up front. Do not leave it for the model to invent in the moment.

### 3.4 Prompt habits that hold up

1. **Structure before code.** Always get a task breakdown, a schema, and an API contract, and confirm them, before any implementation.
2. **One module at a time.** Model, then API, then page. A single huge generation blows the context and the result.
3. **Constraints, not freedom.** Name the stack, the directory layout, the naming rules, and the response shape. Cut the space where the model improvises.
4. **Let the agent run and check.** If a command can verify it, do not eyeball it. Hand execution to OpenCode or the terminal.
5. **Commit while it still works.** Each usable slice gets a git commit, so a bad generation is a rollback, not a rewrite.

---

## 4. Pick a stack the model can actually use

Most stacks were designed for people. Models trip over them. I changed the frontend and backend choices so Vibe Coding stays accurate and can still reach non-standard UI.

### 4.1 Frontend: packaged component libraries to headless components

Libraries like Ant Design and Element Plus are heavily wrapped. The model has to guess props, behavior, and how to override styles:

| Failure | What it looks like |
| --- | --- |
| Invented API | Props that do not exist, or the wrong behavior, so the page does not run |
| Style black box | Internals are closed. Custom styling means override hacks the model cannot reason about |
| Low ceiling | Non-standard interaction cannot be composed, so the model ships a compromise |

Switch to headless components (shadcn/ui, Radix, TanStack headless):

| | Packaged libraries (Ant Design, Element Plus) | Headless (shadcn/ui and similar) |
| --- | --- | --- |
| Where the code lives | Buried in `node_modules`, a black box | In the repo, fully visible |
| How the model understands it | From training-data memory of the API | From the source and the types in front of it |
| Customization | Whatever props were exposed | Logic and style are separate, so you can reshape both |
| Error rate | Hallucinated props, wrong behavior | Grounded in the real source; it tends to compile |
| Ceiling | You get what the library already supports | Compose freely, including non-standard interaction |

What changes in practice:

- Flexibility goes up. The component source is yours to change. You are not stuck at the library’s boundary.
- Quality goes up. Generation is based on real source, so first-pass success is much higher.
- Fewer wasted loops. Less generate → error → rewrite the prompt → generate again. The same feature lands in fewer turns.

### 4.2 Backend: contract and types first

| Change | Practice | Why |
| --- | --- | --- |
| One model source | Schema or ORM models are the source of truth; API types are derived from them | Schema and payload fields stop drifting |
| Shared API types | Client and server share the type definitions, or the client types are generated from the contract | Mismatches show up at compile time |
| Conventions up front | Envelope, pagination, and error codes are fixed in the prompt | Less room for the model to invent a second style |

If it can be specified, specify it. Do not leave it as a guess. The first question about a stack is no longer “am I fluent in it?” It is “can the model use it without inventing APIs?”

---

## 5. What it changed in practice

### 5.1 Before and after

| | By hand | This workflow | Effect |
| --- | --- | --- | --- |
| A simple CRUD admin | 2–3 days | 30–60 minutes | Order of magnitude |
| Schema and API design | Half a day | About 5 minutes | Order of magnitude |
| Frontend / API integration | Half a day to a day of field-matching | Contract first; almost no rework | Mostly gone |
| Environment and startup | About 2 hours | The agent runs it | Almost no manual setup |
| Your job | Write the code | Accept it and make the calls | — |

### 5.2 From demo to real projects

- This is not a demo-only trick. I have used it repeatedly on real product work.
- Patterned code goes to the model. I stay on business rules and acceptance.
- The output is readable, editable, and maintainable. It can live in a long-lived codebase.
- What stuck: prompt templates, an API contract convention, and a short stack checklist. Easy to reuse, easy to hand to someone else.

### 5.3 Why it travels

- **No new platform.** Cursor, OpenCode, and Hermes CLI are enough. Nothing custom has to exist first.
- **Not tied to one domain.** The same loop works on frontend and backend work.
- **It becomes a personal standard.** Contract first, headless UI, and a fixed workflow beat one-off prompting.

---

## 6. Takeaway

The point of “PRD in, stack out” is to turn Vibe Coding from a lucky session into a method you can run again:

1. **Method.** Cursor, OpenCode, and Hermes, plus a six-step loop and a prompt discipline, so a PRD comes out as a running stack.
2. **Engineering.** Contract first, so separately generated frontend and backend stop disagreeing.
3. **Stack.** Choose tools the model can read. Headless components remove the guesswork of packaged UI libraries and raise the ceiling on what you can build.

For me this is personal practice, already exercised on real projects: the model produces the patterned work, and I keep judgment and acceptance.
