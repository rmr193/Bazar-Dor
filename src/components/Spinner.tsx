import React from "react";

const SIZE_CLASS = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
};

interface SpinnerProps {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  label?: string;
}

export default function Spinner({ size = "md", className = "", label = "Loading…" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`${SIZE_CLASS[size]} border-2 border-[#057A44] border-t-transparent rounded-full animate-spin ${className}`.trim()}
    />
  );
}
