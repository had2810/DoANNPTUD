import React from "react";
import { CheckCircle, Ban } from "lucide-react";

const CalendarContextMenu = ({
  open,
  onClose,
  onSetDayOff,
  onRemoveDayOff,
  dateStr,
  isOff,
  children,
}) => {
  return (
    <div className="relative inline-block">
      {children}
      {open && (
        <div
          className="absolute left-full top-0 ml-2 min-w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {isOff ? (
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-green-600 flex items-center gap-2"
              onClick={() => {
                onRemoveDayOff(dateStr);
                onClose();
              }}
            >
              <CheckCircle className="w-4 h-4" />
              Làm việc
            </button>
          ) : (
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
              onClick={() => {
                onSetDayOff(dateStr);
                onClose();
              }}
            >
              <Ban className="w-4 h-4" />
              Nghỉ
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarContextMenu;
