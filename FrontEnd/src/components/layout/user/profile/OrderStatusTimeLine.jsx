import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const OrderStatusTimeline = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              {/* Connect line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute h-2 top-6 left-[50%] z-0 w-full rounded-full bg-slate-300 overflow-hidden"
                  )}
                >
                  {isCompleted && (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-400" />
                  )}
                  {isCurrent && (
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-400 animate-fill-progress" />
                  )}
                </div>
              )}

              {/* Circle Node */}
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                  isCompleted
                    ? "bg-indigo-500 text-white shadow-lg"
                    : isCurrent
                    ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white ring-4 ring-purple-200 shadow-md animate-pulse-glow"
                    : "bg-slate-100 border-2 border-slate-300 text-slate-500"
                )}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : isCurrent ? (
                  <Clock size={20} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isCompleted
                      ? "font-medium text-indigo-500"
                      : isCurrent
                      ? "font-semibold text-purple-600"
                      : "text-slate-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
