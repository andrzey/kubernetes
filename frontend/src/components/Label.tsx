import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";

export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={"block text-sm font-medium text-gray-700 mb-1 " + className}
    {...props}
  />
));
