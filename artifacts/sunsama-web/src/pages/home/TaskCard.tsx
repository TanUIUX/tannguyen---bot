import "./homepage.css";
import ProgressBar from "./ProgressBar";
import type { Project, Subtask } from "./types";
import SubtaskItem from "./SubtaskItem";
import { MessageSquare, Clock, Archive } from "lucide-react";

interface Props {
  project: Project;
  pendingToggles: Record<string, boolean>;
  onToggleSubtask: (projectId: string, subtaskTitle: string) => void;
  onArchiveTask: (projectId: string) => void;
}

export default function TaskCard({
  project,
  pendingToggles,
  onToggleSubtask,
  onArchiveTask,
}: Props) {
  const total = project.subtasks?.length || 0;
  const done =
    project.subtasks?.filter((s: Subtask) => s.isDone).length || 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="task">
      <div className="task-project">
        <div className="task-header">
          <div className="task-name">{project.title}</div>
          <div className="time-badge">
            {Math.floor((project.plannedTime ?? 0) / 60)}:
            {String((project.plannedTime ?? 0) % 60).padStart(2, "0")}
          </div>
        </div>
        <ProgressBar progress={progress} />
        <div className="task-middlesection">
          {project.subtasks?.map((subtask: Subtask, idx: number) => {
            const toggleKey = `${project._id}::${subtask.title}`;
            const inFlight = !!pendingToggles[toggleKey];
            return (
              <SubtaskItem
                key={idx}
                projectId={project._id}
                subtask={subtask}
                inFlight={inFlight}
                onToggle={onToggleSubtask}
              />
            );
          })}
        </div>
        <div className="task-footer">
          <div className="footer-icons">
            <MessageSquare size={18} className="footer-icon" />
            <Clock size={18} className="footer-icon" />
            <button
              className="footer-archive-btn"
              onClick={() => onArchiveTask(project._id)}
              aria-label="Archive task"
            >
              <Archive size={16} />
            </button>
          </div>
          <div className="tag">{project.tag ?? "# work"}</div>
        </div>
      </div>
    </div>
  );
}
