export const toStaticBasePath = (basePath: string, path: string) => {
  const normalizedBase = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || "/";
};

const staticBaseUrl = () => import.meta.env?.BASE_URL ?? "/";

export const staticSitePath = (path: string) => toStaticBasePath(staticBaseUrl(), path);
export const staticRouterBase = () => staticBaseUrl() === "/" ? "" : staticBaseUrl().replace(/\/$/, "");
