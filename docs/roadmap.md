# Your AI Engineer / AI-Native Engineer Roadmap

*A sample 18-month roadmap for a senior engineer (15 years of cloud, DevOps, SRE and platform experience) transitioning into AI engineering. Fork the repo and adapt it.*

## First: AI writing your code is not a weakness

You have not manually written much code during the past year because AI agents generate it. That does **not** prevent you from becoming an AI Engineer.

The future is not simply “no-code.” It is closer to:

> **Less manual implementation, more engineering judgment, orchestration, verification and system ownership.**

An AI-native engineer does not need to type every function manually. But you must be able to:

* Understand the generated architecture and execution flow
* Read and critically review important code
* Identify unsafe assumptions
* Debug failures when the agent becomes stuck
* Design tests and AI evaluations
* Protect tools, data and infrastructure
* Decide where deterministic software is better than an LLM
* Explain what happens from user input to model inference to tool execution
* Remain accountable for everything deployed

Your objective is therefore not to become a traditional developer who avoids AI.

Your objective is:

> **Become a senior AI engineer who uses agents for implementation while personally owning architecture, context, evaluation, security, reliability and production operations.**

---

# Realistic outcome

With your existing 15 years of cloud, DevOps, SRE, platform and production-engineering experience:

* **12 months:** credible and interview-ready for Senior AI Platform, Applied AI and AI Infrastructure roles
* **18 months:** capable of leading production AI engineering initiatives
* **1–2 years of production experience:** genuinely expert-level AI engineering depth

No course can make someone an expert by itself. Expertise comes from repeatedly building, operating, breaking, evaluating and improving real AI systems.

## Recommended commitment

Because your day job and your own company continue in parallel:

```text
6–8 hours per week
12-month core roadmap
6-month advanced roadmap
```

Weekly allocation:

```text
2 hours — structured learning
3 hours — practical implementation
1 hour — code review and debugging without agent assistance
1 hour — documentation, architecture and career evidence
Optional 1 hour — revision or certification preparation
```

The one hour without agents is not about typing code for the sake of it. It preserves your ability to reason independently and prepares you for technical interviews.

---

# The 12-month core roadmap

## Months 1–2: Python, ML and mathematical foundations

### Learn

* Python typing, async programming, Pydantic and FastAPI
* NumPy and pandas fundamentals
* Training, validation and test datasets
* Regression and classification
* Gradient descent
* Overfitting and regularisation
* Precision, recall, F1 and confusion matrices
* Feature engineering
* Neural-network fundamentals

### Primary courses

1. **Machine Learning Specialization — DeepLearning.AI and Stanford Online**
2. **PyTorch: Learn the Basics — official PyTorch tutorials**
3. **3Blue1Brown Neural Networks playlist** for mathematical intuition

The Machine Learning Specialization covers foundational ML algorithms and their implementation. PyTorch’s official beginner path covers datasets, models, automatic differentiation, optimisation and saving trained models. ([DeepLearning.AI][1])

### Build

Create a **Support-Ticket Classification Service**:

```text
Input:
Customer support-ticket text

Output:
Category
Priority
Confidence
Suggested routing team
```

Implement:

* A traditional ML baseline
* An LLM-based classifier
* A comparison of both
* A labelled evaluation dataset
* Precision, recall and F1 measurements
* FastAPI endpoint
* Docker packaging
* Model and dataset versioning
* Basic monitoring

### Exit criteria

You should be able to explain:

* Why a model performed well or poorly
* Difference between training and inference
* Why accuracy alone can be misleading
* Overfitting and data leakage
* When traditional ML is better than an LLM

### Certification

**AWS Certified AI Practitioner — optional**

This certification validates foundational AI, ML and generative-AI concepts, including AWS services, responsible AI, security, RAG and agent concepts. Given your experience, treat it as a quick vocabulary checkpoint rather than a major credential. ([Amazon Web Services, Inc.][2])

Take it only when:

```text
your employer pays for it
OR
You want an early confidence-building certification
OR
You can prepare without delaying the actual roadmap
```

Otherwise, skip it.

---

## Months 3–4: Understand LLMs under the hood

### Learn

