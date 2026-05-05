import "./homepage.css";
import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  BarChart2,
  Settings,
  ClipboardList,
  Moon,
  Search,
  Zap,
  Plus,
} from "lucide-react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 12);
const HOUR_HEIGHT = 56;

function currentMinuteOffset(): number {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const minutesSinceNoon = (h - 12) * 60 + m;
  return (minutesSinceNoon / 60) * HOUR_HEIGHT;
}

interface Props {
  onOpenBacklog: () => void;
}

export default function CalendarPane({ onOpenBacklog }: Props) {
  const now = new Date();
  const dayAbbr = now
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayNum = now.getDate();

  const [timeOffset, setTimeOffset] = useState(currentMinuteOffset);

  useEffect(() => {
    const id = setInterval(() => setTimeOffset(currentMinuteOffset()), 60_000);
    return () => clearInterval(id);
  }, []);

  const showTimeLine = useMemo(() => {
    const h = now.getHours();
    return h >= 12 && h < 24;
  }, [now]);

  return (
    <aside className="calendar-pane">
      <div className="calendar-top">
        <div className="cal-header-row">
          <div className="cal-zoom-controls">
            <button className="cal-zoom-btn">+</button>
            <span className="cal-zoom-label">1x</span>
            <button className="cal-zoom-btn">&minus;</button>
          </div>
          <div className="month">
            {dayAbbr}
            <br />
            {dayNum}
          </div>
        </div>
      </div>

      <div className="calendar-hours">
        <div className="hours-grid-labeled">
          {HOURS.map((h) => (
            <div key={h} className="hour-row" style={{ height: HOUR_HEIGHT }}>
              <span className="hour-label">
                {h}:00
              </span>
              <div className="hour-line" />
            </div>
          ))}
          {showTimeLine && (
            <div
              className="current-time-line"
              style={{ top: timeOffset }}
            />
          )}
        </div>
      </div>

      <div className="cal-icon-toolbar">
        <Calendar size={18} />
        <BarChart2 size={18} />
        <Settings size={18} />
        <button className="toolbar-btn" onClick={onOpenBacklog} aria-label="Open backlog">
          <ClipboardList size={18} />
        </button>
        <Moon size={18} />
        <Search size={18} />
        <Zap size={18} />
        <Plus size={18} />
      </div>

      <div className="chat-btn">💬</div>
    </aside>
  );
}
