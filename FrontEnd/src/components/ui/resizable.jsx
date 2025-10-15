import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
));
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.Panel
    ref={ref}
    className={cn(
      "relative flex w-full data-[panel-group-direction=vertical]:h-full",
      className
    )}
    {...props}
  />
));
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelResizeHandle
    ref={ref}
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-2.5 w-2.5"
      >
        <path d="M15 18H3V6h12" />
        <path d="M10 3v18" />
        <path d="M21 3v18" />
      </svg>
    </div>
  </ResizablePrimitive.PanelResizeHandle>
));
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
