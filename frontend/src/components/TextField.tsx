import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "./Label";
import { Input } from "./Input";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      className = "",
      labelClassName = "",
      inputClassName = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      (typeof label === "string"
        ? label.replace(/\s+/g, "-").toLowerCase()
        : undefined);
    return (
      <div className={"space-y-1 " + className}>
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={
            (error ? "border-red-500 focus:ring-red-500 " : "") + inputClassName
          }
          aria-invalid={!!error}
          aria-describedby={error ? inputId + "-error" : undefined}
          {...props}
        />
        {error && (
          <p id={inputId + "-error"} className="text-xs text-red-600 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);
