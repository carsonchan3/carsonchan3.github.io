export const getFreshTrpcRequestOptions = (init?: RequestInit): RequestInit => {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-cache");

  return {
    ...(init ?? {}),
    cache: "no-store",
    credentials: "include",
    headers,
  };
};
