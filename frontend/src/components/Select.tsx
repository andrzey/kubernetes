import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { Label } from "./Label";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, className = "", labelClassName = "", id, disabled, ...props },
    ref,
  ) => {
    const inputId = id || label;

    return (
      <div className="space-y-1">
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
        <select
          id={inputId}
          ref={ref}
          className={
            `w-full border rounded-lg px-3 py-2 text-sm min-h-[38px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ` +
            (disabled ? "opacity-50 cursor-not-allowed bg-gray-100 " : "") +
            className
          }
          disabled={disabled}
          {...props}
        />
      </div>
    );
  },
);