* Tokens and tokenisation
* Embeddings
* Neural-network weights
* Transformer architecture
* Self-attention
* Positional information
* Pre-training
* Instruction tuning
* Fine-tuning
* RLHF and preference optimisation
* Inference
* Sampling and temperature
* Context windows
* Quantisation
* LoRA and parameter-efficient fine-tuning

### Primary courses

1. **Generative AI with Large Language Models — DeepLearning.AI**
2. **Transformers in Practice — DeepLearning.AI**
3. **How Transformer LLMs Work — DeepLearning.AI**
4. **Neural Networks: Zero to Hero — Andrej Karpathy**, selectively

The Generative AI with LLMs course covers pre-training, instruction tuning, fine-tuning, evaluation and the generative-AI project lifecycle. Transformers in Practice is explicitly designed for engineers who already use LLMs but want to understand what happens underneath. Karpathy’s material builds neural networks, tokenisers and GPT-style models from first principles. ([DeepLearning.AI][3])

### Build

Create an **LLM Foundations repository** containing:

```text
A tokenizer experiment
Embedding similarity examples
A small neural network
A basic training loop
An attention implementation
A tiny GPT-style model
Inference and sampling experiments
A LoRA fine-tuning experiment
```

AI agents may generate scaffolding, but you must explain every major part yourself.

### Exit criteria

You should be able to explain:

```text
How text becomes tokens
How tokens become embeddings
What attention calculates
How next-token prediction works
What training changes inside a model
Why hallucinations occur
What temperature changes
RAG vs fine-tuning
LoRA vs full fine-tuning
Quantisation vs model distillation
```

You do not need to train a frontier model or master CUDA at this stage.

---

## Months 5–6: Applied LLM engineering and RAG

### Learn

* Structured outputs
* Function and tool calling
* Prompt and context engineering
* Embeddings and vector search
* Chunking strategies
* Metadata filtering
* Hybrid search
* Query transformation
* Reranking
* Context construction
* Source attribution
* Retrieval evaluation
* Answer faithfulness
* Tenant-aware retrieval
* Prompt-injection defence

### Primary course

**Retrieval Augmented Generation — DeepLearning.AI**

The course covers the complete RAG lifecycle, including retrieval architecture, vector databases, prompt strategies, monitoring and evaluation of production-oriented RAG systems. ([DeepLearning.AI][4])

### Build

Create a **Product Knowledge Assistant** using sanitised documentation.

Architecture:

```text
Document ingestion
      ↓
Parsing and chunking
      ↓
Embedding generation
      ↓
PostgreSQL + pgvector
      ↓
Hybrid retrieval
      ↓
Reranking
      ↓
Context construction
      ↓
LLM response with citations
```

Production requirements:

* Tenant-level data isolation
* Document and chunk versioning
* Access-control filtering before retrieval
* Source citations
* Refusal when evidence is insufficient
* At least 75 evaluation questions
* Retrieval-quality measurement
* Hallucination testing
* Prompt-injection testing
* Token, cost and latency tracking

Amazon Bedrock Knowledge Bases similarly treats RAG as retrieving proprietary information to improve relevance and accuracy, which makes this project directly applicable to your later AWS work. ([AWS Documentation][5])

### Exit criteria

You must be able to answer:

* Why a particular chunk size was selected
* Why vector search alone may be insufficient
* How retrieval is evaluated separately from generation
* How tenant data leakage is prevented
* Why adding more context can make an answer worse
* When RAG is inappropriate

---

## Months 7–8: Agents, tools, MCP and workflows

### Learn

* Agent loop
* Tool definitions
* Structured tool input and output
* Planning and task decomposition
* Reflection
* State management
* Short-term and long-term memory
* Human approval
* Deterministic workflow versus autonomous agent
* Multi-agent systems
* MCP
* Agent identity and tool permissions
* Sandboxed execution

### Primary courses

1. **Agentic AI — DeepLearning.AI**
2. **Hugging Face AI Agents Course**
3. **AI Agents in LangGraph — optional**
4. Anthropic’s official **Tool Use and MCP documentation**

