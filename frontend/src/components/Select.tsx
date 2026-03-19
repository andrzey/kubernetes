import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", disabled, ...props }, ref) => (
  <select
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
