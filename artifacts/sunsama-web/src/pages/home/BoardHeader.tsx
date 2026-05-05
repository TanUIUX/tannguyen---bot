import "./homepage.css";
import {
  Calendar,
  SlidersHorizontal,
  LayoutGrid,
  CalendarDays,
} from "lucide-react";

export default function BoardHeader() {
  return (
    <header className="board-header">
      <div className="left-controls">
        <button className="btn small">
          <Calendar size={14} />
          Today
        </button>
        <button className="btn small ghost">
          <SlidersHorizontal size={14} />
          Filter
        </button>
      </div>
      <div className="right-controls">
        <button className="btn small">
          <LayoutGrid size={14} />
          Board
        </button>
        <button className="btn small ghost">
          <CalendarDays size={14} />
          Calendars
        </button>
      </div>
    </header>
  );
}
