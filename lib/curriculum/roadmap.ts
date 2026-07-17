import type {
  CurriculumCriterion,
  CurriculumItem,
  CurriculumPhase,
  CurriculumResource,
  CurriculumRoadmap,
  CurriculumSection,
} from "./types";
import { CURRICULUM_REVISION } from "./types";

function crit(key: string, description: string, required = true): CurriculumCriterion {
  return { source_key: key, description, is_required: required };
}

function topic(
  key: string,
  title: string,
  minutes: number,
  criteria: CurriculumCriterion[],
): CurriculumItem {
  return { source_key: key, title, kind: "topic", estimated_minutes: minutes, criteria };
}

function project(
  key: string,
  title: string,
  minutes: number,
  criteria: CurriculumCriterion[],
): CurriculumItem {
  return {
    source_key: key,
    title,
    kind: "project_task",
    estimated_minutes: minutes,
    criteria,
  };
}

function milestone(
  key: string,
  title: string,
  criteria: CurriculumCriterion[],
): CurriculumItem {
  return {
    source_key: key,
    title,
    kind: "milestone",
    estimated_minutes: null,
    criteria,
  };
}

function section(
  key: string,
  title: string,
  kind: CurriculumSection["kind"],
  items: CurriculumItem[],
): CurriculumSection {
  return { source_key: key, title, kind, items };
}

function res(
  partial: Omit<CurriculumResource, "verified_at" | "item_source_key" | "description"> & {
    description?: string | null;
    item_source_key?: string | null;
  },
): CurriculumResource {
  return {
    verified_at: "2026-07-17",
    item_source_key: partial.item_source_key ?? null,
    description: partial.description ?? null,
    ...partial,
  };
}

const phase1: CurriculumPhase = {
  source_key: "phase.foundations",
  title: "Months 1–2: Applied ML foundations",
  description:
    "Build and explain a production-shaped classification service while developing the ML vocabulary needed for later LLM work.",
  sort_order: 0,
  month_start: 1,
  month_end: 2,
  sections: [
    section("phase.foundations.topics", "Topics", "topics", [
      topic("phase.foundations.topic.diagnostic", "Diagnostic: demonstrated Python and cloud skills", 60, [
        crit("phase.foundations.topic.diagnostic.c1", "Mark skills already demonstrated so they are not repeated"),
      ]),
      topic("phase.foundations.topic.python", "Python typing and async patterns", 45, [
        crit("phase.foundations.topic.python.c1", "Explain type hints and why they improve AI-generated code review"),
        crit("phase.foundations.topic.python.c2", "Refactor a blocking function into an async workflow"),
      ]),
      topic("phase.foundations.topic.ml-basics", "NumPy, pandas, scikit-learn, and PyTorch fundamentals", 120, [
        crit("phase.foundations.topic.ml-basics.c1", "Train a simple model and explain train/validation/test splits"),
      ]),
      topic("phase.foundations.topic.metrics", "Precision, recall, F1, calibration, and thresholds", 60, [
        crit("phase.foundations.topic.metrics.c1", "Explain why accuracy can mislead on imbalanced classes"),
      ]),
      topic("phase.foundations.topic.quality", "Overfitting, leakage, imbalance, and monitoring basics", 60, [
        crit("phase.foundations.topic.quality.c1", "Identify leakage risks and a basic monitoring signal"),
      ]),
    ]),
    section("phase.foundations.projects", "Projects", "projects", [
      project("phase.foundations.project.classifier", "Support-Ticket Classification Service", 600, [
        crit("phase.foundations.project.classifier.c1", "Compare traditional ML and LLM classifiers and justify a production choice"),
        crit("phase.foundations.project.classifier.c2", "Identify at least three concrete failure categories from the evaluation set"),
        crit("phase.foundations.project.classifier.c3", "Attach evaluation report, architecture note, and runnable project link"),
      ]),
    ]),
    section("phase.foundations.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.foundations.outcome.explain", "Explain training versus inference without notes", [
        crit("phase.foundations.outcome.explain.c1", "Explain training versus inference, leakage, overfitting, and misleading accuracy"),
      ]),
      milestone("phase.foundations.cert.ai-practitioner", "Optional: AWS Certified AI Practitioner", [
        crit("phase.foundations.cert.ai-practitioner.c1", "Complete the optional certification if pursuing an early vocabulary checkpoint", false),
      ]),
    ]),
    section("phase.foundations.career", "Career evidence", "custom", [
      milestone("phase.foundations.career.structure", "Define target roles and portfolio structure", [
        crit("phase.foundations.career.structure.c1", "Record target role families and create the portfolio repository structure"),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.foundations.res.ml-crash",
      title: "Google Machine Learning Crash Course",
      url: "https://developers.google.com/machine-learning/crash-course/",
      provider: "Google",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 900,
      description: "Primary structured learning for ML foundations",
    }),
    res({
      source_key: "phase.foundations.res.pytorch",
      title: "PyTorch: Learn the Basics",
      url: "https://pytorch.org/tutorials/beginner/basics/intro.html",
      provider: "PyTorch",
      resource_type: "documentation",
      priority: "primary",
      estimated_minutes: 180,
      item_source_key: "phase.foundations.topic.ml-basics",
    }),
    res({
      source_key: "phase.foundations.res.ml-spec",
      title: "Machine Learning Specialization",
      url: "https://www.deeplearning.ai/courses/machine-learning-specialization/",
      provider: "DeepLearning.AI",
      resource_type: "course",
      priority: "selective",
      estimated_minutes: 2400,
      description: "Use selected lessons to close gaps; full completion is not required",
    }),
    res({
      source_key: "phase.foundations.res.rules-of-ml",
      title: "Google Rules of ML",
      url: "https://developers.google.com/machine-learning/guides/rules-of-ml/",
      provider: "Google",
      resource_type: "article",
      priority: "selective",
      estimated_minutes: 90,
    }),
    res({
      source_key: "phase.foundations.res.fastai",
      title: "Practical Deep Learning for Coders",
      url: "https://course.fast.ai/",
      provider: "fast.ai",
      resource_type: "course",
      priority: "optional",
      estimated_minutes: 2400,
    }),
  ],
};

