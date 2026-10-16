import React from "react";

interface SpinnerProps {
  /** Size in Tailwind units. Defaults to 8 (w-8 h-8). */
  size?: "6" | "8" | "10" | "12";
  /** Color of the spinning ring. Defaults to brand green. */
  color?: string;
  /** Optional extra classes (e.g. for layout/positioning). */
  className?: string;
  /** Accessible label for screen readers. */
  label?: string;
}

/**
 * A reusable loading spinner used across the app (auth pages, profile pages, etc.).
 *
 * Uses `border-2` (a valid Tailwind utility) instead of the non-existent
 * `border-3` so the ring renders with the intended width on every screen.
 */
export default function Spinner({
  size = "8",
  color = "border-[#057A44]",
  className = "",
  label = "Loading…",
}: SpinnerProps) {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div
      role="status"
      aria-label={label}
      className={`${sizeClass} border-2 ${color} border-t-transparent rounded-full animate-spin ${className}`.trim()}
    />
  );
}
