import { describe, expect, test } from "vitest";
import { isDevAutoLoginEnabled } from "./dev-auth";

describe("isDevAutoLoginEnabled", () => {
  const enabled = {
    NODE_ENV: "development",
    DEV_AUTO_LOGIN: "true",
    DEV_LOGIN_PASSWORD: "local-only",
    ALLOWED_EMAIL: "you@example.com",
  };

  test("true when development and all env vars set", () => {
    expect(isDevAutoLoginEnabled(enabled)).toBe(true);
  });

  test("false in production even with flag set", () => {
    expect(isDevAutoLoginEnabled({ ...enabled, NODE_ENV: "production" })).toBe(false);
  });

  test("false when flag is not true", () => {
    expect(isDevAutoLoginEnabled({ ...enabled, DEV_AUTO_LOGIN: "1" })).toBe(false);
    expect(isDevAutoLoginEnabled({ ...enabled, DEV_AUTO_LOGIN: undefined })).toBe(false);
  });

  test("false when password or email missing", () => {
    expect(isDevAutoLoginEnabled({ ...enabled, DEV_LOGIN_PASSWORD: "" })).toBe(false);
    expect(isDevAutoLoginEnabled({ ...enabled, ALLOWED_EMAIL: undefined })).toBe(false);
  });
});