const phase2: CurriculumPhase = {
  source_key: "phase.llms",
  title: "Months 3–4: LLMs under the hood",
  description:
    "Explain how a decoder-style language model turns input text into generated tokens and understand principal training and inference trade-offs.",
  sort_order: 1,
  month_start: 3,
  month_end: 4,
  sections: [
    section("phase.llms.topics", "Topics", "topics", [
      topic("phase.llms.topic.tokenization", "Tokenization and embeddings", 60, [
        crit("phase.llms.topic.tokenization.c1", "Explain tokenization and embedding similarity with a concrete example"),
      ]),
      topic("phase.llms.topic.transformers", "Attention, transformers, and positional information", 90, [
        crit("phase.llms.topic.transformers.c1", "Describe attention and a transformer block without notes"),
      ]),
      topic("phase.llms.topic.training", "Pre-training, instruction tuning, and preference optimization", 60, [
        crit("phase.llms.topic.training.c1", "Compare pre-training, instruction tuning, and preference optimization"),
      ]),
      topic("phase.llms.topic.sampling", "Sampling, temperature, top-p, and structured generation", 45, [
        crit("phase.llms.topic.sampling.c1", "Compare sampling settings and when structured generation is needed"),
      ]),
      topic("phase.llms.topic.inference", "Context, hallucination, quantization, KV cache, and LoRA", 90, [
        crit("phase.llms.topic.inference.c1", "Explain one hallucination mechanism and one inference efficiency technique"),
      ]),
    ]),
    section("phase.llms.projects", "Projects", "projects", [
      project("phase.llms.project.foundations-repo", "LLM Foundations repository", 480, [
        crit("phase.llms.project.foundations-repo.c1", "Implement tokenizer, embedding, attention, and tiny GPT-style experiments"),
        crit("phase.llms.project.foundations-repo.c2", "Run one LoRA experiment and record observations"),
        crit("phase.llms.project.foundations-repo.c3", "Attach a technical explanation suitable for portfolio evidence"),
      ]),
    ]),
    section("phase.llms.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.llms.outcome.explain", "Explain next-token prediction end to end", [
        crit("phase.llms.outcome.explain.c1", "Walk through input tokens to generated tokens without relying on generated notes"),
      ]),
    ]),
    section("phase.llms.career", "Career evidence", "custom", [
      milestone("phase.llms.career.explanation", "Publish LLM Foundations technical explanation", [
        crit("phase.llms.career.explanation.c1", "Publish or attach the LLM Foundations technical explanation"),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.llms.res.genai-llm",
      title: "Generative AI with Large Language Models",
      url: "https://www.deeplearning.ai/courses/generative-ai-with-llms",
      provider: "DeepLearning.AI",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 960,
    }),
    res({
      source_key: "phase.llms.res.transformers-practice",
      title: "Transformers in Practice",
      url: "https://www.deeplearning.ai/courses/transformers-in-practice",
      provider: "DeepLearning.AI",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 480,
    }),
    res({
      source_key: "phase.llms.res.how-transformers",
      title: "How Transformer LLMs Work",
      url: "https://www.deeplearning.ai/courses/how-transformer-llms-work",
      provider: "DeepLearning.AI",
      resource_type: "course",
      priority: "selective",
      estimated_minutes: 240,
    }),
    res({
      source_key: "phase.llms.res.hf-llm",
      title: "Hugging Face LLM Course",
      url: "https://huggingface.co/learn/llm-course/en/chapter1/1",
      provider: "Hugging Face",
      resource_type: "course",
      priority: "selective",
      estimated_minutes: 600,
    }),
  ],
};

