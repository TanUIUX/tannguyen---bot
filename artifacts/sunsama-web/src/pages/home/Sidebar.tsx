import "./homepage.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">Sunsama</div>
      <nav className="main-nav">
        <a className="nav-item active">Home</a>
        <a className="nav-item">Today</a>
        <a className="nav-item">Focus</a>

        <div className="section">Daily rituals</div>
        <a className="nav-item">Daily planning</a>
        <a className="nav-item">Daily shutdown</a>
        <a className="nav-item">Daily highlights</a>

        <div className="section">Weekly rituals</div>
        <a className="nav-item">Weekly planning</a>
        <a className="nav-item">Weekly review</a>
      </nav>

      <div className="invite">+ Invite someone</div>
    </aside>
  );
}
