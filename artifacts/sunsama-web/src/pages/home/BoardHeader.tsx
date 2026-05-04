import "./homepage.css";

export default function BoardHeader() {
  return (
    <header className="board-header">
      <div className="left-controls">
        <button className="btn small">Today</button>
        <button className="btn small ghost">Filter</button>
      </div>
    </header>
  );
}
