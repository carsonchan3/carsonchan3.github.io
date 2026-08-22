import { describe, expect, it } from "vitest";
import { publicContactEmail, publicContactEmailHref } from "./contactDetails";

describe("public contact details", () => {
  it("uses the approved VLI public email address", () => {
    expect(publicContactEmail).toBe("info@velocity-lab.com");
    expect(publicContactEmailHref).toBe("mailto:info@velocity-lab.com");
  });
});