const phase3: CurriculumPhase = {
  source_key: "phase.rag",
  title: "Months 5–6: Applied LLM engineering and RAG",
  description:
    "Build an evidence-grounded, tenant-safe knowledge assistant and demonstrate portable production LLM integration.",
  sort_order: 2,
  month_start: 5,
  month_end: 6,
  sections: [
    section("phase.rag.topics", "Topics", "topics", [
      topic("phase.rag.topic.prompts", "Prompt and context engineering", 45, [
        crit("phase.rag.topic.prompts.c1", "Design a prompt and context package for a grounded answer"),
      ]),
      topic("phase.rag.topic.tools", "Structured outputs and tool calling", 60, [
        crit("phase.rag.topic.tools.c1", "Implement structured output validation and one tool call"),
      ]),
      topic("phase.rag.topic.retrieval", "Embeddings, hybrid search, chunking, and reranking", 90, [
        crit("phase.rag.topic.retrieval.c1", "Justify chunking, retrieval, and reranking choices"),
      ]),
      topic("phase.rag.topic.safety", "Citations, refusal, tenancy, and prompt-injection defense", 60, [
        crit("phase.rag.topic.safety.c1", "Demonstrate refusal and access control before retrieval"),
      ]),
      topic("phase.rag.topic.portability", "Provider abstraction and model migration", 60, [
        crit("phase.rag.topic.portability.c1", "Compare OpenAI and Anthropic on quality, latency, cost, and schema adherence"),
      ]),
    ]),
    section("phase.rag.projects", "Projects", "projects", [
      project("phase.rag.project.knowledge-assistant", "Product Knowledge Assistant", 720, [
        crit("phase.rag.project.knowledge-assistant.c1", "Evaluate retrieval separately from answer generation"),
        crit("phase.rag.project.knowledge-assistant.c2", "Demonstrate tenant isolation and a prompt-injection defense"),
        crit("phase.rag.project.knowledge-assistant.c3", "Ship evaluation set of at least 75 questions with measured results"),
      ]),
    ]),
    section("phase.rag.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.rag.outcome.case-study", "Publish Knowledge Assistant case study", [
        crit("phase.rag.outcome.case-study.c1", "Publish the first complete portfolio case study with architecture, trade-offs, evaluation, threat model, and cost"),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.rag.res.rag-course",
      title: "Retrieval Augmented Generation",
      url: "https://www.deeplearning.ai/courses/retrieval-augmented-generation/",
      provider: "DeepLearning.AI",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 360,
    }),
    res({
      source_key: "phase.rag.res.anthropic",
      title: "Build with Claude",
      url: "https://www.anthropic.com/learn/build-with-claude",
      provider: "Anthropic",
      resource_type: "documentation",
      priority: "selective",
      estimated_minutes: 240,
    }),
    res({
      source_key: "phase.rag.res.openai",
      title: "OpenAI developer quickstart",
      url: "https://developers.openai.com/api/docs/quickstart",
      provider: "OpenAI",
      resource_type: "documentation",
      priority: "selective",
      estimated_minutes: 120,
    }),
  ],
};

