"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressWithValueProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  position?: "start" | "start-outside" | "follow" | "end" | "end-outside";
  label?: (value?: number | null) => React.ReactNode;
  valueClassName?: string;
}

const ProgressWithValue = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressWithValueProps
>(
  (
    { className, valueClassName, value, position = "end", label, ...props },
    ref
  ) => {
    const valueCommonClass = cn(
      "absolute text-base text-white font-semibold left-0 h-full px-4 w-full items-center hidden"
    );

    const ProgressValue = () => (
      <span
        className={cn(
          "hidden",
          position === "start-outside" && "block text-primary",
          position === "follow" &&
            cn(valueCommonClass, "flex justify-end text-primary-foreground"),
          position === "start" &&
            cn(valueCommonClass, "flex justify-start text-primary-foreground"),
          position === "end" &&
            cn(valueCommonClass, "flex justify-end text-primary"),
          position === "end-outside" && "block text-primary",
          valueClassName
        )}
      >
        {typeof label === "function" ? label(value) : `${value}%`}
      </span>
    );

    return (
      <div className="w-full flex items-center gap-2">
        {position === "start-outside" && <ProgressValue />}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative h-5 w-full overflow-hidden rounded-full bg-[#E0E0E0]",
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-linear-to-r from-[#4A90E2] to-[#00C6FF] transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          >
            {position === "follow" && <ProgressValue />}
          </ProgressPrimitive.Indicator>
          {(position === "start" || position === "end") && <ProgressValue />}
        </ProgressPrimitive.Root>
        {position === "end-outside" && <ProgressValue />}
      </div>
    );
  }
);
ProgressWithValue.displayName = "ProgressWithValue";

export { ProgressWithValue };
