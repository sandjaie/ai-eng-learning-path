const KNOWN: [suffix: string, name: string][] = [
  ["udemy.com", "Udemy"],
  ["coursera.org", "Coursera"],
  ["linkedin.com", "LinkedIn Learning"],
  ["deeplearning.ai", "DeepLearning.AI"],
  ["youtube.com", "YouTube"],
  ["youtu.be", "YouTube"],
  ["huggingface.co", "Hugging Face"],
  ["aws.amazon.com", "AWS"],
  ["anthropic.com", "Anthropic"],
  ["claude.com", "Anthropic"],
  ["pytorch.org", "PyTorch"],
  ["karpathy.ai", "Andrej Karpathy"],
  ["cloud.google.com", "Google Cloud"],
  ["nvidia.com", "NVIDIA"],
  ["learn.microsoft.com", "Microsoft Learn"],
];

export function detectProvider(url: string): string | null {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  for (const [suffix, name] of KNOWN) {
    if (host === suffix || host.endsWith("." + suffix)) return name;
  }
  return host;
}