const phase4: CurriculumPhase = {
  source_key: "phase.agents",
  title: "Months 7–8: Agents, workflows, tools, and MCP",
  description:
    "Build an evidence-linked, read-only investigation agent whose autonomy is bounded by deterministic controls.",
  sort_order: 3,
  month_start: 7,
  month_end: 8,
  sections: [
    section("phase.agents.topics", "Topics", "topics", [
      topic("phase.agents.topic.loops", "Agent loops, planning, and tool contracts", 60, [
        crit("phase.agents.topic.loops.c1", "Explain which steps are deterministic versus agentic"),
      ]),
      topic("phase.agents.topic.mcp", "MCP hosts, clients, servers, and transport", 60, [
        crit("phase.agents.topic.mcp.c1", "Describe MCP roles and a safe tool boundary"),
      ]),
      topic("phase.agents.topic.controls", "Identity, approvals, timeouts, and auditability", 60, [
        crit("phase.agents.topic.controls.c1", "Place permissions and limits outside the prompt"),
      ]),
      topic("phase.agents.topic.eval", "Agent and tool evaluation", 45, [
        crit("phase.agents.topic.eval.c1", "Measure tool-selection and argument accuracy"),
      ]),
    ]),
    section("phase.agents.projects", "Projects", "projects", [
      project("phase.agents.project.investigator", "Deployment Investigator (read-only)", 720, [
        crit("phase.agents.project.investigator.c1", "Link claims to evidence and disable destructive tools"),
        crit("phase.agents.project.investigator.c2", "Handle invalid parameters, unavailable tools, loops, and permission denial"),
        crit("phase.agents.project.investigator.c3", "Attach agent trace, permission model, failure taxonomy, and evaluation set"),
      ]),
    ]),
    section("phase.agents.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.agents.outcome.case-study", "Publish Deployment Investigator case study", [
        crit("phase.agents.outcome.case-study.c1", "Publish the second portfolio case study"),
      ]),
      milestone("phase.agents.cert.hf-optional", "Optional: Hugging Face course completion certificate", [
        crit("phase.agents.cert.hf-optional.c1", "Record optional course-completion evidence if earned", false),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.agents.res.hf-agents",
      title: "Hugging Face Agents Course",
      url: "https://huggingface.co/learn/agents-course/unit0/introduction",
      provider: "Hugging Face",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 720,
    }),
  ],
};

const phase5: CurriculumPhase = {
  source_key: "phase.eval-security",
  title: "Months 9–10: Evaluation, security, and observability",
  description:
    "Turn earlier projects into measurable, regression-tested, attack-tested, and observable AI systems.",
  sort_order: 4,
  month_start: 9,
  month_end: 10,
  sections: [
    section("phase.eval-security.topics", "Topics", "topics", [
      topic("phase.eval-security.topic.eval", "Golden sets, judges, and regression gates", 90, [
        crit("phase.eval-security.topic.eval.c1", "Calibrate a model-graded evaluator against a small human-labelled set"),
      ]),
      topic("phase.eval-security.topic.cost", "Latency, tokens, and cost per successful task", 45, [
        crit("phase.eval-security.topic.cost.c1", "Report P50/P95 latency and cost for a target workflow"),
      ]),
      topic("phase.eval-security.topic.security", "OWASP LLM and agentic risks", 90, [
        crit("phase.eval-security.topic.security.c1", "Demonstrate a blocked malicious action and safe rollback"),
      ]),
      topic("phase.eval-security.topic.ops", "Traces, failure taxonomy, and incident response", 60, [
        crit("phase.eval-security.topic.ops.c1", "Attach a shared failure taxonomy and incident runbook"),
      ]),
    ]),
    section("phase.eval-security.projects", "Projects", "projects", [
      project("phase.eval-security.project.hardening", "Evaluation and security hardening of portfolio systems", 600, [
        crit("phase.eval-security.project.hardening.c1", "Add versioned datasets, CI evaluation, traces, and release thresholds"),
        crit("phase.eval-security.project.hardening.c2", "Run prompt-injection, PII, secret-leakage, and tool-abuse suites"),
        crit("phase.eval-security.project.hardening.c3", "Complete a pinned-model upgrade with before/after evaluation and rollback"),
      ]),
    ]),
    section("phase.eval-security.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.eval-security.outcome.reports", "Attach CI, red-team, and dashboard evidence", [
        crit("phase.eval-security.outcome.reports.c1", "Produce success rate, failure categories, hallucination, tool accuracy, latency, cost, and security results"),
      ]),
    ]),
    section("phase.eval-security.career", "Career evidence", "custom", [
      milestone("phase.eval-security.career.prep", "System-design practice and evidence pack", [
        crit("phase.eval-security.career.prep.c1", "Prepare evaluation/security evidence and begin system-design practice"),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.eval-security.res.llmops-testing",
      title: "Automated Testing for LLMOps",
      url: "https://www.deeplearning.ai/short-courses/automated-testing-llmops/",
      provider: "DeepLearning.AI",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 120,
    }),
    res({
      source_key: "phase.eval-security.res.owasp-llm",
      title: "OWASP LLM/GenAI Security Project",
      url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
      provider: "OWASP",
      resource_type: "documentation",
      priority: "primary",
      estimated_minutes: 180,
    }),
    res({
      source_key: "phase.eval-security.res.owasp-agentic",
      title: "OWASP Agentic AI Top 10",
      url: "https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security/",
      provider: "OWASP",
      resource_type: "article",
      priority: "primary",
      estimated_minutes: 90,
    }),
    res({
      source_key: "phase.eval-security.res.nist",
      title: "NIST Generative AI Profile",
      url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
      provider: "NIST",
      resource_type: "documentation",
      priority: "selective",
      estimated_minutes: 120,
    }),
  ],
};

