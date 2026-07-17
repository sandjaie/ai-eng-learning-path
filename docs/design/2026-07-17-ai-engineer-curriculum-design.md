# AI Engineer curriculum and roadmap enrichment

**Date:** 2026-07-17
**Status:** Approved curriculum direction; ready for implementation planning
**Companion specification:**
[Study Command Center redesign](./2026-07-17-study-command-center-design.md)

## Summary

The existing roadmap already covers the important domains for a senior cloud,
platform, DevOps, or SRE engineer moving into AI engineering. Its weakness is
not missing volume. It is that 296 checklist items, several complete courses,
parallel certification phases, and optional material are presented with nearly
equal weight.

The enriched curriculum turns that material into an achievable learning
program:

- a required 12-month core for interview readiness;
- an optional 6-month advanced specialization;
- one sequential phase at a time;
- resources classified as primary, selective, or optional;
- achievement based on explanations, evaluated systems, and evidence;
- certifications embedded at the point where practical experience supports
  them;
- portfolio and career-transition milestones distributed through the path;
- a safe content upgrade that preserves existing progress and personal edits.

The objective is not course completion. It is credible evidence that the
learner can design, build, evaluate, secure, operate, and explain production AI
systems.

## Learner and time assumptions

The default roadmap is designed for an experienced production engineer who is
newer to formal ML and applied AI engineering.

```text
6–8 hours per week
12-month required core
6-month advanced specialization
```

That provides approximately 312–416 hours in the first year. The curriculum
therefore cannot require every useful course. Each phase must protect time for
building, evaluation, reflection, and career evidence.

The default weekly allocation is:

```text
2 hours — structured learning
3 hours — practical implementation
1 hour — evaluation, testing, or security work
1 hour — explanation, notes, and career evidence
Optional 1 hour — certification preparation or catch-up
```

## Considered approaches

### Core plus electives — selected

The first 12 months contain the minimum coherent path to job readiness. Months
13–18 add open-source model serving, fine-tuning, GPU awareness, multimodal work,
and a larger control-plane capstone. Resources are labelled by priority.

This approach fits a working engineer's available time, produces portfolio
evidence early, and prevents useful but non-essential content from blocking
progress.

### Certification-led

Organizing the path around examination objectives would provide simple external
milestones. It was rejected because it encourages breadth without sufficient
system-building, evaluation, debugging, and operational evidence.

### Comprehensive course library

Keeping every course as an equivalent roadmap item would maximize choice. It
was rejected because the learner would spend too much time consuming content
and would have no reliable answer to what should be studied next.

## Curriculum rules

### One sequential path

The default roadmap contains eight ordered phases:

1. six two-month core phases;
2. two three-month advanced phases.

The current `Claude certification track (parallel)` and `Portfolio &
positioning` phases are removed from the default path. Their useful content is
relocated into the appropriate sequential phases as resources, optional
certification milestones, and career-evidence tasks.

The app may show a career-evidence lane inside a phase, but it must not create a
second active phase or compete with `Study next`.

### Resource priority

Every curated resource has one of three priorities:

- **Primary:** the default resource the learner should use for the topic or
  phase. The path must remain achievable if only primary resources are used.
- **Selective:** specific chapters, lessons, or references used to close a
  defined gap. The learner is not expected to finish the entire resource.
- **Optional:** enrichment, certification preparation, or specialization that
  can be skipped without blocking phase completion.

Resource completion is tracked separately from learning achievement. Watching
a course never completes a topic by itself.

### Evidence before completion

Every core topic or project task must have at least one observable achievement
criterion. Strong criteria use verbs such as explain, compare, implement,
measure, diagnose, defend, or operate.

Weak criteria such as `watch the video` or `read the article` may track resource
usage but cannot be the only requirement for a topic.

Every phase produces at least one durable artifact:

- evaluated code or a working system;
- an evaluation or experiment report;
- an architecture or threat-model document;
- a short explanation recorded in the tracker;
- a portfolio case-study increment.

### Build and evaluate before certification

