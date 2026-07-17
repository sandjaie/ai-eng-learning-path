/** Exact legacy seed titles → curated source keys (unique matches only). */
export const LEGACY_PHASE_TITLES: Record<string, string> = {
  "Months 1–2: Python, ML & mathematical foundations": "phase.foundations",
  "Months 3–4: LLMs under the hood": "phase.llms",
  "Months 5–6: Applied LLM engineering & RAG": "phase.rag",
  "Months 7–8: Agents, tools, MCP & workflows": "phase.agents",
  "Months 9–10: Evaluation, security & AI observability": "phase.eval-security",
  "Months 11–12: Production AI on AWS": "phase.production-aws",
  "Months 13–18: Advanced expertise": "phase.oss-models",
};

export const LEGACY_PARALLEL_PHASE_TITLES = [
  "Claude certification track (parallel)",
  "Portfolio & positioning",
] as const;

export const REMOVED_CLAUDE_CERT_TITLES = [
  "Claude Certified Developer",
  "Claude Certified Engineer",
  "Claude Certified Practitioner",
] as const;
