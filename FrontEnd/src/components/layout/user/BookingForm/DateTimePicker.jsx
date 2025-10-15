import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import scheduleService from "@/services/scheduleService";

const fullTimeSlots = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

const saturdayTimeSlots = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:30", label: "4:30 PM" },
];

const sundayTimeSlots = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
];

const DateTimePicker = ({ control }) => {
  const [monthStatus, setMonthStatus] = useState({});
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const monthStr = format(calendarMonth, "yyyy-MM");
    scheduleService.getAvailableTimeByMonth(monthStr).then((res) => {
      setMonthStatus(res.days || {});
    });
  }, [calendarMonth]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    scheduleService.getAvailableTimeByDate(dateStr).then((res) => {
      setAvailableTimes(res.availableTimes || []);
    });
  }, [selectedDate]);

  const isDateAvailable = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayStatus = monthStatus[dateStr];
    return dayStatus && dayStatus.availableTimesCount > 0;
  };

  const modifiers = React.useMemo(() => {
    const result = {};
    Object.entries(monthStatus).forEach(([dateStr, dayStatus]) => {
      if (!result[dayStatus.status]) result[dayStatus.status] = [];
      result[dayStatus.status].push(new Date(dateStr));
    });
    return result;
  }, [monthStatus]);

  const modifiersClassNames = {
    available: "bg-emerald-300 text-emerald-900",
    light_busy: "bg-lime-300 text-lime-900",
    semi_busy: "bg-amber-300 text-amber-900",
    off: "bg-rose-400 text-rose-900",
  };

  let timeSlotsToRender = fullTimeSlots;
  const dayOfWeek = selectedDate ? new Date(selectedDate).getDay() : null;
  if (dayOfWeek === 6) {
    timeSlotsToRender = saturdayTimeSlots;
  } else if (dayOfWeek === 0) {
    timeSlotsToRender = sundayTimeSlots;
  }

  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-lg font-semibold">Chọn ngày</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    field.onChange(date);
                  }}
                  onMonthChange={setCalendarMonth}
                  disabled={(date) => !isDateAvailable(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                />
                {/* Legend for calendar status colors */}
                <div className="flex gap-3 my-3 px-3">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-emerald-300 border border-emerald-400 inline-block"></span>
                    <span className="text-xs text-gray-700">Khả dụng</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-lime-300 border border-lime-400 inline-block"></span>
                    <span className="text-xs text-gray-700">Ít bận</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-amber-300 border border-amber-400 inline-block"></span>
                    <span className="text-xs text-gray-700">Gần đầy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-rose-400 border border-rose-500 inline-block"></span>
                    <span className="text-xs text-gray-700">Đã đầy</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="time"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-lg font-semibold">Chọn giờ</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {timeSlotsToRender.map((slot) => {
                  const isSelected = field.value === slot.value;
                  const isDisabled = !availableTimes.includes(slot.value);

                  return (
                    <div key={slot.value} className="group relative">
                      <RadioGroupItem
                        value={slot.value}
                        id={`time-${slot.value}`}
                        className="peer hidden"
                        disabled={isDisabled}
                      />
                      <Label
                        htmlFor={`time-${slot.value}`}
                        title={
                          isDisabled
                            ? "Khung giờ này đã đầy hoặc không khả dụng"
                            : undefined
                        }
                        className={`relative flex items-center justify-center gap-2 rounded-md border-2 p-4 cursor-pointer
                          transition-all duration-300 ease-in-out
                          ${
                            isSelected
                              ? "border-techmate-purple bg-techmate-purple/10 shadow-lg scale-[1.02]"
                              : isDisabled
                              ? "border-muted bg-muted text-gray-400 cursor-not-allowed opacity-60"
                              : "border-muted hover:border-techmate-purple hover:bg-techmate-purple/5 hover:shadow-md hover:scale-[1.01]"
                          }`}
                      >
                        <span
                          className={`absolute top-1 right-1 transition-all duration-300 ${
                            isSelected
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-0"
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4 text-techmate-purple" />
                        </span>
                        <Clock
                          className={`h-5 w-5 ${
                            isSelected
                              ? "text-techmate-purple"
                              : isDisabled
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isSelected
                              ? "text-techmate-purple"
                              : isDisabled
                              ? "text-gray-400"
                              : ""
                          }`}
                        >
                          {slot.label}
                        </span>

                        {/* Tooltip UI khi disabled */}
                        {isDisabled && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                            Khung giờ đã đầy hoặc không khả dụng
                          </span>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>

            {dayOfWeek === 0 && (
              <p className="text-sm text-yellow-600 mt-2">
                Lưu ý: Đơn đặt lịch ngày Chủ nhật sẽ được xử lý vào Thứ 2 kế
                tiếp.
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimePicker;