Certifications are optional unless explicitly marked recommended. A
certification milestone cannot become `Study next` while required build work in
the same phase remains incomplete.

### Provider portability

The core path must not teach a single model provider as the architecture. At
least one structured-output and tool-calling capability is implemented with two
providers and compared for:

- output quality;
- latency;
- token and request cost;
- schema adherence;
- tool-call behaviour;
- rate-limit and error behaviour;
- migration effort.

Provider-specific documentation remains valuable, but project boundaries use
provider-neutral interfaces where the abstraction is honest and preserve
provider-specific capabilities where it is not.

## Eight-week phase rhythm

Each two-month core phase follows the same default sequence:

1. **Diagnose:** check current knowledge and skip material already demonstrated.
2. **Learn:** use the primary resource for the minimum required theory.
3. **Experiment:** complete small, isolated exercises.
4. **Build:** implement the phase's project capability.
5. **Evaluate:** measure quality, reliability, cost, and security.
6. **Capture:** attach notes, results, links, and other evidence.
7. **Explain:** demonstrate the exit criteria without depending on generated
   notes.
8. **Review:** close gaps and explicitly activate the next phase.

The advanced three-month phases use the same rhythm with additional time for
benchmarking and capstone integration.

## Phase 1 — Months 1–2: Applied ML foundations

### Outcome

Build and explain a production-shaped classification service while developing
the ML vocabulary needed for later LLM work.

### Core topics

- Python typing and async patterns needed by the project;
- NumPy, pandas, scikit-learn, and PyTorch fundamentals;
- training, validation, and test splits;
- regression and classification;
- loss, gradient descent, and neural-network fundamentals;
- overfitting, regularization, leakage, and class imbalance;
- precision, recall, F1, confusion matrices, calibration, and thresholds;
- feature engineering and baselines;
- dataset, experiment, and model versioning;
- pipeline tests, training-serving skew, and basic monitoring.

The phase begins with a diagnostic. Demonstrated Python or cloud knowledge can
be marked achieved instead of repeated.

### Resources