Agentic AI covers multi-step workflows, reflection, tool use and evaluation. The Hugging Face course covers agent design, libraries and benchmarking, culminating in an evaluated agent. MCP provides a standard way for AI applications to connect to tools, databases and workflows. ([DeepLearning.AI][6])

### Build

Create a **Deployment Investigator**.

It should be able to:

```text
Read deployment receipts
Inspect ECS events
Inspect task definitions
Query logs
Compare deployed versions
Read recent Git changes
Retrieve relevant runbooks
Correlate related evidence
Produce a root-cause hypothesis
Suggest remediation
```

Safety model:

```text
Read-only by default
No direct shell access initially
Every statement linked to evidence
All destructive tools disabled
Human approval required for changes
Complete audit trail
Tool-level permissions
Timeout and iteration limits
```

### Exit criteria

You must be able to explain:

* Why the workflow requires an agent
* Which parts are deterministic
* How the model chooses a tool
* How incorrect tool parameters are handled
* How infinite loops are prevented
* How permissions are enforced outside the prompt
* Why human approval is required

---

## Months 9–10: Evaluation, security and AI observability

This is where you differentiate yourself from engineers who only create impressive demos.

### Learn

* Golden datasets
* Rule-based evaluations
* Model-graded evaluations
* Human evaluation
* Retrieval evaluation
* Tool-selection accuracy
* Task-completion rate
* Agent trajectory analysis
* Latency measurement
* Cost per successful task
* Prompt and model versioning
* Regression detection
* Red teaming
* Prompt injection
* Data exfiltration
* Excessive agency
* Tool abuse
* Model and provider fallback

### Primary course

**Automated Testing for LLMOps — DeepLearning.AI**

The course teaches rule-based and model-graded evaluations and integrating AI evaluations into CI pipelines on every change. ([DeepLearning.AI][7])

### Add to your projects

```text
Evaluation datasets in Git
Evaluation runs for every pull request
Prompt version attached to every response
Model and parameter version attached to every response
Retrieval and tool traces
Latency and cost dashboards
Failure taxonomy
Prompt-injection test suite
PII and secret-leakage tests
Release quality thresholds
Manual approval for high-risk changes
```

Anthropic’s security guidance recommends layered protection against jailbreaks and prompt injection, including screening, hardened instructions and safe treatment of untrusted tool content. ([Claude Platform Docs][8])

### Exit criteria

You should never evaluate an AI feature with:

```text
“It looked good when I tried it.”
```

You should be able to produce:

```text
Success rate
Failure categories
Retrieval quality
Hallucination rate
Tool-call accuracy
P50/P95 latency
Cost per request
Cost per successful task
Security test results
Regression comparison
```

---

## Months 11–12: Production AI on AWS

### Learn

* Amazon Bedrock
* Bedrock Knowledge Bases
* Bedrock Guardrails
* Bedrock Agents and AgentCore
* SageMaker AI fundamentals
* Model gateways
* Inference endpoints
* Secrets and workload identity
* Private networking
* Cost controls
* Multi-model routing
* Caching
* Observability
* Deployment and rollback
* AI-specific incident management

Bedrock is AWS’s managed platform for building and scaling generative-AI applications, while Bedrock Agents coordinates models, data sources, APIs and user interactions. AgentCore includes runtime, identity, gateway and deterministic policy controls around tool access. ([AWS Documentation][9])

### Capstone

Deploy either the Knowledge Assistant or the Deployment Investigator on AWS with:

```text
Terraform/Terragrunt
Amazon Bedrock
Private networking where appropriate
IAM least privilege
Secrets Manager or SSM
Structured traces
Evaluation gate before deployment
Model and prompt registry
Cost budgets and alerts
Rate limiting
Audit records
Human approval
Staging and production separation
Rollback strategy
Operational runbook
```

### Certification

**AWS Certified Machine Learning Engineer – Associate**

This certification validates implementing and operationalising ML workloads in production. The official target profile expects hands-on SageMaker and ML engineering experience, so prepare only after completing actual ML and AWS projects rather than treating the examination as theoretical study. ([Amazon Web Services, Inc.][10])

Recommended timing:

```text
Month 10–12
```

