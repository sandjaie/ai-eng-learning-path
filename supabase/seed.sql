-- Seed the tracker from docs/roadmap.md. Idempotent: refuses to run twice.
-- PREREQUISITE: sign in to the app once with you@example.com first.
do $$
declare
  uid uuid;
  p uuid;
  s uuid;
begin
  -- Replace with the email you set as ALLOWED_EMAIL before running.
  select id into uid from auth.users where email = 'you@example.com';
  if uid is null then
    raise exception 'Sign in once with you@example.com before seeding';
  end if;
  if exists (select 1 from public.phases where user_id = uid) then
    raise notice 'Phases already exist — skipping seed';
    return;
  end if;

  -- ===== Phase 0: Months 1–2 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 1–2: Python, ML & mathematical foundations',
          'Machine learning foundations, Python and PyTorch, complaint classification project',
          0, '2026-08-01', '2026-09-30')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Python typing, async programming, Pydantic and FastAPI', 0),
    (uid, s, 'NumPy and pandas fundamentals', 1),
    (uid, s, 'Training, validation and test datasets', 2),
    (uid, s, 'Regression and classification', 3),
    (uid, s, 'Gradient descent', 4),
    (uid, s, 'Overfitting and regularisation', 5),
    (uid, s, 'Precision, recall, F1 and confusion matrices', 6),
    (uid, s, 'Feature engineering', 7),
    (uid, s, 'Neural-network fundamentals', 8);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Courses', 1) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Machine Learning Specialization — DeepLearning.AI & Stanford',
     'https://www.deeplearning.ai/courses/machine-learning-specialization/', 'DeepLearning.AI', 0),
    (uid, s, 'PyTorch: Learn the Basics — official tutorials',
     'https://pytorch.org/tutorials/beginner/basics/intro.html', 'PyTorch', 1),
    (uid, s, '3Blue1Brown Neural Networks playlist',
     'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', 'YouTube', 2);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Project: Support-Ticket Classification Service', 0),
    (uid, s, 'A traditional ML baseline', 1),
    (uid, s, 'An LLM-based classifier', 2),
    (uid, s, 'A comparison of both', 3),
    (uid, s, 'A labelled evaluation dataset', 4),
    (uid, s, 'Precision, recall and F1 measurements', 5),
    (uid, s, 'FastAPI endpoint', 6),
    (uid, s, 'Docker packaging', 7),
    (uid, s, 'Model and dataset versioning', 8),
    (uid, s, 'Basic monitoring', 9);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Exit criteria', 3) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Why a model performed well or poorly', 0),
    (uid, s, 'Difference between training and inference', 1),
    (uid, s, 'Why accuracy alone can be misleading', 2),
    (uid, s, 'Overfitting and data leakage', 3),
    (uid, s, 'When traditional ML is better than an LLM', 4);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Certification', 4) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'AWS Certified AI Practitioner (optional)',
     'https://aws.amazon.com/certification/certified-ai-practitioner/', 'AWS', 0);

  -- ===== Phase 1: Months 3–4 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 3–4: LLMs under the hood',
          'Transformers and LLM internals, tokenizer, attention and GPT experiments, understand training, tuning and inference',
          1, '2026-10-01', '2026-11-30')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Tokens and tokenisation', 0),
    (uid, s, 'Embeddings', 1),
    (uid, s, 'Neural-network weights', 2),
    (uid, s, 'Transformer architecture', 3),
    (uid, s, 'Self-attention', 4),
    (uid, s, 'Positional information', 5),
    (uid, s, 'Pre-training', 6),
    (uid, s, 'Instruction tuning', 7),
    (uid, s, 'Fine-tuning', 8),
    (uid, s, 'RLHF and preference optimisation', 9),
    (uid, s, 'Inference', 10),
    (uid, s, 'Sampling and temperature', 11),
    (uid, s, 'Context windows', 12),
    (uid, s, 'Quantisation', 13),
    (uid, s, 'LoRA and parameter-efficient fine-tuning', 14);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Courses', 1) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Generative AI with Large Language Models — DeepLearning.AI',
     'https://www.deeplearning.ai/courses/generative-ai-with-llms/', 'DeepLearning.AI', 0),
    (uid, s, 'Transformers in Practice — DeepLearning.AI', NULL, NULL, 1),
    (uid, s, 'How Transformer LLMs Work — DeepLearning.AI', NULL, NULL, 2),
    (uid, s, 'Neural Networks: Zero to Hero — Andrej Karpathy (selectively)',
     'https://karpathy.ai/zero-to-hero.html', 'Andrej Karpathy', 3);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Project: LLM Foundations repository', 0),
    (uid, s, 'A tokenizer experiment', 1),
    (uid, s, 'Embedding similarity examples', 2),
    (uid, s, 'A small neural network', 3),
    (uid, s, 'A basic training loop', 4),
    (uid, s, 'An attention implementation', 5),
    (uid, s, 'A tiny GPT-style model', 6),
    (uid, s, 'Inference and sampling experiments', 7),
    (uid, s, 'A LoRA fine-tuning experiment', 8);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Exit criteria', 3) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'How text becomes tokens', 0),
    (uid, s, 'How tokens become embeddings', 1),
    (uid, s, 'What attention calculates', 2),
    (uid, s, 'How next-token prediction works', 3),
    (uid, s, 'What training changes inside a model', 4),
    (uid, s, 'Why hallucinations occur', 5),
    (uid, s, 'What temperature changes', 6),
    (uid, s, 'RAG vs fine-tuning', 7),
    (uid, s, 'LoRA vs full fine-tuning', 8),
    (uid, s, 'Quantisation vs model distillation', 9);

  -- ===== Phase 2: Months 5–6 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 5–6: Applied LLM engineering & RAG',
          'RAG and applied LLM engineering, build Product Knowledge Assistant, add tenant isolation and evaluations',
          2, '2026-12-01', '2027-01-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Structured outputs', 0),
    (uid, s, 'Function and tool calling', 1),
    (uid, s, 'Prompt and context engineering', 2),
    (uid, s, 'Embeddings and vector search', 3),
    (uid, s, 'Chunking strategies', 4),
    (uid, s, 'Metadata filtering', 5),
    (uid, s, 'Hybrid search', 6),
    (uid, s, 'Query transformation', 7),
    (uid, s, 'Reranking', 8),
    (uid, s, 'Context construction', 9),
    (uid, s, 'Source attribution', 10),
    (uid, s, 'Retrieval evaluation', 11),
    (uid, s, 'Answer faithfulness', 12),
    (uid, s, 'Tenant-aware retrieval', 13),
    (uid, s, 'Prompt-injection defence', 14);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Courses', 1) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Retrieval Augmented Generation — DeepLearning.AI',
     'https://www.deeplearning.ai/courses/retrieval-augmented-generation/', 'DeepLearning.AI', 0);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Project: Product Knowledge Assistant', 0),
    (uid, s, 'Tenant-level data isolation', 1),
    (uid, s, 'Document and chunk versioning', 2),
    (uid, s, 'Access-control filtering before retrieval', 3),
    (uid, s, 'Source citations', 4),
    (uid, s, 'Refusal when evidence is insufficient', 5),
    (uid, s, 'At least 75 evaluation questions', 6),
    (uid, s, 'Retrieval-quality measurement', 7),
    (uid, s, 'Hallucination testing', 8),
    (uid, s, 'Prompt-injection testing', 9),
    (uid, s, 'Token, cost and latency tracking', 10);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Exit criteria', 3) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Why a particular chunk size was selected', 0),
    (uid, s, 'Why vector search alone may be insufficient', 1),
    (uid, s, 'How retrieval is evaluated separately from generation', 2),
    (uid, s, 'How tenant data leakage is prevented', 3),
    (uid, s, 'Why adding more context can make an answer worse', 4),
    (uid, s, 'When RAG is inappropriate', 5);

  -- ===== Phase 3: Months 7–8 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 7–8: Agents, tools, MCP & workflows',
          'Agents, tools and MCP, build Deployment Investigator, add human approval and audit trails',
          3, '2027-02-01', '2027-03-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Agent loop', 0),
    (uid, s, 'Tool definitions', 1),
    (uid, s, 'Structured tool input and output', 2),
    (uid, s, 'Planning and task decomposition', 3),
    (uid, s, 'Reflection', 4),
    (uid, s, 'State management', 5),
    (uid, s, 'Short-term and long-term memory', 6),
    (uid, s, 'Human approval', 7),
    (uid, s, 'Deterministic workflow versus autonomous agent', 8),
    (uid, s, 'Multi-agent systems', 9),
    (uid, s, 'MCP', 10),
    (uid, s, 'Agent identity and tool permissions', 11),
    (uid, s, 'Sandboxed execution', 12);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Courses', 1) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Agentic AI — DeepLearning.AI',
     'https://www.deeplearning.ai/courses/agentic-ai/', 'DeepLearning.AI', 0),
    (uid, s, 'Hugging Face AI Agents Course',
     'https://huggingface.co/learn/agents-course', 'Hugging Face', 1),
    (uid, s, 'AI Agents in LangGraph — optional', NULL, NULL, 2),
    (uid, s, 'Anthropic''s official Tool Use and MCP documentation',
     'https://docs.anthropic.com/en/docs/agents-and-tools/mcp', 'Anthropic', 3);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Project: Deployment Investigator', 0),
    (uid, s, 'Read deployment receipts', 1),
    (uid, s, 'Inspect ECS events', 2),
    (uid, s, 'Inspect task definitions', 3),
    (uid, s, 'Query logs', 4),
    (uid, s, 'Compare deployed versions', 5),
    (uid, s, 'Read recent Git changes', 6),
    (uid, s, 'Retrieve relevant runbooks', 7),
    (uid, s, 'Correlate related evidence', 8),
    (uid, s, 'Produce a root-cause hypothesis', 9),
    (uid, s, 'Suggest remediation', 10),
    (uid, s, 'Read-only by default', 11),
    (uid, s, 'No direct shell access initially', 12),
    (uid, s, 'Every statement linked to evidence', 13),
    (uid, s, 'All destructive tools disabled', 14),
    (uid, s, 'Human approval required for changes', 15),
    (uid, s, 'Complete audit trail', 16),
    (uid, s, 'Tool-level permissions', 17),
    (uid, s, 'Timeout and iteration limits', 18);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Exit criteria', 3) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Why the workflow requires an agent', 0),
    (uid, s, 'Which parts are deterministic', 1),
    (uid, s, 'How the model chooses a tool', 2),
    (uid, s, 'How incorrect tool parameters are handled', 3),
    (uid, s, 'How infinite loops are prevented', 4),
    (uid, s, 'How permissions are enforced outside the prompt', 5),
    (uid, s, 'Why human approval is required', 6);

  -- ===== Phase 4: Months 9–10 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 9–10: Evaluation, security & AI observability',
          'Evaluations, AI safety and observability, CI evaluation gates, prompt-injection and tool-security testing',
          4, '2027-04-01', '2027-05-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Golden datasets', 0),
    (uid, s, 'Rule-based evaluations', 1),
    (uid, s, 'Model-graded evaluations', 2),
    (uid, s, 'Human evaluation', 3),
    (uid, s, 'Retrieval evaluation', 4),
    (uid, s, 'Tool-selection accuracy', 5),
    (uid, s, 'Task-completion rate', 6),
    (uid, s, 'Agent trajectory analysis', 7),
    (uid, s, 'Latency measurement', 8),
    (uid, s, 'Cost per successful task', 9),
    (uid, s, 'Prompt and model versioning', 10),
    (uid, s, 'Regression detection', 11),
    (uid, s, 'Red teaming', 12),
    (uid, s, 'Prompt injection', 13),
    (uid, s, 'Data exfiltration', 14),
    (uid, s, 'Excessive agency', 15),
    (uid, s, 'Tool abuse', 16),
    (uid, s, 'Model and provider fallback', 17);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Courses', 1) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Automated Testing for LLMOps — DeepLearning.AI',
     'https://www.deeplearning.ai/short-courses/automated-testing-llmops/', 'DeepLearning.AI', 0);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Evaluation datasets in Git', 0),
    (uid, s, 'Evaluation runs for every pull request', 1),
    (uid, s, 'Prompt version attached to every response', 2),
    (uid, s, 'Model and parameter version attached to every response', 3),
    (uid, s, 'Retrieval and tool traces', 4),
    (uid, s, 'Latency and cost dashboards', 5),
    (uid, s, 'Failure taxonomy', 6),
    (uid, s, 'Prompt-injection test suite', 7),
    (uid, s, 'PII and secret-leakage tests', 8),
    (uid, s, 'Release quality thresholds', 9),
    (uid, s, 'Manual approval for high-risk changes', 10);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Exit criteria', 3) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Never evaluate an AI feature based on "it looked good when I tried it"', 0),
    (uid, s, 'Success rate', 1),
    (uid, s, 'Failure categories', 2),
    (uid, s, 'Retrieval quality', 3),
    (uid, s, 'Hallucination rate', 4),
    (uid, s, 'Tool-call accuracy', 5),
    (uid, s, 'P50/P95 latency', 6),
    (uid, s, 'Cost per request', 7),
    (uid, s, 'Cost per successful task', 8),
    (uid, s, 'Security test results', 9),
    (uid, s, 'Regression comparison', 10);

  -- ===== Phase 5: Months 11–12 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 11–12: Production AI on AWS',
          'AWS Bedrock and production deployment, publish three detailed case studies',
          5, '2027-06-01', '2027-07-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Amazon Bedrock', 0),
    (uid, s, 'Bedrock Knowledge Bases', 1),
    (uid, s, 'Bedrock Guardrails', 2),
    (uid, s, 'Bedrock Agents and AgentCore', 3),
    (uid, s, 'SageMaker AI fundamentals', 4),
    (uid, s, 'Model gateways', 5),
    (uid, s, 'Inference endpoints', 6),
    (uid, s, 'Secrets and workload identity', 7),
    (uid, s, 'Private networking', 8),
    (uid, s, 'Cost controls', 9),
    (uid, s, 'Multi-model routing', 10),
    (uid, s, 'Caching', 11),
    (uid, s, 'Observability', 12),
    (uid, s, 'Deployment and rollback', 13),
    (uid, s, 'AI-specific incident management', 14);

  -- No "Primary courses" list in the roadmap for this phase — Courses section omitted.
  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Project: Deploy Knowledge Assistant or Deployment Investigator on AWS', 0),
    (uid, s, 'Terraform/Terragrunt', 1),
    (uid, s, 'Amazon Bedrock', 2),
    (uid, s, 'Private networking where appropriate', 3),
    (uid, s, 'IAM least privilege', 4),
    (uid, s, 'Secrets Manager or SSM', 5),
    (uid, s, 'Structured traces', 6),
    (uid, s, 'Evaluation gate before deployment', 7),
    (uid, s, 'Model and prompt registry', 8),
    (uid, s, 'Cost budgets and alerts', 9),
    (uid, s, 'Rate limiting', 10),
    (uid, s, 'Audit records', 11),
    (uid, s, 'Human approval', 12),
    (uid, s, 'Staging and production separation', 13),
    (uid, s, 'Rollback strategy', 14),
    (uid, s, 'Operational runbook', 15);

  -- No "Exit criteria" heading in the roadmap for this phase — section omitted.
  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Certification', 4) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'AWS Certified Machine Learning Engineer – Associate',
     'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/', 'AWS', 0);

  -- ===== Phase 6: Months 13–18 =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Months 13–18: Advanced expertise',
          'Fine-tuning, open-source models and inference, build AI Engineering Control Plane, begin applying for senior AI roles',
          6, '2027-08-01', '2028-01-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Learn', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Open-source models', 0),
    (uid, s, 'Hugging Face Transformers', 1),
    (uid, s, 'vLLM or equivalent inference serving', 2),
    (uid, s, 'GPU memory fundamentals', 3),
    (uid, s, 'Batching', 4),
    (uid, s, 'KV caching', 5),
    (uid, s, 'Quantisation', 6),
    (uid, s, 'LoRA and QLoRA', 7),
    (uid, s, 'Fine-tuning dataset preparation', 8),
    (uid, s, 'Model evaluation', 9),
    (uid, s, 'Distillation', 10),
    (uid, s, 'Multimodal models', 11),
    (uid, s, 'Model routing', 12),
    (uid, s, 'Self-hosted versus managed-model trade-offs', 13);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Courses', 1) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Hugging Face LLM Course',
     'https://huggingface.co/learn/llm-course', 'Hugging Face', 0),
    (uid, s, 'Hugging Face Context Course', NULL, NULL, 1),
    (uid, s, 'PyTorch advanced tutorials', NULL, NULL, 2),
    (uid, s, 'DeepLearning.AI fine-tuning and post-training material', NULL, NULL, 3);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Build', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Project: AI Engineering Control Plane (extend the investigator)', 0),
    (uid, s, 'PR analysis', 1),
    (uid, s, 'CI failure diagnosis', 2),
    (uid, s, 'Security-review agents', 3),
    (uid, s, 'Documentation validation', 4),
    (uid, s, 'Release-risk assessment', 5),
    (uid, s, 'Deployment investigation', 6),
    (uid, s, 'Post-deployment verification', 7),
    (uid, s, 'Agent evaluation', 8),
    (uid, s, 'Model and prompt registry', 9),
    (uid, s, 'Cost and latency dashboards', 10),
    (uid, s, 'Human approval workflows', 11),
    (uid, s, 'Complete provenance and audit trail', 12);

  -- No "Exit criteria" heading in the roadmap for this phase — section omitted.
  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Certification', 4) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'AWS Certified Generative AI Developer – Professional',
     'https://aws.amazon.com/certification/certified-generative-ai-developer-professional/', 'AWS', 0),
    (uid, s, 'NVIDIA Generative AI LLMs Professional (optional, only if self-hosting)',
     'https://www.nvidia.com/en-gb/learn/certification/generative-ai-llm-professional/', 'NVIDIA', 1);

  -- ===== Phase 7: Claude certification track (parallel) =====
  insert into public.phases (user_id, title, description, notes, sort_order, target_start, target_end)
  values (uid, 'Claude certification track (parallel)',
          'Anthropic Academy prep alongside Months 7–8; certs after production projects exist.',
          'Sequence: AI fundamentals → Claude/API/MCP learning → production project → certification → technical write-up. Strongest combo: Claude Certified Architect + AI capability inside your product + independently documented agentic system.',
          7, '2027-02-01', '2028-01-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Prep courses (Anthropic Academy)', 0) returning id into s;
  insert into public.items (user_id, section_id, title, url, provider, sort_order) values
    (uid, s, 'Claude Platform 101', 'https://www.anthropic.com/learn', 'Anthropic', 0),
    (uid, s, 'Building with the Claude API', 'https://www.anthropic.com/learn', 'Anthropic', 1),
    (uid, s, 'Introduction to Model Context Protocol', 'https://www.anthropic.com/learn', 'Anthropic', 2),
    (uid, s, 'MCP Advanced Topics', 'https://www.anthropic.com/learn', 'Anthropic', 3),
    (uid, s, 'Claude Code in Action', 'https://www.anthropic.com/learn', 'Anthropic', 4),
    (uid, s, 'Introduction to Agent Skills', 'https://www.anthropic.com/learn', 'Anthropic', 5),
    (uid, s, 'Introduction to Subagents', 'https://www.anthropic.com/learn', 'Anthropic', 6);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Certifications', 1) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Claude Certified Architect – Foundations (~Months 9–12)', 0),
    (uid, s, 'Claude Certified Developer – Foundations (~Months 9–12)', 1),
    (uid, s, 'Claude Certified Architect – Professional (Months 13–18, only after operating real AI systems)', 2);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Prerequisites', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Investigate Claude Partner Network access for your company (certs currently route through partner organisations; membership free)', 0),
    (uid, s, 'Confirm whether Associate cert is required as a prerequisite (else skip)', 1);

  -- ===== Phase 8: Portfolio & positioning =====
  insert into public.phases (user_id, title, description, sort_order, target_start, target_end)
  values (uid, 'Portfolio & positioning',
          'Three case studies plus positioning, per the roadmap''s portfolio-evidence requirements.',
          8, '2027-06-01', '2028-01-31')
  returning id into p;

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Case study: Complaint Intelligence System', 0) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Traditional ML baseline', 0),
    (uid, s, 'LLM comparison', 1),
    (uid, s, 'Metrics', 2),
    (uid, s, 'Deployment', 3),
    (uid, s, 'Monitoring', 4);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Case study: Product Knowledge Assistant', 1) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'RAG', 0),
    (uid, s, 'Tenant isolation', 1),
    (uid, s, 'Retrieval evaluation', 2),
    (uid, s, 'Citations', 3),
    (uid, s, 'Security', 4),
    (uid, s, 'Cost and latency', 5);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Case study: Deployment Investigator', 2) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Agents', 0),
    (uid, s, 'Tool use', 1),
    (uid, s, 'MCP', 2),
    (uid, s, 'Cloud infrastructure', 3),
    (uid, s, 'Observability', 4),
    (uid, s, 'Human approval', 5),
    (uid, s, 'AI evaluations', 6),
    (uid, s, 'Incident investigation', 7);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Per-case-study checklist (each must include)', 3) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Problem statement', 0),
    (uid, s, 'Architecture', 1),
    (uid, s, 'Technology choices', 2),
    (uid, s, 'Trade-offs', 3),
    (uid, s, 'Threat model', 4),
    (uid, s, 'Evaluation dataset', 5),
    (uid, s, 'Evaluation results', 6),
    (uid, s, 'Cost analysis', 7),
    (uid, s, 'Failure cases', 8),
    (uid, s, 'Deployment model', 9),
    (uid, s, 'Monitoring', 10),
    (uid, s, 'Demo video', 11),
    (uid, s, 'Engineering design document', 12),
    (uid, s, 'Sanitised source code', 13);

  insert into public.sections (user_id, phase_id, title, sort_order)
  values (uid, p, 'Positioning', 4) returning id into s;
  insert into public.items (user_id, section_id, title, sort_order) values
    (uid, s, 'Rewrite LinkedIn/CV headline to the senior AI-platform profile line from the roadmap', 0),
    (uid, s, 'Publish the three case-study write-ups', 1),
    (uid, s, 'Begin applying for senior AI roles (Months 13–18)', 2);

  raise notice 'Seed complete';
end $$;
