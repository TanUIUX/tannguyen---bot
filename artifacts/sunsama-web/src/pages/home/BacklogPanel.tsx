import "./homepage.css";
import { useState } from "react";
import type { Project } from "./types";
import { X, Search, RotateCcw } from "lucide-react";

interface Props {
  archivedProjects: Project[];
  onRestore: (projectId: string) => void;
  onClose: () => void;
}

export default function BacklogPanel({
  archivedProjects,
  onRestore,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  const filtered = archivedProjects.filter((p) => {
    const matchesSearch =
      !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = filterTag === "all" || p.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  return (
    <aside className="backlog-panel">
      <div className="backlog-header">
        <span className="backlog-title">Search</span>
        <button className="backlog-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="backlog-search">
        <Search size={14} className="backlog-search-icon" />
        <input
          className="backlog-search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="backlog-filters">
        <button
          className={`backlog-filter-btn ${filterTag === "all" ? "active" : ""}`}
          onClick={() => setFilterTag("all")}
        >
          Filter
        </button>
        <span className="backlog-filter-label">Date: Anytime</span>
        <span className="backlog-filter-label">
          Channel: {filterTag === "all" ? "all" : filterTag}
        </span>
      </div>

      <div className="backlog-list">
        {filtered.length === 0 && (
          <div className="backlog-empty">No archived tasks</div>
        )}
        {filtered.map((p) => (
          <div key={p._id} className="backlog-item">
            <div className="backlog-item-header">
              <span className="backlog-item-title">{p.title}</span>
              <span className="backlog-item-date">{p.date}</span>
            </div>
            <div className="backlog-item-meta">
              <span className="backlog-archived-badge">Archived</span>
              <span className="tag">{p.tag ?? "# work"}</span>
              <button
                className="backlog-restore-btn"
                onClick={() => onRestore(p._id)}
                aria-label="Restore task"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