const phase6: CurriculumPhase = {
  source_key: "phase.production-aws",
  title: "Months 11–12: Production AI on AWS and job readiness",
  description:
    "Operate one portfolio system in a production-shaped AWS environment and become interview-ready for senior applied AI roles.",
  sort_order: 5,
  month_start: 11,
  month_end: 12,
  sections: [
    section("phase.production-aws.topics", "Topics", "topics", [
      topic("phase.production-aws.topic.bedrock", "Bedrock, gateways, quotas, and cost controls", 90, [
        crit("phase.production-aws.topic.bedrock.c1", "Explain model routing, caching, and budget controls for the deployed system"),
      ]),
      topic("phase.production-aws.topic.identity", "IAM, secrets, networking, and staged release", 90, [
        crit("phase.production-aws.topic.identity.c1", "Describe least-privilege identity and rollback for inference releases"),
      ]),
      topic("phase.production-aws.topic.interview", "AI system design and portfolio demos", 120, [
        crit("phase.production-aws.topic.interview.c1", "Present end-to-end request, retrieval, model, tool, security, trace, and cost flows"),
      ]),
    ]),
    section("phase.production-aws.projects", "Projects", "projects", [
      project("phase.production-aws.project.deploy", "Production deploy of Knowledge Assistant or Deployment Investigator", 720, [
        crit("phase.production-aws.project.deploy.c1", "Deploy with IaC, evaluation gate, traces, budgets, staging, and runbook"),
        crit("phase.production-aws.project.deploy.c2", "Demonstrate deploy and rollback without undocumented manual steps"),
        crit("phase.production-aws.project.deploy.c3", "Run an incident exercise with failure handling evidence"),
      ]),
    ]),
    section("phase.production-aws.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.production-aws.outcome.case-studies", "Present three case studies with operational evidence", [
        crit("phase.production-aws.outcome.case-studies.c1", "Present three case studies with architecture, trade-offs, threat models, evaluation, and ops evidence"),
      ]),
      milestone("phase.production-aws.cert.mle-associate", "Recommended: AWS Certified Machine Learning Engineer – Associate", [
        crit("phase.production-aws.cert.mle-associate.c1", "Complete after the deployment if pursuing the recommended certification", false),
      ]),
      milestone("phase.production-aws.cert.agentic-demo", "Optional: AWS Agentic AI Demonstrated", [
        crit("phase.production-aws.cert.agentic-demo.c1", "Complete the optional hands-on microcredential if useful", false),
      ]),
    ]),
    section("phase.production-aws.career", "Career evidence", "custom", [
      milestone("phase.production-aws.career.portfolio", "Portfolio index, role narrative, and applications", [
        crit("phase.production-aws.career.portfolio.c1", "Prepare portfolio index, one-page role narrative, and focused résumé"),
        crit("phase.production-aws.career.portfolio.c2", "Begin focused applications and interviews during this phase"),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.production-aws.res.aws-certs",
      title: "AWS certification exam guides",
      url: "https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html",
      provider: "AWS",
      resource_type: "documentation",
      priority: "primary",
      estimated_minutes: 180,
    }),
  ],
};

