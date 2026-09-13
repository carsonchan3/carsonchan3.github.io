export const toStaticBasePath = (basePath: string, path: string) => {
  const normalizedBase = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const [pathname, hash = ""] = path.split("#", 2);
  const normalizedPathname = pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonicalPathname = normalizedPathname ? `${normalizedPathname.replace(/\/$/, "")}/` : "";
  return `${normalizedBase}${canonicalPathname}${hash ? `#${hash}` : ""}` || "/";
};

const staticBaseUrl = () => import.meta.env?.BASE_URL ?? "/";

export const staticSitePath = (path: string) => toStaticBasePath(staticBaseUrl(), path);
export const staticRouterBase = () => staticBaseUrl() === "/" ? "" : staticBaseUrl().replace(/\/$/, "");
