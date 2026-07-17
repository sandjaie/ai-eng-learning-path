-- Generated from lib/curriculum — do not edit by hand.
-- Included by supabase/seed.sql

  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 1–2: Applied ML foundations', 'Build and explain a production-shaped classification service while developing the ML vocabulary needed for later LLM work.', 0,
    '2026-08-01', '2026-09-30',
    'active', now(),
    'phase.foundations', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 3–4: LLMs under the hood', 'Explain how a decoder-style language model turns input text into generated tokens and understand principal training and inference trade-offs.', 1,
    '2026-10-01', '2026-11-30',
    'planned', null,
    'phase.llms', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 5–6: Applied LLM engineering and RAG', 'Build an evidence-grounded, tenant-safe knowledge assistant and demonstrate portable production LLM integration.', 2,
    '2026-12-01', '2027-01-31',
    'planned', null,
    'phase.rag', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 7–8: Agents, workflows, tools, and MCP', 'Build an evidence-linked, read-only investigation agent whose autonomy is bounded by deterministic controls.', 3,
    '2027-02-01', '2027-03-31',
    'planned', null,
    'phase.agents', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 9–10: Evaluation, security, and observability', 'Turn earlier projects into measurable, regression-tested, attack-tested, and observable AI systems.', 4,
    '2027-04-01', '2027-05-31',
    'planned', null,
    'phase.eval-security', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 11–12: Production AI on AWS and job readiness', 'Operate one portfolio system in a production-shaped AWS environment and become interview-ready for senior applied AI roles.', 5,
    '2027-06-01', '2027-07-31',
    'planned', null,
    'phase.production-aws', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 13–15: Open-source model engineering', 'Serve, adapt, and benchmark an open-source model and make an evidence-based managed-versus-self-hosted decision.', 6,
    '2027-08-01', '2027-10-31',
    'planned', null,
    'phase.oss-models', '2026-07-17.1'
  );
  insert into public.phases (
    user_id, title, description, sort_order, target_start, target_end,
    status, activated_at, source_key, source_revision
  ) values (
    uid, 'Months 16–18: Advanced capstone and transition', 'Integrate the strongest earlier work into an AI Engineering Control Plane and complete the transition into a senior AI engineering role.', 7,
    '2027-11-01', '2028-01-31',
    'planned', null,
    'phase.capstone', '2026-07-17.1'
  );

  insert into public.user_preferences (
    user_id, path_title, path_goal, weekly_goal_min_minutes, weekly_goal_max_minutes
  ) values (
    uid, 'AI Engineer Path', 'Become interview-ready for senior applied AI, AI platform, and AI infrastructure roles with measured portfolio evidence.',
    360, 480
  ) on conflict (user_id) do update set
    path_title = excluded.path_title,
    path_goal = excluded.path_goal,
    weekly_goal_min_minutes = excluded.weekly_goal_min_minutes,
    weekly_goal_max_minutes = excluded.weekly_goal_max_minutes,
    updated_at = now();

  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.foundations.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.foundations.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.foundations.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Career evidence', 3,
    'custom', 'phase.foundations.career', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.llms.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.llms.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.llms.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Career evidence', 3,
    'custom', 'phase.llms.career', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.rag.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.rag';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.rag.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.rag';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.rag.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.rag';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.agents.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.agents';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.agents.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.agents';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.agents.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.agents';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.eval-security.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.eval-security.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.eval-security.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Career evidence', 3,
    'custom', 'phase.eval-security.career', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.production-aws.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.production-aws';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.production-aws.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.production-aws';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.production-aws.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.production-aws';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Career evidence', 3,
    'custom', 'phase.production-aws.career', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.production-aws';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.oss-models.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.oss-models';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.oss-models.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.oss-models';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.oss-models.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.oss-models';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Topics', 0,
    'topics', 'phase.capstone.topics', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.capstone';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Projects', 1,
    'projects', 'phase.capstone.projects', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.capstone';
  insert into public.sections (
    user_id, phase_id, title, sort_order, kind, source_key, source_revision
  ) select uid, p.id, 'Exit outcomes', 2,
    'outcomes', 'phase.capstone.outcomes', '2026-07-17.1'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.capstone';

  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Diagnostic: demonstrated Python and cloud skills', 0,
    'topic', 60,
    'phase.foundations.topic.diagnostic', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Python typing and async patterns', 1,
    'topic', 45,
    'phase.foundations.topic.python', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'NumPy, pandas, scikit-learn, and PyTorch fundamentals', 2,
    'topic', 120,
    'phase.foundations.topic.ml-basics', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Precision, recall, F1, calibration, and thresholds', 3,
    'topic', 60,
    'phase.foundations.topic.metrics', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Overfitting, leakage, imbalance, and monitoring basics', 4,
    'topic', 60,
    'phase.foundations.topic.quality', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Support-Ticket Classification Service', 0,
    'project_task', 600,
    'phase.foundations.project.classifier', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Explain training versus inference without notes', 0,
    'milestone', null,
    'phase.foundations.outcome.explain', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Optional: AWS Certified AI Practitioner', 1,
    'milestone', null,
    'phase.foundations.cert.ai-practitioner', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Define target roles and portfolio structure', 0,
    'milestone', null,
    'phase.foundations.career.structure', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.foundations.career';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Tokenization and embeddings', 0,
    'topic', 60,
    'phase.llms.topic.tokenization', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Attention, transformers, and positional information', 1,
    'topic', 90,
    'phase.llms.topic.transformers', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Pre-training, instruction tuning, and preference optimization', 2,
    'topic', 60,
    'phase.llms.topic.training', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Sampling, temperature, top-p, and structured generation', 3,
    'topic', 45,
    'phase.llms.topic.sampling', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Context, hallucination, quantization, KV cache, and LoRA', 4,
    'topic', 90,
    'phase.llms.topic.inference', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'LLM Foundations repository', 0,
    'project_task', 480,
    'phase.llms.project.foundations-repo', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Explain next-token prediction end to end', 0,
    'milestone', null,
    'phase.llms.outcome.explain', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Publish LLM Foundations technical explanation', 0,
    'milestone', null,
    'phase.llms.career.explanation', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.llms.career';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Prompt and context engineering', 0,
    'topic', 45,
    'phase.rag.topic.prompts', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Structured outputs and tool calling', 1,
    'topic', 60,
    'phase.rag.topic.tools', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Embeddings, hybrid search, chunking, and reranking', 2,
    'topic', 90,
    'phase.rag.topic.retrieval', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Citations, refusal, tenancy, and prompt-injection defense', 3,
    'topic', 60,
    'phase.rag.topic.safety', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Provider abstraction and model migration', 4,
    'topic', 60,
    'phase.rag.topic.portability', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Product Knowledge Assistant', 0,
    'project_task', 720,
    'phase.rag.project.knowledge-assistant', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Publish Knowledge Assistant case study', 0,
    'milestone', null,
    'phase.rag.outcome.case-study', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.rag.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Agent loops, planning, and tool contracts', 0,
    'topic', 60,
    'phase.agents.topic.loops', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'MCP hosts, clients, servers, and transport', 1,
    'topic', 60,
    'phase.agents.topic.mcp', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Identity, approvals, timeouts, and auditability', 2,
    'topic', 60,
    'phase.agents.topic.controls', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Agent and tool evaluation', 3,
    'topic', 45,
    'phase.agents.topic.eval', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Deployment Investigator (read-only)', 0,
    'project_task', 720,
    'phase.agents.project.investigator', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Publish Deployment Investigator case study', 0,
    'milestone', null,
    'phase.agents.outcome.case-study', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Optional: Hugging Face course completion certificate', 1,
    'milestone', null,
    'phase.agents.cert.hf-optional', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.agents.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Golden sets, judges, and regression gates', 0,
    'topic', 90,
    'phase.eval-security.topic.eval', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Latency, tokens, and cost per successful task', 1,
    'topic', 45,
    'phase.eval-security.topic.cost', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'OWASP LLM and agentic risks', 2,
    'topic', 90,
    'phase.eval-security.topic.security', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Traces, failure taxonomy, and incident response', 3,
    'topic', 60,
    'phase.eval-security.topic.ops', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Evaluation and security hardening of portfolio systems', 0,
    'project_task', 600,
    'phase.eval-security.project.hardening', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Attach CI, red-team, and dashboard evidence', 0,
    'milestone', null,
    'phase.eval-security.outcome.reports', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'System-design practice and evidence pack', 0,
    'milestone', null,
    'phase.eval-security.career.prep', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.eval-security.career';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Bedrock, gateways, quotas, and cost controls', 0,
    'topic', 90,
    'phase.production-aws.topic.bedrock', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'IAM, secrets, networking, and staged release', 1,
    'topic', 90,
    'phase.production-aws.topic.identity', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'AI system design and portfolio demos', 2,
    'topic', 120,
    'phase.production-aws.topic.interview', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Production deploy of Knowledge Assistant or Deployment Investigator', 0,
    'project_task', 720,
    'phase.production-aws.project.deploy', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Present three case studies with operational evidence', 0,
    'milestone', null,
    'phase.production-aws.outcome.case-studies', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Recommended: AWS Certified Machine Learning Engineer – Associate', 1,
    'milestone', null,
    'phase.production-aws.cert.mle-associate', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Optional: AWS Agentic AI Demonstrated', 2,
    'milestone', null,
    'phase.production-aws.cert.agentic-demo', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Portfolio index, role narrative, and applications', 0,
    'milestone', null,
    'phase.production-aws.career.portfolio', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.production-aws.career';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Hugging Face workflows and model licences', 0,
    'topic', 60,
    'phase.oss-models.topic.hf', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.oss-models.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'vLLM serving, quantization, and batching', 1,
    'topic', 90,
    'phase.oss-models.topic.serving', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.oss-models.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'LoRA/QLoRA fine-tuning and evaluation', 2,
    'topic', 90,
    'phase.oss-models.topic.ft', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.oss-models.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Managed versus self-hosted benchmark and ADR', 0,
    'project_task', 600,
    'phase.oss-models.project.benchmark', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.oss-models.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Evidence-based hosting decision', 0,
    'milestone', null,
    'phase.oss-models.outcome.decision', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.oss-models.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Control-plane capabilities and policy boundaries', 0,
    'topic', 90,
    'phase.capstone.topic.control-plane', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.capstone.topics';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'AI Engineering Control Plane capstone', 0,
    'project_task', 900,
    'phase.capstone.project.control-plane', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.capstone.projects';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Complete targeted applications and demos', 0,
    'milestone', null,
    'phase.capstone.outcome.transition', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.capstone.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Recommended: AWS Certified Generative AI Developer – Professional', 1,
    'milestone', null,
    'phase.capstone.cert.genai-pro', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.capstone.outcomes';
  insert into public.items (
    user_id, section_id, title, sort_order, kind, estimated_minutes, source_key, source_revision
  ) select uid, s.id, 'Conditional: Claude Certified Architect, Foundations', 2,
    'milestone', null,
    'phase.capstone.cert.claude-architect', '2026-07-17.1'
  from public.sections s
  where s.user_id = uid and s.source_key = 'phase.capstone.outcomes';

  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Mark skills already demonstrated so they are not repeated', true, 0,
    'phase.foundations.topic.diagnostic.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.topic.diagnostic';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain type hints and why they improve AI-generated code review', true, 0,
    'phase.foundations.topic.python.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.topic.python';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Refactor a blocking function into an async workflow', true, 1,
    'phase.foundations.topic.python.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.topic.python';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Train a simple model and explain train/validation/test splits', true, 0,
    'phase.foundations.topic.ml-basics.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.topic.ml-basics';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain why accuracy can mislead on imbalanced classes', true, 0,
    'phase.foundations.topic.metrics.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.topic.metrics';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Identify leakage risks and a basic monitoring signal', true, 0,
    'phase.foundations.topic.quality.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.topic.quality';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Compare traditional ML and LLM classifiers and justify a production choice', true, 0,
    'phase.foundations.project.classifier.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.project.classifier';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Identify at least three concrete failure categories from the evaluation set', true, 1,
    'phase.foundations.project.classifier.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.project.classifier';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Attach evaluation report, architecture note, and runnable project link', true, 2,
    'phase.foundations.project.classifier.c3', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.project.classifier';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain training versus inference, leakage, overfitting, and misleading accuracy', true, 0,
    'phase.foundations.outcome.explain.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.outcome.explain';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Complete the optional certification if pursuing an early vocabulary checkpoint', false, 0,
    'phase.foundations.cert.ai-practitioner.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.cert.ai-practitioner';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Record target role families and create the portfolio repository structure', true, 0,
    'phase.foundations.career.structure.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.foundations.career.structure';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain tokenization and embedding similarity with a concrete example', true, 0,
    'phase.llms.topic.tokenization.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.topic.tokenization';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Describe attention and a transformer block without notes', true, 0,
    'phase.llms.topic.transformers.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.topic.transformers';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Compare pre-training, instruction tuning, and preference optimization', true, 0,
    'phase.llms.topic.training.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.topic.training';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Compare sampling settings and when structured generation is needed', true, 0,
    'phase.llms.topic.sampling.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.topic.sampling';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain one hallucination mechanism and one inference efficiency technique', true, 0,
    'phase.llms.topic.inference.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.topic.inference';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Implement tokenizer, embedding, attention, and tiny GPT-style experiments', true, 0,
    'phase.llms.project.foundations-repo.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.project.foundations-repo';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Run one LoRA experiment and record observations', true, 1,
    'phase.llms.project.foundations-repo.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.project.foundations-repo';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Attach a technical explanation suitable for portfolio evidence', true, 2,
    'phase.llms.project.foundations-repo.c3', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.project.foundations-repo';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Walk through input tokens to generated tokens without relying on generated notes', true, 0,
    'phase.llms.outcome.explain.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.outcome.explain';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Publish or attach the LLM Foundations technical explanation', true, 0,
    'phase.llms.career.explanation.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.llms.career.explanation';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Design a prompt and context package for a grounded answer', true, 0,
    'phase.rag.topic.prompts.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.topic.prompts';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Implement structured output validation and one tool call', true, 0,
    'phase.rag.topic.tools.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.topic.tools';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Justify chunking, retrieval, and reranking choices', true, 0,
    'phase.rag.topic.retrieval.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.topic.retrieval';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Demonstrate refusal and access control before retrieval', true, 0,
    'phase.rag.topic.safety.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.topic.safety';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Compare OpenAI and Anthropic on quality, latency, cost, and schema adherence', true, 0,
    'phase.rag.topic.portability.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.topic.portability';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Evaluate retrieval separately from answer generation', true, 0,
    'phase.rag.project.knowledge-assistant.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.project.knowledge-assistant';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Demonstrate tenant isolation and a prompt-injection defense', true, 1,
    'phase.rag.project.knowledge-assistant.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.project.knowledge-assistant';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Ship evaluation set of at least 75 questions with measured results', true, 2,
    'phase.rag.project.knowledge-assistant.c3', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.project.knowledge-assistant';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Publish the first complete portfolio case study with architecture, trade-offs, evaluation, threat model, and cost', true, 0,
    'phase.rag.outcome.case-study.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.rag.outcome.case-study';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain which steps are deterministic versus agentic', true, 0,
    'phase.agents.topic.loops.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.topic.loops';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Describe MCP roles and a safe tool boundary', true, 0,
    'phase.agents.topic.mcp.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.topic.mcp';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Place permissions and limits outside the prompt', true, 0,
    'phase.agents.topic.controls.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.topic.controls';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Measure tool-selection and argument accuracy', true, 0,
    'phase.agents.topic.eval.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.topic.eval';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Link claims to evidence and disable destructive tools', true, 0,
    'phase.agents.project.investigator.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.project.investigator';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Handle invalid parameters, unavailable tools, loops, and permission denial', true, 1,
    'phase.agents.project.investigator.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.project.investigator';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Attach agent trace, permission model, failure taxonomy, and evaluation set', true, 2,
    'phase.agents.project.investigator.c3', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.project.investigator';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Publish the second portfolio case study', true, 0,
    'phase.agents.outcome.case-study.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.outcome.case-study';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Record optional course-completion evidence if earned', false, 0,
    'phase.agents.cert.hf-optional.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.agents.cert.hf-optional';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Calibrate a model-graded evaluator against a small human-labelled set', true, 0,
    'phase.eval-security.topic.eval.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.topic.eval';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Report P50/P95 latency and cost for a target workflow', true, 0,
    'phase.eval-security.topic.cost.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.topic.cost';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Demonstrate a blocked malicious action and safe rollback', true, 0,
    'phase.eval-security.topic.security.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.topic.security';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Attach a shared failure taxonomy and incident runbook', true, 0,
    'phase.eval-security.topic.ops.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.topic.ops';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Add versioned datasets, CI evaluation, traces, and release thresholds', true, 0,
    'phase.eval-security.project.hardening.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.project.hardening';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Run prompt-injection, PII, secret-leakage, and tool-abuse suites', true, 1,
    'phase.eval-security.project.hardening.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.project.hardening';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Complete a pinned-model upgrade with before/after evaluation and rollback', true, 2,
    'phase.eval-security.project.hardening.c3', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.project.hardening';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Produce success rate, failure categories, hallucination, tool accuracy, latency, cost, and security results', true, 0,
    'phase.eval-security.outcome.reports.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.outcome.reports';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Prepare evaluation/security evidence and begin system-design practice', true, 0,
    'phase.eval-security.career.prep.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.eval-security.career.prep';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain model routing, caching, and budget controls for the deployed system', true, 0,
    'phase.production-aws.topic.bedrock.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.topic.bedrock';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Describe least-privilege identity and rollback for inference releases', true, 0,
    'phase.production-aws.topic.identity.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.topic.identity';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Present end-to-end request, retrieval, model, tool, security, trace, and cost flows', true, 0,
    'phase.production-aws.topic.interview.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.topic.interview';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Deploy with IaC, evaluation gate, traces, budgets, staging, and runbook', true, 0,
    'phase.production-aws.project.deploy.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.project.deploy';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Demonstrate deploy and rollback without undocumented manual steps', true, 1,
    'phase.production-aws.project.deploy.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.project.deploy';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Run an incident exercise with failure handling evidence', true, 2,
    'phase.production-aws.project.deploy.c3', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.project.deploy';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Present three case studies with architecture, trade-offs, threat models, evaluation, and ops evidence', true, 0,
    'phase.production-aws.outcome.case-studies.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.outcome.case-studies';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Complete after the deployment if pursuing the recommended certification', false, 0,
    'phase.production-aws.cert.mle-associate.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.cert.mle-associate';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Complete the optional hands-on microcredential if useful', false, 0,
    'phase.production-aws.cert.agentic-demo.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.cert.agentic-demo';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Prepare portfolio index, one-page role narrative, and focused résumé', true, 0,
    'phase.production-aws.career.portfolio.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.career.portfolio';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Begin focused applications and interviews during this phase', true, 1,
    'phase.production-aws.career.portfolio.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.production-aws.career.portfolio';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Select a model with licence and deployment constraints documented', true, 0,
    'phase.oss-models.topic.hf.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.oss-models.topic.hf';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Serve a small open-source model behind an OpenAI-compatible endpoint', true, 0,
    'phase.oss-models.topic.serving.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.oss-models.topic.serving';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Fine-tune one appropriately sized model and evaluate on a versioned task set', true, 0,
    'phase.oss-models.topic.ft.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.oss-models.topic.ft';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Compare base, tuned, and managed provider on quality, throughput, latency, memory, and cost', true, 0,
    'phase.oss-models.project.benchmark.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.oss-models.project.benchmark';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Write a managed-versus-self-hosted architecture decision record', true, 1,
    'phase.oss-models.project.benchmark.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.oss-models.project.benchmark';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Defend the hosting decision with measured results', true, 0,
    'phase.oss-models.outcome.decision.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.oss-models.outcome.decision';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Explain identity, policy, evaluation, approval, and audit boundaries', true, 0,
    'phase.capstone.topic.control-plane.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.capstone.topic.control-plane';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Demonstrate a realistic failure and recovery scenario', true, 0,
    'phase.capstone.project.control-plane.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.capstone.project.control-plane';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Show measured quality, reliability, latency, cost, and security results', true, 1,
    'phase.capstone.project.control-plane.c2', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.capstone.project.control-plane';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Complete targeted applications, portfolio demos, and system-design interviews throughout the phase', true, 0,
    'phase.capstone.outcome.transition.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.capstone.outcome.transition';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Complete after production and advanced work if pursuing the recommended exam', false, 0,
    'phase.capstone.cert.genai-pro.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.capstone.cert.genai-pro';
  insert into public.achievement_criteria (
    user_id, item_id, description, is_required, sort_order, source_key, source_revision
  ) select uid, i.id, 'Pursue only when partner access is available', false, 0,
    'phase.capstone.cert.claude-architect.c1', '2026-07-17.1'
  from public.items i
  where i.user_id = uid and i.source_key = 'phase.capstone.cert.claude-architect';

  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Google Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course/', 'Google', 'course',
    'primary', 900, 'Primary structured learning for ML foundations',
    0, 'phase.foundations.res.ml-crash', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    (select i.id from public.items i where i.user_id = uid and i.source_key = 'phase.foundations.topic.ml-basics'),
    'PyTorch: Learn the Basics', 'https://pytorch.org/tutorials/beginner/basics/intro.html', 'PyTorch', 'documentation',
    'primary', 180, null,
    1, 'phase.foundations.res.pytorch', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Machine Learning Specialization', 'https://www.deeplearning.ai/courses/machine-learning-specialization/', 'DeepLearning.AI', 'course',
    'selective', 2400, 'Use selected lessons to close gaps; full completion is not required',
    2, 'phase.foundations.res.ml-spec', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Google Rules of ML', 'https://developers.google.com/machine-learning/guides/rules-of-ml/', 'Google', 'article',
    'selective', 90, null,
    3, 'phase.foundations.res.rules-of-ml', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Practical Deep Learning for Coders', 'https://course.fast.ai/', 'fast.ai', 'course',
    'optional', 2400, null,
    4, 'phase.foundations.res.fastai', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.foundations';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Generative AI with Large Language Models', 'https://www.deeplearning.ai/courses/generative-ai-with-llms', 'DeepLearning.AI', 'course',
    'primary', 960, null,
    0, 'phase.llms.res.genai-llm', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Transformers in Practice', 'https://www.deeplearning.ai/courses/transformers-in-practice', 'DeepLearning.AI', 'course',
    'primary', 480, null,
    1, 'phase.llms.res.transformers-practice', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'How Transformer LLMs Work', 'https://www.deeplearning.ai/courses/how-transformer-llms-work', 'DeepLearning.AI', 'course',
    'selective', 240, null,
    2, 'phase.llms.res.how-transformers', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Hugging Face LLM Course', 'https://huggingface.co/learn/llm-course/en/chapter1/1', 'Hugging Face', 'course',
    'selective', 600, null,
    3, 'phase.llms.res.hf-llm', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.llms';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Retrieval Augmented Generation', 'https://www.deeplearning.ai/courses/retrieval-augmented-generation/', 'DeepLearning.AI', 'course',
    'primary', 360, null,
    0, 'phase.rag.res.rag-course', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.rag';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Build with Claude', 'https://www.anthropic.com/learn/build-with-claude', 'Anthropic', 'documentation',
    'selective', 240, null,
    1, 'phase.rag.res.anthropic', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.rag';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'OpenAI developer quickstart', 'https://developers.openai.com/api/docs/quickstart', 'OpenAI', 'documentation',
    'selective', 120, null,
    2, 'phase.rag.res.openai', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.rag';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Hugging Face Agents Course', 'https://huggingface.co/learn/agents-course/unit0/introduction', 'Hugging Face', 'course',
    'primary', 720, null,
    0, 'phase.agents.res.hf-agents', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.agents';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Automated Testing for LLMOps', 'https://www.deeplearning.ai/short-courses/automated-testing-llmops/', 'DeepLearning.AI', 'course',
    'primary', 120, null,
    0, 'phase.eval-security.res.llmops-testing', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'OWASP LLM/GenAI Security Project', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', 'OWASP', 'documentation',
    'primary', 180, null,
    1, 'phase.eval-security.res.owasp-llm', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'OWASP Agentic AI Top 10', 'https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security/', 'OWASP', 'article',
    'primary', 90, null,
    2, 'phase.eval-security.res.owasp-agentic', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'NIST Generative AI Profile', 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence', 'NIST', 'documentation',
    'selective', 120, null,
    3, 'phase.eval-security.res.nist', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.eval-security';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'AWS certification exam guides', 'https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html', 'AWS', 'documentation',
    'primary', 180, null,
    0, 'phase.production-aws.res.aws-certs', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.production-aws';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'Hugging Face LLM Course', 'https://huggingface.co/learn/llm-course/en/chapter1/1', 'Hugging Face', 'course',
    'primary', 480, null,
    0, 'phase.oss-models.res.hf-llm', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.oss-models';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'vLLM OpenAI-compatible serving', 'https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/', 'vLLM', 'documentation',
    'primary', 120, null,
    1, 'phase.oss-models.res.vllm', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.oss-models';
  insert into public.resources (
    user_id, phase_id, item_id, title, url, provider, resource_type, priority,
    estimated_minutes, description, sort_order, source_key, source_revision, verified_at, status
  ) select uid, p.id,
    null,
    'AWS certification exam guides', 'https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html', 'AWS', 'documentation',
    'selective', 180, null,
    0, 'phase.capstone.res.aws-certs', '2026-07-17.1',
    '2026-07-17', 'planned'
  from public.phases p
  where p.user_id = uid and p.source_key = 'phase.capstone';
