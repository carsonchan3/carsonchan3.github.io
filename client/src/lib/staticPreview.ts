export const toStaticBasePath = (basePath: string, path: string) => {
  const normalizedBase = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || "/";
};

export const staticSitePath = (path: string) => toStaticBasePath(import.meta.env.BASE_URL, path);

export const staticRouterBase = () => import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
