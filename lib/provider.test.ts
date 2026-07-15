import { describe, expect, test } from "vitest";
import { detectProvider } from "./provider";

describe("detectProvider", () => {
  test("known providers by domain", () => {
    expect(detectProvider("https://www.udemy.com/course/x/")).toBe("Udemy");
    expect(detectProvider("https://www.coursera.org/learn/ml")).toBe("Coursera");
    expect(detectProvider("https://www.deeplearning.ai/courses/agentic-ai/")).toBe("DeepLearning.AI");
    expect(detectProvider("https://youtu.be/abc123")).toBe("YouTube");
    expect(detectProvider("https://huggingface.co/learn/agents-course")).toBe("Hugging Face");
  });
  test("subdomains match the registered suffix", () => {
    expect(detectProvider("https://docs.aws.amazon.com/bedrock/")).toBe("AWS");
    expect(detectProvider("https://www.youtube.com/playlist?list=PL")).toBe("YouTube");
    expect(detectProvider("https://docs.anthropic.com/en/docs/mcp")).toBe("Anthropic");
  });
  test("unknown domain falls back to bare hostname", () => {
    expect(detectProvider("https://www.example.org/course")).toBe("example.org");
  });
  test("unparseable input returns null", () => {
    expect(detectProvider("not a url")).toBeNull();
    expect(detectProvider("")).toBeNull();
  });
});
