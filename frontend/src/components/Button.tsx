import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", disabled, ...props }, ref) => (
  <button
    ref={ref}
    className={
      `bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ` +
      (disabled ? "cursor-not-allowed " : "") +
      className
    }
    disabled={disabled}
    {...props}
  />
));
