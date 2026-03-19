import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent",
  secondary:
    "bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-600",
  tertiary:
    "bg-transparent hover:bg-gray-100 text-indigo-700 border border-transparent shadow-none",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", disabled, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={
        `${variantClasses[variant]} disabled:opacity-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors ` +
        (disabled ? "cursor-not-allowed " : "") +
        className
      }
      disabled={disabled}
      {...props}
    />
  ),
);
