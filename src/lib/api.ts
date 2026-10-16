import { Category, Product, SortOption } from "@/types";
import { FALLBACK_CATEGORIES } from "@/data/fallbackData";
import { parseBnNum } from "@/lib/bengali";

const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
const FALLBACK_URL_2 = "https://api.abcz.workers.dev/api/bazardor";

// Tries the primary endpoint, then two mirror fallbacks, then the embedded
// offline data. Aborts each request after 6s and caches successful responses
// for 60s via Next.js's revalidation.
async function fetchWithFallback<T>(endpoint: string, fallbackValue: T): Promise<T> {
  const urls = [BASE_URL, FALLBACK_URL_1, FALLBACK_URL_2].map((u) => `${u}${endpoint}`);

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 60 },
      });
      clearTimeout(timeoutId);
      if (res.ok) return (await res.json()) as T;
    } catch {
      // Try the next URL.
    }
  }

  return fallbackValue;
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchWithFallback<Category[]>("/categories", FALLBACK_CATEGORIES);
  // The fetcher can return `null`/empty if a URL returns a non-array body —
  // guard with the offline dataset in that case.
  return data?.length ? data : FALLBACK_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug || c.id === slug) ?? null;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const endpoint = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
  const data = await fetchWithFallback<Product[]>(endpoint, []);
  return data?.length ? data : [];
}

export async function getProduct(idOrSlug: string | number): Promise<Product | null> {
  const all = await getProducts();
  return (
    all.find((p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)) ?? null
  );
}

export async function getTopRisers(limit = 6): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit);
}

export async function getTopFallers(limit = 6): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, limit);
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => parseBnNum(a.today) - parseBnNum(b.today));
    case "price-desc":
      return list.sort((a, b) => parseBnNum(b.today) - parseBnNum(a.today));
    default:
      return list.sort((a, b) => parseBnNum(a.id) - parseBnNum(b.id));
  }
}
