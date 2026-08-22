import { describe, expect, it } from "vitest";
import { getPostLoginRedirectPath } from "./_core/oauth";

describe("OAuth post-login redirect", () => {
  it("sends administrators to the owner workspace", () => {
    expect(getPostLoginRedirectPath("admin")).toBe("/owner");
  });

  it("keeps regular users on the public homepage", () => {
    expect(getPostLoginRedirectPath("user")).toBe("/");
  });

  it("keeps users on the public homepage when no role is available", () => {
    expect(getPostLoginRedirectPath(undefined)).toBe("/");
  });
});
