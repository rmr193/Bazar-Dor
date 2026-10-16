import { PriceChange, Product, ProductPriceSummary } from "@/types";

// Bengali ↔ English digit lookup. Used to convert numbers like "১,৮৫০"
// into the JS number 1850, and to format a JS number back to Bengali.
const EN_TO_BN: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};
const BN_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_BN).map(([en, bn]) => [bn, en])
);

export function parseBnNum(val: number | string | undefined | null): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;

  const normalized = val
    .toString()
    .replace(/[০-৯]/g, (c) => BN_TO_EN[c] || c)
    .replace(/[^0-9.-]/g, "");

  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

export function toBnNum(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "০";

  const str =
    typeof val === "number"
      ? Number.isInteger(val)
        ? val.toLocaleString("en-US")
        : val.toFixed(1).replace(/\.0$/, "")
      : val.toString();

  return str.replace(/\d/g, (d) => EN_TO_BN[d]);
}

export function toBnCurrency(val: number): string {
  return `${toBnNum(val)} টাকা`;
}

const UNIT_LABELS: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  gm: "প্রতি গ্রাম",
  gram: "প্রতি গ্রাম",
};

export function getUnitBn(unit: string): string {
  return UNIT_LABELS[unit?.toLowerCase()] ?? `প্রতি ${unit || "একক"}`;
}

export function getChangeBadgeInfo(change: PriceChange) {
  const pct = toBnNum(Math.abs(change.pct).toFixed(1));
  if (change.dir === "up") {
    return {
      text: `▲ ${pct}%`,
      direction: "up" as const,
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      textClass: "text-emerald-600",
      icon: "▲",
    };
  }
  if (change.dir === "down") {
    return {
      text: `▼ ${pct}%`,
      direction: "down" as const,
      colorClass: "bg-rose-50 text-rose-700 border-rose-200",
      textClass: "text-rose-600",
      icon: "▼",
    };
  }
  return {
    text: "— ০.০%",
    direction: "flat" as const,
    colorClass: "bg-slate-100 text-slate-700 border-slate-200",
    textClass: "text-slate-600",
    icon: "—",
  };
}

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];
const BN_DAYS = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার",
  "বৃহস্পতিবার", "শুক্রবার", "শনিবার",
];

export function getBanglaDate(targetDate: Date = new Date()): string {
  const dayName = BN_DAYS[targetDate.getDay()];
  const day = toBnNum(targetDate.getDate());
  const month = BN_MONTHS[targetDate.getMonth()];
  const year = toBnNum(targetDate.getFullYear());

  // Bangla year = CE year - 593, except before Pohela Boishakh (Apr 14).
  let banglaYear = targetDate.getFullYear() - 593;
  const m = targetDate.getMonth() + 1;
  if (m < 4 || (m === 4 && targetDate.getDate() < 14)) banglaYear -= 1;

  return `${dayName}, ${day} ${month} ${year} বঙ্গাব্দ ${toBnNum(banglaYear)}`;
}

export function calculatePriceSummary(product: Product): ProductPriceSummary {
  if (!product.markets?.length) {
    return { minPrice: product.today, maxPrice: product.today, avgPrice: product.today };
  }

  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  let total = 0;

  for (const m of product.markets) {
    if (m.min < min) min = m.min;
    if (m.max > max) max = m.max;
    total += m.min + m.max;
  }

  const count = product.markets.length;
  return {
    minPrice: min,
    maxPrice: max,
    avgPrice: Math.round(total / (count * 2)),
  };
}
