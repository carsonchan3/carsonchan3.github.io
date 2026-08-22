import { describe, expect, it } from "vitest";
import { toStaticBasePath } from "./staticPreview";

describe("static preview paths", () => {
  it("keeps ordinary hosting paths root-relative", () => {
    expect(toStaticBasePath("/", "/services")).toBe("/services");
  });

  it("adds any configured GitHub Pages project base path to internal links", () => {
    expect(toStaticBasePath("/velocity-lab-innovation/", "/services")).toBe("/velocity-lab-innovation/services");
    expect(toStaticBasePath("/velocity-lab-innovation/", "/")).toBe("/velocity-lab-innovation");
  });
});
