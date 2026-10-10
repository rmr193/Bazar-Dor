import { Category, Product, SortOption } from "@/types";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/data/fallbackData";

const BASE_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
const BASE_URL_2 = "https://api.abcz.workers.dev/api/bazardor";

/**
 * Robust fetcher with dual-endpoint fallback and embedded backup
 */
async function fetchWithFallback<T>(endpoint: string, fallbackValue: T): Promise<T> {
  const urls = [`${BASE_URL_1}${endpoint}`, `${BASE_URL_2}${endpoint}`];

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 60 }, // Cache revalidation for 60s
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && (Array.isArray(data) ? data.length > 0 : true)) {
          return data as T;
        }
      }
    } catch {
      // Continue to next URL
    }
  }

  // If network or worker fails, return guaranteed fallback
  return fallbackValue;
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await fetchWithFallback<Category[]>("/categories", FALLBACK_CATEGORIES);
  return categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  const matched = categories.find((c) => c.slug === slug || c.id === slug);
  if (matched) return matched;

  // Try direct endpoint if available
  const direct = await fetchWithFallback<Category | null>(`/categories/${slug}`, null);
  return direct || null;
}

/**
 * Get all products (or optionally filtered by category)
 */
export async function getProducts(category?: string): Promise<Product[]> {
  const endpoint = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
  const fallbackList = category
    ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
    : FALLBACK_PRODUCTS;

  const products = await fetchWithFallback<Product[]>(endpoint, fallbackList);
  return products && products.length > 0 ? products : fallbackList;
}

/**
 * Get a single product by either ID or slug
 */
export async function getProduct(idOrSlug: string | number): Promise<Product | null> {
  // If numeric or product ID
  const isNumeric = !isNaN(Number(idOrSlug));

  if (isNumeric) {
    const directProduct = await fetchWithFallback<Product | null>(
      `/products/${idOrSlug}`,
      null
    );
    if (directProduct) return directProduct;
  }

  // Search in all products by slug or id
  const allProducts = await getProducts();
  const found = allProducts.find(
    (p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)
  );

  if (found) return found;

  // Fallback search
  return (
    FALLBACK_PRODUCTS.find(
      (p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)
    ) || null
  );
}

/**
 * Section A: "আজ দাম বেড়েছে ▲" - Top Risers
 */
export async function getTopRisers(limit: number = 6): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit);
}

/**
 * Section B: "আজ দাম কমেছে ▼" - Top Fallers
 */
export async function getTopFallers(limit: number = 6): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct) // most negative first
    .slice(0, limit);
}

/**
 * Sort products numerically (Challenge C1)
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products];

  switch (sort) {
    case "price-asc":
      // দাম: কম থেকে বেশি (Numeric sort)
      return list.sort((a, b) => Number(a.today) - Number(b.today));
    case "price-desc":
      // দাম: বেশি থেকে কম (Numeric sort)
      return list.sort((a, b) => Number(b.today) - Number(a.today));
    case "default":
    default:
      // ডিফল্ট
      return list.sort((a, b) => a.id - b.id);
  }
}
