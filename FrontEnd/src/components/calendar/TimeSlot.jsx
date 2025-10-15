import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const TimeSlot = ({
  timeSlot,
  showTimeSlot = true,
  serviceName,
  phoneNumber,
  content,
  customer = "",
  description = "",
  status = "",
  isEven,
}) => {
  return (
    <TableRow
      className={isEven ? "bg-schedule-row-even" : "bg-schedule-row-odd"}
    >
      <TableCell
        className={`py-3 px-4 border-r border-schedule-border ${
          showTimeSlot
            ? "font-semibold text-gray-800"
            : "text-transparent select-none"
        }`}
      >
        {showTimeSlot ? timeSlot : "."}
      </TableCell>
      <TableCell className="py-3 px-4 font-medium border-r border-schedule-border">
        {serviceName}
      </TableCell>
      <TableCell className="py-3 px-4 border-r border-schedule-border">
        {customer} - {phoneNumber}
      </TableCell>
      <TableCell className="py-3 px-4 border-r border-schedule-border max-w-[240px] truncate">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default truncate inline-block max-w-full">
                {description || "Không có ghi chú"}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              className="max-w-sm whitespace-pre-wrap break-words text-sm border-t border-gray-500"
            >
              {description || "Không có ghi chú"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="py-3 px-4 text-center">
        {status && (
          <Badge
            variant="outline"
            className={`px-3 py-1 rounded-full ${
              status === "confirmed"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }`}
          >
            {status}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TimeSlot;
