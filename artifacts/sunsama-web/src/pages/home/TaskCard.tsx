import "./homepage.css";
import ProgressBar from "./ProgressBar";
import type { Project, Subtask } from "./types";
import SubtaskItem from "./SubtaskItem";

interface Props {
  project: Project;
  pendingToggles: Record<string, boolean>;
  onToggleSubtask: (projectId: string, subtaskTitle: string) => void;
}

export default function TaskCard({
  project,
  pendingToggles,
  onToggleSubtask,
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
          <div className="time-badge">{project.plannedTime ?? 0}m</div>
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
            <svg
              className="footer-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className="footer-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 8v5l3 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="tag">{project.tag ?? "# work"}</div>
        </div>
      </div>
    </div>
  );
}
