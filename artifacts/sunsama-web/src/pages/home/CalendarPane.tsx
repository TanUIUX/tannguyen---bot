import "./homepage.css";

export default function CalendarPane() {
  const now = new Date();
  const dayAbbr = now
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayNum = now.getDate();

  return (
    <aside className="calendar-pane">
      <div className="calendar-top">
        <div className="cal-controls">
          <div className="month">
            {dayAbbr}
            <br />
            {dayNum}
          </div>
        </div>
      </div>

      <div className="calendar-hours">
        <div className="hours-grid" />
      </div>

      <div className="chat-btn">💬</div>
    </aside>
  );
}
