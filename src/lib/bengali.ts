import { PriceChange, Product, ProductPriceSummary } from "@/types";

const bnDigits: { [key: string]: string } = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

/**
 * Converts English numbers or formatted strings to Bengali numerals.
 * Example: 1850 -> ১,৮৫০; 2.5 -> ২.৫
 */
export function toBnNum(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "০";

  let str: string;
  if (typeof val === "number") {
    // Format with commas if integer or standard representation
    str = Number.isInteger(val)
      ? val.toLocaleString("en-US")
      : val.toFixed(1).replace(/\.0$/, "");
  } else {
    str = val.toString();
  }

  return str
    .split("")
    .map((char) => (bnDigits[char] !== undefined ? bnDigits[char] : char))
    .join("");
}

/**
 * Format amount as Bengali currency
 * Example: 148 -> "১৪৮ টাকা"
 */
export function toBnCurrency(val: number): string {
  return `${toBnNum(val)} টাকা`;
}

/**
 * Formats product unit into Bengali
 * Example: "kg" -> "প্রতি কেজি", "litre" -> "প্রতি লিটার"
 */
export function getUnitBn(unit: string): string {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "প্রতি কেজি";
    case "litre":
    case "liter":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
      return "প্রতি পিস";
    case "gm":
    case "gram":
      return "প্রতি গ্রাম";
    default:
      return `প্রতি ${unit || "একক"}`;
  }
}

/**
 * Format change badge with direction and percentage
 */
export function getChangeBadgeInfo(change: PriceChange) {
  const absPct = Math.abs(change.pct);
  const formattedPct = toBnNum(absPct.toFixed(1));

  if (change.dir === "up") {
    return {
      text: `▲ ${formattedPct}%`,
      direction: "up",
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      textClass: "text-emerald-600",
      icon: "▲",
    };
  } else if (change.dir === "down") {
    return {
      text: `▼ ${formattedPct}%`,
      direction: "down",
      colorClass: "bg-rose-50 text-rose-700 border-rose-200",
      textClass: "text-rose-600",
      icon: "▼",
    };
  }

  return {
    text: `— ০.০%`,
    direction: "flat",
    colorClass: "bg-slate-100 text-slate-700 border-slate-200",
    textClass: "text-slate-600",
    icon: "—",
  };
}

/**
 * Calculate Bengali Calendar Date & Gregorian Date in Bengali
 */
export function getBanglaDate(targetDate: Date = new Date()): string {
  const bnMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const bnDays = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];

  const dayName = bnDays[targetDate.getDay()];
  const day = toBnNum(targetDate.getDate());
  const monthName = bnMonths[targetDate.getMonth()];
  const year = toBnNum(targetDate.getFullYear());

  // Calculate approximate Bangla San (Bangla year = CE year - 593 or 594)
  const gregorianYear = targetDate.getFullYear();
  const gregorianMonth = targetDate.getMonth() + 1; // 1-12
  const gregorianDay = targetDate.getDate();

  // Simplified Bangla season/month calculation (Pohela Boishakh ~ April 14)
  let banglaYear = gregorianYear - 593;
  if (gregorianMonth < 4 || (gregorianMonth === 4 && gregorianDay < 14)) {
    banglaYear -= 1;
  }

  return `${dayName}, ${day} ${monthName} ${year} বঙ্গাব্দ ${toBnNum(banglaYear)}`;
}

/**
 * Calculates Min, Max, and Average price from market data or today's price
 */
export function calculatePriceSummary(product: Product): ProductPriceSummary {
  if (!product.markets || product.markets.length === 0) {
    return {
      minPrice: product.today,
      maxPrice: product.today,
      avgPrice: product.today,
    };
  }

  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  let totalMin = 0;
  let totalMax = 0;

  for (const market of product.markets) {
    if (market.min < min) min = market.min;
    if (market.max > max) max = market.max;
    totalMin += market.min;
    totalMax += market.max;
  }

  const count = product.markets.length;
  const avg = Math.round((totalMin + totalMax) / (count * 2));

  return {
    minPrice: min === Number.MAX_SAFE_INTEGER ? product.today : min,
    maxPrice: max === Number.MIN_SAFE_INTEGER ? product.today : max,
    avgPrice: avg || product.today,
  };
}
