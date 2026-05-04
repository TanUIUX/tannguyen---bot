import type { DayItem, Project } from "./types";
import "./homepage.css";
import TaskCard from "./TaskCard";

interface Props {
  day: DayItem;
  projects: Project[];
  openEditor: (dayId: string) => void;
  pendingToggles: Record<string, boolean>;
  onToggleSubtask: (projectId: string, subtaskTitle: string) => void;
}

export default function DayColumn({
  day,
  projects,
  openEditor,
  pendingToggles,
  onToggleSubtask,
}: Props) {
  return (
    <div className="day-col">
      <div className="day-head">
        <div className="day-name">{day.name}</div>
        <div className="day-date">{day.date}</div>
      </div>
      <button className="add-task" onClick={() => openEditor(day.id)}>
        + Add task
      </button>
      {projects.map((p) => (
        <TaskCard
          key={p._id}
          project={p}
          pendingToggles={pendingToggles}
          onToggleSubtask={onToggleSubtask}
        />
      ))}
    </div>
  );
}
