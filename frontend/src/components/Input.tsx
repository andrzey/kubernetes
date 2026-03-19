import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", disabled, ...props }, ref) => (
  <input
    ref={ref}
    className={
      `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ` +
      (disabled ? "opacity-50 cursor-not-allowed bg-gray-100 " : "") +
      className
    }
    disabled={disabled}
    {...props}
  />
));
