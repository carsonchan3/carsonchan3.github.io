import { marked } from "marked";
import { serviceContent, type ServiceContentRecord } from "./serviceContent.generated";

export type { ServiceContentRecord };
export { serviceContent };

export const visibleServices = serviceContent.filter((service) => service.visible);

export const renderServiceMarkdown = (markdown: string) => marked.parse(markdown, { gfm: true, breaks: false }) as string;