Do it only after you can build, deploy and monitor an ML workload independently.

---

# Months 13–18: Advanced expertise

## Advanced model engineering

Learn:

* Open-source models
* Hugging Face Transformers
* vLLM or equivalent inference serving
* GPU memory fundamentals
* Batching
* KV caching
* Quantisation
* LoRA and QLoRA
* Fine-tuning dataset preparation
* Model evaluation
* Distillation
* Multimodal models
* Model routing
* Self-hosted versus managed-model trade-offs

Use:

* Hugging Face LLM Course
* Hugging Face Context Course
* PyTorch advanced tutorials
* DeepLearning.AI fine-tuning and post-training material

Hugging Face now maintains dedicated courses for LLMs, agents and context engineering, including MCP, skills and plugins. ([Hugging Face][11])

## Advanced capstone

Extend the investigator into an **AI Engineering Control Plane**:

```text
PR analysis
CI failure diagnosis
Security-review agents
Documentation validation
Release-risk assessment
Deployment investigation
Post-deployment verification
Agent evaluation
Model and prompt registry
Cost and latency dashboards
Human approval workflows
Complete provenance and audit trail
```

This becomes the centrepiece of your AI-native engineering profile.

---

# Cloud certification plan

## Recommended path

```text
1. AWS Certified AI Practitioner
   Optional
   Month 2–3

2. AWS Certified Machine Learning Engineer – Associate
   Recommended
   Month 10–12

3. AWS Certified Generative AI Developer – Professional
   Strongly recommended
   Month 13–18
```

The AWS Generative AI Developer – Professional certification focuses on integrating foundation models into applications and production workflows, including Bedrock, RAG, vector databases, security, monitoring and operational deployment. This aligns closely with your experience and desired positioning. ([Amazon Web Services, Inc.][12])

## Optional later certification

**NVIDIA Generative AI LLMs Professional**

Consider this only when you begin working with:

* Self-hosted models
* GPU infrastructure
* Fine-tuning
* Quantisation
* Distributed inference
* NVIDIA’s AI stack

NVIDIA offers both associate and professional Generative AI LLM credentials; the professional level is oriented toward deeper LLM design, training and optimisation. ([NVIDIA][13])

## Certifications to avoid for now

### Google Cloud Generative AI Leader

This is oriented toward business-level generative-AI adoption rather than technical AI engineering. It does not materially improve your engineering positioning. ([Google Cloud][14])

### Google Professional Machine Learning Engineer

It is a credible technical certification, but do it only when a target role specifically uses GCP or Vertex AI. Otherwise, remain focused on AWS. ([Google Cloud][15])

### Microsoft certifications

The previous Azure AI Engineer Associate and AI-102 examination retired on **June 30, 2026**. Microsoft now lists newer AI Apps and Agents Developer, AI Cloud Developer and MLOps Engineer certifications in beta. Do not invest immediately; wait for them to stabilise unless your employer specifically needs Azure expertise. ([Microsoft Learn][16])

Do not collect certifications across every cloud. Your portfolio and production evidence matter more.

---

# Your AI-native development operating model

AI agents may continue writing most of the implementation. But every change should pass this ownership process:

```text
1. I define the problem and expected outcome.

2. I define architecture, constraints and boundaries.

3. I provide the agent with relevant context.

4. The agent proposes a plan.

5. I challenge the plan before implementation.

6. The agent implements small, reviewable changes.

7. I review the important execution paths and assumptions.

8. Automated checks run:
   - Build
   - Type checking
   - Linting
   - Unit tests
   - Integration tests
   - Security checks
   - AI evaluations

9. The system is validated in a realistic environment.

10. I inspect logs, traces, behaviour, latency and cost.

11. High-risk actions require human approval.

12. I—not the agent—own the production result.
```

## Never blindly trust an agent because

An agent can produce code that is:

* Syntactically correct but architecturally wrong
* Well tested against the wrong requirement
* Secure-looking but vulnerable at a trust boundary
* Efficient for a demo but expensive in production
* Locally correct but incompatible with the broader system
* Confidently based on an outdated library or API
* Successful on happy paths but unsafe during failure

