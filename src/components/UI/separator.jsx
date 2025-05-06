"use client"

import React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(({ 
  className, 
  orientation = "horizontal", 
  ...props 
}, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation={orientation}
    className={cn(
      "shrink-0 bg-gray-200 dark:bg-gray-700",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator }