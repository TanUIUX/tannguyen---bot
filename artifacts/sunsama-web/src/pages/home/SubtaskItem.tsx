import type { Subtask } from "./types";
import "./homepage.css";
import { Circle, CheckCircle2 } from "lucide-react";

interface Props {
  projectId: string;
  subtask: Subtask;
  inFlight: boolean;
  onToggle: (projectId: string, subtaskTitle: string) => void;
}

export default function SubtaskItem({
  projectId,
  subtask,
  inFlight,
  onToggle,
}: Props) {
  return (
    <div className="subtask">
      <span
        className="subtask-icon-wrapper"
        aria-busy={inFlight}
        onClick={() => {
          if (!inFlight) onToggle(projectId, subtask.title);
        }}
      >
        {subtask.isDone ? (
          <CheckCircle2 size={18} className="subtask-check-icon done" />
        ) : (
          <Circle size={18} className="subtask-check-icon" />
        )}
      </span>
      <div className={`subtask-title ${subtask.isDone ? "done" : ""}`}>
        {subtask.title}
      </div>
    </div>
  );
}