const phase7: CurriculumPhase = {
  source_key: "phase.oss-models",
  title: "Months 13–15: Open-source model engineering",
  description:
    "Serve, adapt, and benchmark an open-source model and make an evidence-based managed-versus-self-hosted decision.",
  sort_order: 6,
  month_start: 13,
  month_end: 15,
  sections: [
    section("phase.oss-models.topics", "Topics", "topics", [
      topic("phase.oss-models.topic.hf", "Hugging Face workflows and model licences", 60, [
        crit("phase.oss-models.topic.hf.c1", "Select a model with licence and deployment constraints documented"),
      ]),
      topic("phase.oss-models.topic.serving", "vLLM serving, quantization, and batching", 90, [
        crit("phase.oss-models.topic.serving.c1", "Serve a small open-source model behind an OpenAI-compatible endpoint"),
      ]),
      topic("phase.oss-models.topic.ft", "LoRA/QLoRA fine-tuning and evaluation", 90, [
        crit("phase.oss-models.topic.ft.c1", "Fine-tune one appropriately sized model and evaluate on a versioned task set"),
      ]),
    ]),
    section("phase.oss-models.projects", "Projects", "projects", [
      project("phase.oss-models.project.benchmark", "Managed versus self-hosted benchmark and ADR", 600, [
        crit("phase.oss-models.project.benchmark.c1", "Compare base, tuned, and managed provider on quality, throughput, latency, memory, and cost"),
        crit("phase.oss-models.project.benchmark.c2", "Write a managed-versus-self-hosted architecture decision record"),
      ]),
    ]),
    section("phase.oss-models.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.oss-models.outcome.decision", "Evidence-based hosting decision", [
        crit("phase.oss-models.outcome.decision.c1", "Defend the hosting decision with measured results"),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.oss-models.res.hf-llm",
      title: "Hugging Face LLM Course",
      url: "https://huggingface.co/learn/llm-course/en/chapter1/1",
      provider: "Hugging Face",
      resource_type: "course",
      priority: "primary",
      estimated_minutes: 480,
    }),
    res({
      source_key: "phase.oss-models.res.vllm",
      title: "vLLM OpenAI-compatible serving",
      url: "https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/",
      provider: "vLLM",
      resource_type: "documentation",
      priority: "primary",
      estimated_minutes: 120,
    }),
  ],
};

const phase8: CurriculumPhase = {
  source_key: "phase.capstone",
  title: "Months 16–18: Advanced capstone and transition",
  description:
    "Integrate the strongest earlier work into an AI Engineering Control Plane and complete the transition into a senior AI engineering role.",
  sort_order: 7,
  month_start: 16,
  month_end: 18,
  sections: [
    section("phase.capstone.topics", "Topics", "topics", [
      topic("phase.capstone.topic.control-plane", "Control-plane capabilities and policy boundaries", 90, [
        crit("phase.capstone.topic.control-plane.c1", "Explain identity, policy, evaluation, approval, and audit boundaries"),
      ]),
    ]),
    section("phase.capstone.projects", "Projects", "projects", [
      project("phase.capstone.project.control-plane", "AI Engineering Control Plane capstone", 900, [
        crit("phase.capstone.project.control-plane.c1", "Demonstrate a realistic failure and recovery scenario"),
        crit("phase.capstone.project.control-plane.c2", "Show measured quality, reliability, latency, cost, and security results"),
      ]),
    ]),
    section("phase.capstone.outcomes", "Exit outcomes", "outcomes", [
      milestone("phase.capstone.outcome.transition", "Complete targeted applications and demos", [
        crit("phase.capstone.outcome.transition.c1", "Complete targeted applications, portfolio demos, and system-design interviews throughout the phase"),
      ]),
      milestone("phase.capstone.cert.genai-pro", "Recommended: AWS Certified Generative AI Developer – Professional", [
        crit("phase.capstone.cert.genai-pro.c1", "Complete after production and advanced work if pursuing the recommended exam", false),
      ]),
      milestone("phase.capstone.cert.claude-architect", "Conditional: Claude Certified Architect, Foundations", [
        crit("phase.capstone.cert.claude-architect.c1", "Pursue only when partner access is available", false),
      ]),
    ]),
  ],
  resources: [
    res({
      source_key: "phase.capstone.res.aws-certs",
      title: "AWS certification exam guides",
      url: "https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html",
      provider: "AWS",
      resource_type: "documentation",
      priority: "selective",
      estimated_minutes: 180,
    }),
  ],
};

export const curriculumRoadmap: CurriculumRoadmap = {
  revision: CURRICULUM_REVISION,
  path_title: "AI Engineer Path",
  path_goal:
    "Become interview-ready for senior applied AI, AI platform, and AI infrastructure roles with measured portfolio evidence.",
  weekly_goal_min_minutes: 360,
  weekly_goal_max_minutes: 480,
  phases: [phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8],
};