Your responsibility is not necessarily to write the alternative manually.

Your responsibility is to **detect that the generated solution is wrong**.

---

# Minimum manual competence

You do not need to return to writing complete applications manually. But once per week, complete one limited no-agent exercise:

```text
Read and explain an unfamiliar Python module
Debug a failing test
Implement one small function
Trace an async request
Write a SQL query
Create a PyTorch training loop
Calculate an evaluation metric
Modify a tool schema
Investigate a production-style failure
Explain an agent trace
```

Use documentation, but avoid asking the coding agent for the answer during that exercise.

The target is:

> I may choose not to write everything manually, but I am not helpless without the agent.

---

# Portfolio evidence required after 12 months

You should have three serious case studies:

## 1. Complaint Intelligence System

Demonstrates:

```text
Traditional ML
LLM comparison
Metrics
Deployment
Monitoring
```

## 2. Product Knowledge Assistant

Demonstrates:

```text
RAG
Tenant isolation
Retrieval evaluation
Citations
Security
Cost and latency
```

## 3. Deployment Investigator

Demonstrates:

```text
Agents
Tool use
MCP
Cloud infrastructure
Observability
Human approval
AI evaluations
Incident investigation
```

Every case study should include:

```text
Problem statement
Architecture
Technology choices
Trade-offs
Threat model
Evaluation dataset
Evaluation results
Cost analysis
Failure cases
Deployment model
Monitoring
Demo video
Engineering design document
Sanitised source code
```

---

# How you should position yourself

After 9–12 months, your profile should become:

> **Senior AI Platform and Applied AI Engineer with 15 years of experience building cloud platforms, reliable production systems and AI-native engineering workflows. I design, evaluate, secure, deploy and operate agentic and LLM-powered applications—not merely prototype them.**

The best target roles are:

```text
Senior AI Platform Engineer
Senior Applied AI Engineer
Senior AI Infrastructure Engineer
Senior MLOps / GenAIOps Engineer
AI Developer Productivity Engineer
Staff Engineer — AI Platforms
AI-Native Engineering Lead
```

Do not position yourself as a beginner because you are new to LLM engineering. You are adding AI depth to an already senior engineering foundation.

---

# The condensed plan

```text
MONTHS 1–2
Machine learning foundations
Python and PyTorch
Complaint classification project
Optional AWS AI Practitioner

MONTHS 3–4
Transformers and LLM internals
Tokenizer, attention and GPT experiments
Understand training, tuning and inference

MONTHS 5–6
RAG and applied LLM engineering
Build Product Knowledge Assistant
Add tenant isolation and evaluations

MONTHS 7–8
Agents, tools and MCP
Build Deployment Investigator
Add human approval and audit trails

MONTHS 9–10
Evaluations, AI safety and observability
CI evaluation gates
Prompt-injection and tool-security testing

MONTHS 11–12
AWS Bedrock and production deployment
Complete AWS ML Engineer Associate
Publish three detailed case studies

MONTHS 13–18
Fine-tuning, open-source models and inference
Build AI Engineering Control Plane
Complete AWS Generative AI Developer Professional
Begin applying for senior AI roles
```

## Final recommendation

Do not stop using AI agents and return to completely manual programming. That would be moving backwards.

Instead, evolve from:

> **Person using AI to generate code**

into:

> **Engineer who designs and controls AI-powered software-development and production systems**

That is the strongest transition available to you because it combines AI with your existing platform engineering, SRE, AWS, DevOps, security, observability and product-ownership experience.

