import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const StatusHistoryList = ({ statusUpdates }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4 w-full">
      {statusUpdates.map((update, index) => (
        <div key={update.id} className="flex gap-4">
          {/* Cột trái - Icon trạng thái */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 aspect-square",
                index === 0
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-indigo-500 border-indigo-200"
              )}
            >
              {index === 0 ? <Clock size={14} /> : <Check size={14} />}
            </div>

            {index < statusUpdates.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200"></div>
            )}
          </div>

          {/* Cột phải - Nội dung */}
          <div
            className={cn("pb-6", index === statusUpdates.length - 1 && "pb-0")}
          >
            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "font-medium",
                  index === 0 ? "text-purple-600" : "text-gray-500"
                )}
              >
                {update.time}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{update.date}</span>
            </div>

            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="pt-1 w-full"
            >
              <CollapsibleTrigger asChild>
                <p
                  className={cn(
                    "cursor-pointer hover:text-gray-900 w-full",
                    index === 0
                      ? "text-gray-800 font-semibold"
                      : "text-gray-700"
                  )}
                >
                  {update.description.substring(0, 100)}
                  {update.description.length > 100 && !isOpen && "..."}
                </p>
              </CollapsibleTrigger>

              {update.description.length > 100 && (
                <CollapsibleContent className="text-gray-700 w-full">
                  {update.description.substring(100)}
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusHistoryList;
