import type { Metadata } from "next";

export const SITE_URL = "https://nadoo-garage.vercel.app";
export const SITE_NAME = "나두카&모터사이클";
export const SITE_NAME_EN = "Nadoo Garage";
export const SITE_DESCRIPTION =
  "운영자와 함께했던 자동차 22대와 모터사이클 11대. 세대·연식·제원·당시 신차가를 정리한 나두카의 개인 차고 아카이브.";

/** Abacus visitor counter. One hit per browser per local day; test traffic is excluded. */
export const ABACUS_NAMESPACE = "nadoo-garage";
export const ABACUS_KEY = "visits";
export const ABACUS_STORAGE_KEY = "nadoo-garage-visit-day";
export const PROD_HOSTS = ["nadoo-garage.vercel.app"];

export const COUPANG_URL = "https://link.coupang.com/a/hsdzLh1vB6";

export const SISTER_SITES = [
  { href: "https://british-motors.vercel.app", label: "영국차 아카이브" },
  { href: "https://italian-motors.vercel.app", label: "이탈리아차 아카이브" },
  { href: "https://usa-motors.vercel.app", label: "미국차 아카이브" },
];

export function absoluteUrl(path: string) {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
