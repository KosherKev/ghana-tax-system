import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-cu-text"
          >
            {label}
            {props.required && <span className="text-cu-red ml-1" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-cu-muted shrink-0">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-md border bg-white text-cu-text text-sm transition-colors duration-150",
              "placeholder:text-cu-muted",
              "focus:outline-none focus:ring-2 focus:ring-cu-red focus:border-cu-red",
              "disabled:bg-gray-50 disabled:text-cu-muted disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                : "border-cu-border hover:border-gray-400",
              leftAddon ? "pl-9" : "pl-3",
              rightAddon ? "pr-9" : "pr-3",
              "py-2",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3 text-cu-muted shrink-0">{rightAddon}</span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-cu-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
