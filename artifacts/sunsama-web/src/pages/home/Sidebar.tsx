import "./homepage.css";
import { useState } from "react";
import {
  Home,
  ListTodo,
  Crosshair,
  Calendar,
  FileText,
  Pencil,
  CheckSquare,
  ChevronLeft,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="logo">{collapsed ? "S" : "Sunsama"}</div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={16}
            className={`toggle-chevron ${collapsed ? "rotated" : ""}`}
          />
        </button>
      </div>

      <nav className="main-nav">
        <a className="nav-item active">
          <Home size={18} />
          {!collapsed && <span>Home</span>}
        </a>
        <a className="nav-item">
          <ListTodo size={18} />
          {!collapsed && <span>Today</span>}
        </a>
        <a className="nav-item">
          <Crosshair size={18} />
          {!collapsed && <span>Focus</span>}
        </a>

        {!collapsed && <div className="section">Daily rituals</div>}
        <a className="nav-item">
          <Calendar size={18} />
          {!collapsed && <span>Daily planning</span>}
        </a>
        <a className="nav-item">
          <FileText size={18} />
          {!collapsed && <span>Daily shutdown</span>}
        </a>
        <a className="nav-item">
          <Pencil size={18} />
          {!collapsed && <span>Daily highlights</span>}
        </a>

        {!collapsed && <div className="section">Weekly rituals</div>}
        <a className="nav-item">
          <CheckSquare size={18} />
          {!collapsed && <span>Weekly planning</span>}
        </a>
        <a className="nav-item">
          <CheckSquare size={18} />
          {!collapsed && <span>Weekly review</span>}
        </a>
      </nav>

      <div className="invite">
        <Users size={16} />
        {!collapsed && <span>Invite someone</span>}
      </div>
    </aside>
  );
}
