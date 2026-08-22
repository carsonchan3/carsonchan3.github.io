import { describe, expect, it } from "vitest";
import { getFreshTrpcRequestOptions } from "./trpcRequestOptions";

describe("fresh tRPC request options", () => {
  it("bypasses stale HTTP responses while retaining caller headers", () => {
    const options = getFreshTrpcRequestOptions({ headers: { "X-Request-Test": "catalogue" } });

    expect(options.cache).toBe("no-store");
    expect(options.credentials).toBe("include");
    expect(new Headers(options.headers).get("Cache-Control")).toBe("no-cache");
    expect(new Headers(options.headers).get("X-Request-Test")).toBe("catalogue");
  });
});
