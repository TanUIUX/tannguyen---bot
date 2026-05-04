import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, isToday } from "date-fns";
import "react-day-picker/style.css";

interface Props {
  value?: string;
  onSelect?: (dateString: string) => void;
}

export default function CalendarSelect({ value, onSelect }: Props) {
  const initial = value ? new Date(value) : new Date();
  const [date, setDate] = useState<Date>(initial);
  const [open, setOpen] = useState(false);

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    setDate(d);
    const iso = format(d, "yyyy-MM-dd");
    if (onSelect) onSelect(iso);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="calendar-trigger" aria-label="Select date">
          <CalendarIcon className="calendar-icon" />
          {isToday(date) ? "Today" : format(date, "EEEE, MMM d")}
        </button>
      </Popover.Trigger>

      <Popover.Content sideOffset={6} className="calendar-popover">
        <div className="calendar-popover-header">
          Schedule exact start date
        </div>
        <DayPicker
          mode="single"
          required
          selected={date}
          onSelect={handleSelect}
          weekStartsOn={1}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
