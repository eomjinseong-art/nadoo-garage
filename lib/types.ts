export type Vehicle = {
  slug: string;
  kind: "car" | "bike";
  brand: string;
  nameKo: string;
  nameEn: string;
  generation: string;
  years: string;
  color: string;
  colorHex: string;
  price?: string;
  priceNote?: string;
  priceSort: number;
  tagline: string;
  specs: [string, string][];
  story: string[];
  imageNote?: string;
};

export type WikiImage = {
  src: string;
  w: number;
  h: number;
  file: string;
  page: string;
  author: string;
  license: string;
  licenseUrl: string;
};
