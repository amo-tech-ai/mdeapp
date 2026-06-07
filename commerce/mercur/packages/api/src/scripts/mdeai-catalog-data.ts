export type MdeaiCatalogItem = {
  title: string;
  handle: string;
  description: string;
  sku: string;
  priceUsd: number;
  priceEur: number;
};

export const MDEAI_SELLER_NAME = "mdeai";
export const MDEAI_SELLER_HANDLE = "mdeai";
export const MDEAI_SELLER_EMAIL = "seller@mdeai.co";

/** 20 Medellín lifestyle SKUs — handles are stable for idempotent seeding. */
export const MDEAI_CATALOG: MdeaiCatalogItem[] = [
  {
    title: "White Linen Shirt",
    handle: "mdeai-white-linen-shirt",
    description: "Breathable white linen shirt for warm Medellín afternoons.",
    sku: "MDEAI-LINEN-WHT",
    priceUsd: 48,
    priceEur: 42,
  },
  {
    title: "Black Resort Shirt",
    handle: "mdeai-black-resort-shirt",
    description: "Relaxed black resort shirt for rooftop dinners in Provenza.",
    sku: "MDEAI-RESORT-BLK",
    priceUsd: 52,
    priceEur: 46,
  },
  {
    title: "Medellín Coffee Bag",
    handle: "mdeai-medellin-coffee-bag",
    description: "Single-origin Antioquia coffee — 340g bag.",
    sku: "MDEAI-COFFEE-340",
    priceUsd: 18,
    priceEur: 16,
  },
  {
    title: "Colombiamoda Tote Bag",
    handle: "mdeai-colombiamoda-tote",
    description: "Canvas tote from Colombiamoda week — limited run.",
    sku: "MDEAI-TOTE-CM",
    priceUsd: 24,
    priceEur: 22,
  },
  {
    title: "Provenza Dinner Dress",
    handle: "mdeai-provenza-dinner-dress",
    description: "Elegant midi dress for Provenza restaurant nights.",
    sku: "MDEAI-DRESS-PROV",
    priceUsd: 89,
    priceEur: 78,
  },
  {
    title: "Rooftop Nightlife Jacket",
    handle: "mdeai-rooftop-nightlife-jacket",
    description: "Lightweight jacket for Medellín rooftop clubs.",
    sku: "MDEAI-JKT-ROOF",
    priceUsd: 95,
    priceEur: 84,
  },
  {
    title: "Handmade Leather Wallet",
    handle: "mdeai-handmade-leather-wallet",
    description: "Artisan leather wallet from a Laureles workshop.",
    sku: "MDEAI-WALLET-LE",
    priceUsd: 38,
    priceEur: 34,
  },
  {
    title: "Local Designer Sunglasses",
    handle: "mdeai-designer-sunglasses",
    description: "UV400 acetate frames by a Medellín eyewear studio.",
    sku: "MDEAI-SUN-LOC",
    priceUsd: 65,
    priceEur: 58,
  },
  {
    title: "Fashion Week Bracelet",
    handle: "mdeai-fashion-week-bracelet",
    description: "Brass cuff inspired by Colombiamoda street style.",
    sku: "MDEAI-BRACE-FW",
    priceUsd: 32,
    priceEur: 28,
  },
  {
    title: "Coffee Tour Hat",
    handle: "mdeai-coffee-tour-hat",
    description: "Wide-brim hat for coffee farm day trips outside the city.",
    sku: "MDEAI-HAT-COF",
    priceUsd: 28,
    priceEur: 25,
  },
  {
    title: "Laureles Casual Shirt",
    handle: "mdeai-laureles-casual-shirt",
    description: "Soft cotton casual shirt — everyday Laureles uniform.",
    sku: "MDEAI-SHIRT-LAU",
    priceUsd: 44,
    priceEur: 39,
  },
  {
    title: "El Poblado Evening Dress",
    handle: "mdeai-el-poblado-evening-dress",
    description: "Statement dress for El Poblado nightlife.",
    sku: "MDEAI-DRESS-POB",
    priceUsd: 98,
    priceEur: 86,
  },
  {
    title: "Minimal Black Tee",
    handle: "mdeai-minimal-black-tee",
    description: "Premium cotton tee — minimal black, unisex fit.",
    sku: "MDEAI-TEE-BLK",
    priceUsd: 26,
    priceEur: 23,
  },
  {
    title: "Tropical Print Shirt",
    handle: "mdeai-tropical-print-shirt",
    description: "Bold tropical print shirt for salsa weekends.",
    sku: "MDEAI-SHIRT-TRO",
    priceUsd: 46,
    priceEur: 40,
  },
  {
    title: "Designer Scarf",
    handle: "mdeai-designer-scarf",
    description: "Silk-blend scarf from a local atelier.",
    sku: "MDEAI-SCARF-DS",
    priceUsd: 36,
    priceEur: 32,
  },
  {
    title: "Event Merch Cap",
    handle: "mdeai-event-merch-cap",
    description: "Structured cap — mdeai event merch edition.",
    sku: "MDEAI-CAP-EVT",
    priceUsd: 22,
    priceEur: 20,
  },
  {
    title: "Boutique Sandals",
    handle: "mdeai-boutique-sandals",
    description: "Leather sandals for warm Medellín evenings.",
    sku: "MDEAI-SAND-BTQ",
    priceUsd: 58,
    priceEur: 51,
  },
  {
    title: "Artisan Necklace",
    handle: "mdeai-artisan-necklace",
    description: "Hand-finished necklace from a Provenza boutique.",
    sku: "MDEAI-NECK-ART",
    priceUsd: 42,
    priceEur: 37,
  },
  {
    title: "Premium Colombian Chocolate",
    handle: "mdeai-premium-colombian-chocolate",
    description: "Dark chocolate bar — 70% cacao, Antioquia origin.",
    sku: "MDEAI-CHOC-70",
    priceUsd: 14,
    priceEur: 12,
  },
  {
    title: "Designer Notebook",
    handle: "mdeai-designer-notebook",
    description: "Lay-flat notebook with Medellín skyline cover art.",
    sku: "MDEAI-NOTE-DS",
    priceUsd: 20,
    priceEur: 18,
  },
];