- **Primary:**
  [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course/)
  and
  [PyTorch: Learn the Basics](https://pytorch.org/tutorials/beginner/basics/intro.html).
- **Selective:**
  [Machine Learning Specialization](https://www.deeplearning.ai/courses/machine-learning-specialization/),
  3Blue1Brown's neural-network series, and
  [Google's Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml/).
- **Optional:** fast.ai Practical Deep Learning for learners who want a larger
  hands-on deep-learning course.

The Machine Learning Specialization is selective rather than mandatory because
the full specialization plus the project does not fit the phase's default
structured-learning budget.

### Build

Create a Support-Ticket Classification Service with:

- a traditional ML baseline;
- an LLM-based classifier;
- a labelled and versioned evaluation dataset;
- category, priority, confidence, and routing outputs;
- precision, recall, F1, confusion matrix, and error analysis;
- an HTTP API and container;
- model and dataset version metadata;
- basic latency, error, and drift-oriented monitoring.

### Required evidence and exit criteria

- Compare the traditional and LLM approaches and justify a production choice.
- Identify at least three concrete failure categories from the evaluation set.
- Explain training versus inference, leakage, overfitting, and why accuracy can
  mislead.
- Reproduce or repair one important evaluation step without agent assistance.
- Attach the evaluation report, architecture note, and runnable project link.

### Certification

AWS Certified AI Practitioner is optional. It is an early vocabulary checkpoint,
not a major hiring signal, and must not delay the project.

## Phase 2 — Months 3–4: LLMs under the hood

### Outcome

Explain how a decoder-style language model turns input text into generated
tokens and understand the principal training and inference trade-offs.

### Core topics

- tokenization and embeddings;
- next-token prediction and autoregressive generation;
- attention, transformer blocks, and positional information;
- pre-training, instruction tuning, preference optimization, and fine-tuning;
- sampling, temperature, top-p, and structured generation;
- context windows and hallucination mechanisms;
- GPU inference intuition, quantization, KV caching, and batching;
- LoRA and parameter-efficient fine-tuning.

### Resources

- **Primary:**
  [Generative AI with Large Language Models](https://www.deeplearning.ai/courses/generative-ai-with-llms)
  and
  [Transformers in Practice](https://www.deeplearning.ai/courses/transformers-in-practice).
- **Selective:**
  [How Transformer LLMs Work](https://www.deeplearning.ai/courses/how-transformer-llms-work),
  Andrej Karpathy's Neural Networks: Zero to Hero, and relevant chapters from
  the Hugging Face LLM Course.
- **Optional:** deeper paper reading and full from-scratch implementations.

### Build

Create an LLM Foundations repository containing:

- a tokenizer experiment;
- embedding similarity examples;
- a small neural network and training loop;
- an attention implementation;
- a tiny GPT-style generation experiment;
- sampling comparisons;
- one LoRA experiment.

### Required evidence and exit criteria

- Explain the complete text → tokens → embeddings → transformer → logits →
  sampled token flow without notes.
- Compare RAG with fine-tuning, LoRA with full fine-tuning, and quantization with
  distillation.
- Diagnose at least one poor generation by inspecting inputs, sampling settings,
  or model limitations.
- Attach runnable experiments and a short technical explanation.

## Phase 3 — Months 5–6: Applied LLM engineering and RAG

### Outcome

Build an evidence-grounded, tenant-safe knowledge assistant and demonstrate
portable production LLM integration.

### Core topics

- prompt and context engineering;
- structured outputs and schema validation;
- function and tool calling;
- embeddings, vector search, hybrid search, and metadata filters;
- parsing, chunking, query transformation, and reranking;
- retrieval versus generation evaluation;
- citations, refusal, and insufficient-evidence handling;
- tenant-aware retrieval and access control before retrieval;
- prompt-injection defense;
- streaming, feedback, retry, and failure-aware product UX;
- provider abstraction and model migration.

### Resources

- **Primary:**
  [Retrieval Augmented Generation](https://www.deeplearning.ai/courses/retrieval-augmented-generation/)
  and the official documentation for the selected providers.
- **Selective:**
  [Anthropic Build with Claude](https://www.anthropic.com/learn/build-with-claude),
  the
  [OpenAI developer quickstart](https://developers.openai.com/api/docs/quickstart),
  and selected Full Stack LLM Bootcamp material on language interfaces and
  augmented language models.
- **Optional:** provider or vector-database framework courses that do not add a
  new production capability.

### Build

Create a Product Knowledge Assistant with:

- ingestion, parsing, chunking, and document versioning;
- PostgreSQL and pgvector or an equivalent justified store;
- hybrid retrieval and reranking;
- access-control filtering before retrieval;
- source citations and evidence-insufficient refusal;
- streaming and recoverable error states;
- at least 75 evaluation questions;
- retrieval, faithfulness, latency, and cost measurements;
- hallucination and prompt-injection tests.

Implement one structured-output and tool-calling workflow with both OpenAI and
Anthropic. Record quality, latency, cost, schema adherence, failure behaviour,
and migration effort.

### Required evidence and exit criteria

- Justify chunk size, retrieval strategy, reranking, and context construction.
- Evaluate retrieval separately from answer generation.
- Demonstrate that tenant data cannot cross the authorization boundary.
- Show a refusal case, a provider-failure case, and a prompt-injection defense.
- Publish the first complete portfolio case study with architecture, trade-offs,
  evaluation results, threat model, and operating costs.

## Phase 4 — Months 7–8: Agents, workflows, tools, and MCP

### Outcome

Build an evidence-linked, read-only investigation agent whose autonomy is
bounded by deterministic controls.

### Core topics

- deterministic workflows versus autonomous agents;
- the agent loop, planning, decomposition, and reflection;
- tool definitions and structured tool input and output;
- state, short-term context, and durable memory;
- MCP hosts, clients, servers, tools, and transport;
- identity, least privilege, and permissions outside prompts;
- human approval and escalation;
- sandboxing, timeouts, iteration limits, and auditability;
- agent and tool evaluation;
- multi-agent systems as an optional pattern, not a default architecture.

### Resources

- **Primary:**
  [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction).
- **Selective:** the Hugging Face Context Course's MCP unit, Anthropic's tool-use
  and MCP material, and selected Agentic AI lessons from DeepLearning.AI.
- **Optional:** framework-specific agent courses after the core agent can be
  explained without the framework.

### Build

Create a Deployment Investigator that can read deployment receipts, ECS events,
task definitions, logs, version history, Git changes, and runbooks; correlate
evidence; and produce a root-cause hypothesis and suggested remediation.

The first complete version is read-only, links claims to evidence, disables
destructive tools, requires approval for changes, records an audit trail, and
enforces permission, timeout, and iteration boundaries outside the prompt.

### Required evidence and exit criteria

- Explain which steps are deterministic and why the remaining steps need an
  agent.
- Measure tool-selection and argument accuracy.
- Demonstrate handling for invalid tool parameters, unavailable tools, loops,
  and permission denial.
- Attach an agent trace, permission model, failure taxonomy, and evaluation set.
- Publish the second portfolio case study.

The Hugging Face course certificate is optional course-completion evidence. It
is not treated as equivalent to a role-based professional certification.

## Phase 5 — Months 9–10: Evaluation, security, and observability

### Outcome

Turn the earlier projects into measurable, regression-tested, attack-tested,
and observable AI systems.

### Core topics

- golden datasets and human evaluation;
- rule-based, model-graded, and pairwise evaluation;
- retrieval, generation, tool, trajectory, and end-to-end metrics;
- judge calibration and evaluation leakage;
- latency, token use, cost per request, and cost per successful task;
- prompt, model, parameter, dataset, and provider versioning;
- release thresholds, regression detection, and rollback;
- traces and failure taxonomies;
- prompt injection, insecure output use, data exfiltration, tool misuse,
  identity abuse, and excessive agency;
- red teaming, secret/PII leakage tests, and incident response;
- provider fallback and model-version upgrade playbooks.

### Resources

- **Primary:**
  [Automated Testing for LLMOps](https://www.deeplearning.ai/short-courses/automated-testing-llmops/),
  the
  [OWASP LLM/GenAI Security Project](https://owasp.org/www-project-top-10-for-large-language-model-applications/),
  and the
  [OWASP Agentic AI Top 10](https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security/).
- **Selective:**
  [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence),
  provider evaluation guidance, and selected Made With ML testing, serving, and
  monitoring modules.
- **Optional:** governance frameworks that do not apply to the target role or
  project risk.

### Build

Add to the existing projects:

- versioned evaluation datasets in Git;
- evaluation runs on relevant pull requests;
- response-level prompt, model, and parameter versions;
- retrieval and tool traces;
- latency and cost dashboards;
- a shared failure taxonomy;
- prompt-injection, PII, secret-leakage, and tool-abuse suites;
- release quality thresholds and high-risk approval gates;
- a pinned-model upgrade exercise with before/after evaluation and rollback.

### Required evidence and exit criteria

- Produce success rate, failure categories, retrieval quality, hallucination
  rate, tool accuracy, P50/P95 latency, cost, and security results.
- Calibrate a model-graded evaluator against a small human-labelled set.
- Demonstrate a blocked malicious action and a safe provider/model rollback.
- Attach a CI evaluation report, red-team report, dashboard, and incident
  runbook.

## Phase 6 — Months 11–12: Production AI on AWS and job readiness

### Outcome

Operate one portfolio system in a production-shaped AWS environment and become
ready to interview for senior applied AI, AI platform, and AI infrastructure
roles.

### Core topics

- Amazon Bedrock models, Knowledge Bases, Guardrails, Agents, and AgentCore;
- when SageMaker AI is appropriate;
- model gateways, routing, caching, quotas, and cost controls;
- workload identity, secrets, IAM, and private networking;
- inference deployment, rollback, and staged release;
- structured traces, budgets, alerts, and AI incident response;
- AI system design, debugging, trade-off communication, and portfolio demos.

### Resources

- **Primary:** official AWS Bedrock and certification documentation plus the
  implementation project.
- **Selective:** AWS Skill Builder material that directly supports the deployed
  architecture or examination gaps.
- **Optional:** broad AWS courses that repeat already demonstrated cloud skills.

### Build

Deploy the Product Knowledge Assistant or Deployment Investigator with:

- infrastructure as code;
- Bedrock and justified supporting services;
- least-privilege IAM and managed secrets;
- appropriate networking boundaries;
- structured traces and audit records;
- an evaluation gate before deployment;
- model and prompt registry information;
- cost budgets, rate limits, staging, rollback, and an operational runbook.

### Career evidence

- Publish the third complete case study.
- Prepare a concise portfolio index and one-page role narrative.
- Practice AI system design, RAG design, agent safety, evaluation design, and
  generated-code debugging.
- Start focused applications and interviews during this phase rather than
  waiting for month 18.

### Required evidence and exit criteria

- Deploy and rollback the system without relying on undocumented manual steps.
- Explain end-to-end request, retrieval, model, tool, security, trace, and cost
  flows.
- Demonstrate release evaluation, failure handling, and an incident exercise.
- Present three case studies with architecture, trade-offs, threat models,
  evaluation results, and operational evidence.

### Certification

- **Recommended after the deployment:** AWS Certified Machine Learning Engineer
  – Associate.
- **Optional hands-on evidence:** AWS Agentic AI Demonstrated microcredential.

## Phase 7 — Months 13–15: Open-source model engineering

### Outcome

Serve, adapt, and benchmark an open-source model and make an evidence-based
managed-versus-self-hosted decision.

### Core topics

- Hugging Face model and dataset workflows;
- model licences and deployment constraints;
- GPU memory, batching, KV caching, and quantization;
- OpenAI-compatible serving with vLLM;
- LoRA, QLoRA, dataset preparation, and fine-tuning evaluation;
- throughput, latency, memory, quality, and total-cost trade-offs;
- multimodal fundamentals when relevant.

### Resources

- **Primary:** selected chapters from the
  [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1)
  and the
  [vLLM serving documentation](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/).
- **Selective:** PyTorch advanced tutorials and current Hugging Face PEFT,
  quantization, and evaluation documentation.
- **Optional:** NVIDIA-specific training when the target role requires its AI
  stack.

### Build and required evidence

- Serve a small open-source model behind an OpenAI-compatible endpoint.
- Fine-tune one appropriately sized model with LoRA or QLoRA.
- Compare the base model, tuned model, and a managed provider on a versioned
  task dataset.
- Record quality, throughput, P50/P95 latency, memory use, and estimated cost.
- Write a managed-versus-self-hosted architecture decision record.

## Phase 8 — Months 16–18: Advanced capstone and transition

### Outcome

Integrate the strongest earlier work into an AI Engineering Control Plane and
complete the transition into a senior AI engineering role or equivalent
production responsibility.

### Build

Extend the Deployment Investigator with justified capabilities such as:

- pull-request analysis;
- CI failure diagnosis;
- security-review agents;
- documentation validation;
- release-risk assessment;
- deployment and post-deployment investigation;
- agent evaluation and regression tracking;
- model and prompt registry views;
- cost and latency dashboards;
- policy enforcement, human approval, provenance, and audit trails.

Multimodal capability is added only when it supports a target role or a real
product need.

### Required evidence and exit criteria

- Demonstrate the capstone through a realistic failure and recovery scenario.
- Show how identity, policy, evaluation, approval, and audit boundaries work.
- Present measured quality, reliability, latency, cost, and security results.
- Complete targeted applications, portfolio demonstrations, and system-design
  interviews throughout the phase.

### Certification

- **Recommended:** AWS Certified Generative AI Developer – Professional after
  the production and advanced work.
- **Conditional:** Claude Certified Architect, Foundations only when partner
  access is available.
- **Optional specialization:** NVIDIA Generative AI LLMs Professional only for a
  self-hosted/GPU-focused target role.

## Certification policy and factual corrections

### AWS

The maintained sequence is:

```text
AWS Certified AI Practitioner — optional early checkpoint
AWS Certified Machine Learning Engineer – Associate — recommended after build
AWS Agentic AI Demonstrated — optional hands-on evidence
AWS Certified Generative AI Developer – Professional — recommended late
```

AWS announced that registration for the standard Generative AI Developer –
Professional examination opened in March 2026. AWS Agentic AI Demonstrated is a
complementary hands-on assessment in a provisioned environment. The retired AWS
Machine Learning – Specialty is not added to the roadmap.

Sources:

- [AWS AI certification portfolio update](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)
- [AWS microcredentials](https://aws.amazon.com/blogs/training-and-certification/microcredentials-from-aws-are-now-free-heres-why-that-matters/)
- [AWS certification exam guides](https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html)

### Anthropic

The existing roadmap's claim that four official Claude certifications are
available is removed. Anthropic's March 2026 announcement verifies one current
technical certification, **Claude Certified Architect, Foundations**, available
through the Claude Partner Network. Anthropic said additional seller, architect,
and developer certifications would be introduced later; those unlaunched names
must not appear as available certifications.

Source:
[Anthropic Claude Partner Network announcement](https://www.anthropic.com/news/claude-partner-network)

Anthropic Academy courses remain useful selective resources independently of
certification access.

### Other providers

- Google Cloud, Azure, GitHub, and NVIDIA credentials are not default milestones.
- Add one only when a target role, employer, or selected specialization requires
  that platform.
- Course-completion certificates may be recorded as evidence but are not
  presented as equal to role-based proctored certifications.
- The roadmap must not encourage collecting credentials across every cloud.

## Career-evidence lane

Career work is embedded inside the sequential phases:

- **Month 1:** define target role families and create the portfolio structure.
- **Month 4:** publish or attach the LLM Foundations technical explanation.
- **Month 6:** publish the Knowledge Assistant case study.
- **Month 8:** publish the Deployment Investigator case study.
- **Month 10:** prepare evaluation/security evidence and begin system-design
  practice.
- **Month 11:** prepare the portfolio index, role narrative, and focused résumé.
- **Month 12:** begin applications and interviews.
- **Months 13–18:** continue applications while adding specialization evidence.

Each complete case study includes:

- problem and constraints;
- architecture and data flow;
- technology choices and trade-offs;
- threat model and authorization boundaries;
- evaluation dataset and results;
- latency and cost information;
- failure analysis and operational runbook;
- demo, repository, or other reviewable evidence.

## Data-model additions to the Study Command specification

The Study Command Center's `resources` table receives these additional fields:

- `priority`: `primary | selective | optional`;
- `estimated_minutes`: nullable positive integer;
- `description`: nullable concise explanation of why and how to use the
  resource;
- `source_key`: nullable stable identifier for curated template content;
- `verified_at`: nullable date recording the latest manual source review.

Curated phases, sections, items, achievement criteria, and resources receive a
nullable `source_key` and nullable `source_revision`. A source key is unique per
user within its table and is never required for user-created content. The
revision records which shipped wording the row was last synchronized with.
Together these fields enable idempotent template upgrades without treating
titles as permanent identifiers.

The `phases` table also receives nullable `archived_at`. Archived phases are
excluded from the phase navigator, recommendation order, schedule status, and
learning-progress denominator. Their time logs remain included in historical
time totals. Archiving is used only to preserve legacy data that no longer
belongs in the sequential path; the normal plan editor can provide a separate
review surface before permanently deleting anything.

No runtime web crawler, automatic link checker, or automatic curriculum
recommendation service is added in this release.

## Safe roadmap-content upgrade

Updating only `supabase/seed.sql` would not change an already populated account.
The implementation must upgrade both new and existing paths without erasing
learning history.

### Canonical content

- Maintain one typed, versioned default-roadmap definition in the application
  source.
- Generate or validate seed content against the same definition so a new
  account and an upgraded account receive equivalent curriculum content.
- Assign stable source keys to curated phases, sections, items, criteria, and
  resources.
- Keep every committed example generic and use `you@example.com` where an email
  example is required.

### Existing path migration

The first upgrade performs a conservative match against exact legacy phase,
section, and item titles from the current seed and assigns source keys only when
the match is unique.

It then:

1. adds missing curated phases, sections, resources, criteria, and items;
2. moves useful Claude-learning, certification, and portfolio items from the
   two legacy parallel phases into the relevant sequential phases;
3. removes duplicate seeded topics such as the repeated `Function and tool
   calling` entry;
4. corrects the unverified Claude certification claims;
5. adds missing direct resource links and removes tracking query parameters;
6. adds phase 6 exit criteria and career-evidence milestones;
7. preserves custom phases, sections, items, resources, and ordering wherever
   they do not conflict with a matched curated row;
8. preserves every status, note, time log, evidence record, achieved criterion,
   activation date, and user-selected target date;
9. archives each legacy parallel phase only after all of its useful children
   have been relocated successfully; it does not delete the phase or its time
   history.

The content upgrade is idempotent. Running it twice creates no duplicates and
does not reset progress.

### Personal edit protection

- Template upgrades never overwrite notes, evidence, status, dates, or resource
  usage status.
- A curated title or description is replaced automatically only when it still
  equals the previous shipped template value.
- When a curated field was personally edited, retain it and offer the new
  template wording as a reviewable update rather than applying it silently.
- User-created content without a source key is never altered by a template
  upgrade.

## Content validation

Automated tests validate the default roadmap as data:

- phase, section, item, criterion, and resource source keys are unique;
- exactly eight sequential phases exist in the default path;
- months and phase ordering are coherent;
- every core topic or project task has an achievement criterion;
- every curated resource uses HTTPS and has a priority;
- primary resources do not exceed the intended phase learning budget;
- resource rows do not count toward learning completion;
- certification items are optional unless this specification marks them
  recommended;
- the removed Claude certification names do not reappear;
- no duplicate curated topic exists within a phase;
- committed example data contains no personal names, emails, or employer
  references.

Migration tests cover:

- a pristine seeded account;
- a partially completed account;
- personally edited curated content;
- additional user-created phases and items;
- completed certification or portfolio items in a legacy parallel phase;
- a second idempotent upgrade run.

## Acceptance criteria

The curriculum work is complete when:

- a new account receives the eight-phase path described here;
- an existing seeded account receives the enrichment without losing progress;
- the dashboard recommends one unambiguous next core topic;
- primary, selective, and optional resources are visibly distinct;
- topics show the resources, criteria, and evidence needed for achievement;
- certifications appear at their correct timing and never block core learning;
- the roadmap contains no unverified Claude certification claims;
- the first 12 months end with three complete case studies and production AWS
  evidence;
- months 13–18 remain an advanced specialization rather than a prerequisite for
  beginning the job transition;
- content and migration validation pass in the full verification suite.

## Authoritative source set

The initial curated source set prioritizes official documentation and course
providers:

- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course/)
- [Google Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml/)
- [PyTorch beginner tutorials](https://pytorch.org/tutorials/beginner/basics/intro.html)
- [DeepLearning.AI course catalog](https://www.deeplearning.ai/courses)
- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1)
- [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction)
- [Anthropic Build with Claude](https://www.anthropic.com/learn/build-with-claude)
- [OpenAI developer documentation](https://developers.openai.com/api/docs/quickstart)
- [OWASP LLM/GenAI Security Project](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [OWASP Agentic AI Top 10](https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security/)
- [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [AWS certification exam guides](https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html)
- [vLLM OpenAI-compatible serving](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/)

Resource availability and certification claims are manually verified when the
curated roadmap is revised. The `verified_at` field communicates freshness; it
does not imply continuous monitoring.
