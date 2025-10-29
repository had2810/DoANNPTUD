export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  allDay?: boolean;
  color?: string;
}

export interface CalendarView {
  type: "day" | "week" | "month";
  date: Date;
}

export interface CalendarProps {
  events: CalendarEvent[];
  view: CalendarView;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
}
