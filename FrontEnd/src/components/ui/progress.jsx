// src/components/ui/progress.jsx
import React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(
  ({ value = 0, max = 100, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;
