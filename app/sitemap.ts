import type { MetadataRoute } from "next";
import { hrefFor, vehicles } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "/cars", "/bikes", "/credits", ...vehicles.map(hrefFor)];
  return paths.map((path) => ({
    url: path === "" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.split("/").length > 2 ? 0.7 : 0.8,
  }));
}