[1]: https://www.deeplearning.ai/courses?utm_source=chatgpt.com "DeepLearning.AI Courses"
[2]: https://aws.amazon.com/certification/certified-ai-practitioner/?utm_source=chatgpt.com "AWS Certified AI Practitioner"
[3]: https://www.deeplearning.ai/courses/generative-ai-with-llms?utm_source=chatgpt.com "Generative AI with Large Language Models"
[4]: https://www.deeplearning.ai/courses/retrieval-augmented-generation?utm_source=chatgpt.com "Retrieval Augmented Generation (RAG)"
[5]: https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html?utm_source=chatgpt.com "Retrieve data and generate AI responses with ..."
[6]: https://www.deeplearning.ai/courses/agentic-ai?utm_source=chatgpt.com "Agentic AI"
[7]: https://www.deeplearning.ai/courses/automated-testing-llmops?utm_source=chatgpt.com "Automated Testing for LLMOps"
[8]: https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks?utm_source=chatgpt.com "Mitigate jailbreaks and prompt injections - Claude Platform Docs"
[9]: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html?utm_source=chatgpt.com "Overview - Amazon Bedrock"
[10]: https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/?utm_source=chatgpt.com "AWS Certified Machine Learning Engineer – Associate"
[11]: https://huggingface.co/learn?utm_source=chatgpt.com "Learn"
[12]: https://aws.amazon.com/certification/certified-generative-ai-developer-professional/?utm_source=chatgpt.com "AWS Certified Generative AI Developer - Professional"
[13]: https://www.nvidia.com/en-gb/learn/certification/generative-ai-llm-professional/?utm_source=chatgpt.com "Generative AI LLMs Certification for Professionals"
[14]: https://cloud.google.com/learn/certification/generative-ai-leader?utm_source=chatgpt.com "Generative AI Leader | Learn"
[15]: https://cloud.google.com/learn/certification/machine-learning-engineer?utm_source=chatgpt.com "Professional ML Engineer Certification | Learn"
[16]: https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/renew/?utm_source=chatgpt.com "Renewal for Microsoft Certified: Azure AI Engineer Associate"

---

# Claude certifications (added 2026-07-15)

Claude certifications should be part of the AI Engineer learning path, but as a supporting credential, not the centrepiece.

## The important distinction

Anthropic offers two types of credentials:

* Course completion certificates from Anthropic Academy/Coursera: useful for structured learning, but relatively weak as hiring credentials.
* Official Pearson VUE certifications: much stronger because they validate role-specific technical skills and provide Credly badges.

As of July 2026, Anthropic lists four official certifications:

* Claude Certified Associate – Foundations
* Claude Certified Developer – Foundations
* Claude Certified Architect – Foundations
* Claude Certified Architect – Professional

## Best fit

Priority order:

1. **Claude Certified Architect – Foundations** — suits ~15 years of infrastructure, DevOps, reliability and architecture experience better than the Associate certification. Focuses on production Claude solutions rather than basic AI usage.
2. **Claude Certified Developer – Foundations** — directly supports the "AI Engineer / AI-native Engineer" positioning and complements the Architect certification.
3. **Architect – Professional** — take later, after building and operating a few genuine AI systems. Do not rush into it purely for the badge.

Skip the Associate certification unless it is required as a prerequisite.

## Recommended preparation path

Complete these official Anthropic courses (all via Anthropic Academy):

1. Claude Platform 101
2. Building with the Claude API
3. Introduction to Model Context Protocol
4. MCP Advanced Topics
5. Claude Code in Action
6. Introduction to Agent Skills
7. Introduction to Subagents

The API course is particularly valuable because it covers tool calling, evaluations, RAG, embeddings, MCP, structured outputs and agentic workflows—not merely prompting.

## Career value assessment

* Learning value: 8/10
* LinkedIn/CV credential value: 6.5/10 today
* Value without projects: 4/10
* Value combined with production projects: 8/10

Still a relatively new certification, so it will not carry the same broad recognition as AWS certifications immediately. However, some current AI engineering and architecture positions have already started mentioning Claude certification explicitly, particularly consulting, platform engineering and Claude implementation roles.

## The main limitation

The official certification programme is currently available through organisations enrolled in the Claude Partner Network, rather than being fully open to every independent candidate. Training is also provided through the Partner Academy. Membership is free for organisations bringing Claude solutions to market — your company may eventually qualify by building Claude-powered products, integrations or implementation services.

## Structure the evidence

```text
AI fundamentals → Claude/API/MCP learning → production project → certification → technical write-up
```

Strongest portfolio combination:

```text
Claude Certified Architect + an AI capability inside your product + an independently documented agentic system
```

The project should demonstrate tool calling, MCP, retrieval, evaluations, observability, guardrails, latency/cost measurement and production deployment.
