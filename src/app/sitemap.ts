import type { MetadataRoute } from "next";
import { site, visibleNav } from "@/content/site";
import { getAgendaEnabled } from "@/lib/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return visibleNav(await getAgendaEnabled()).map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
