import "./homepage.css";
import type { Dispatch, SetStateAction } from "react";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import CalendarSelect from "./CalendarSelect";
import { Clock } from "lucide-react";

interface EditorState {
  open: boolean;
  dayId?: string;
  title?: string;
  tag?: string;
  timeEstimate?: number;
}

interface Props {
  editor: EditorState;
  setEditor: Dispatch<SetStateAction<EditorState>>;
  closeEditor: () => void;
  saveEditor: () => void;
}

export default function TaskEditor({
  editor,
  setEditor,
  closeEditor,
  saveEditor,
}: Props) {
  let displayDate: string;
  if (editor.dayId) {
    const parsed = new Date(editor.dayId + "T00:00:00");
    if (isToday(parsed)) {
      displayDate = "Today";
    } else if (isTomorrow(parsed)) {
      displayDate = "Tomorrow";
    } else if (isYesterday(parsed)) {
      displayDate = "Yesterday";
    } else {
      displayDate = format(parsed, "EEEE, MMM d");
    }
  } else {
    displayDate = format(new Date(), "EEEE, MMM d");
  }

  void displayDate;

  return (
    <>
      <div className="editor-backdrop" onClick={closeEditor} />
      <div className="task-editor" role="dialog" aria-modal="true">
        <input
          className="editor-title"
          placeholder="Task title"
          value={editor.title ?? ""}
          onChange={(e) =>
            setEditor((s) => ({ ...s, title: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeEditor();
            } else if (e.key === "Enter") {
              e.preventDefault();
              saveEditor();
            }
          }}
        />

        <div className="editor-footer">
          <div className="editor-left">
            <label className="editor-label">
              <CalendarSelect
                value={editor.dayId}
                onSelect={(iso) =>
                  setEditor((s) => ({ ...s, dayId: iso }))
                }
              />
            </label>
            <label className="editor-label">
              <Clock size={18} className="clock-icon" />
              <select
                className="editor-select"
                value={editor.timeEstimate ?? 15}
                onChange={(e) =>
                  setEditor((s) => ({
                    ...s,
                    timeEstimate: Number(e.target.value),
                  }))
                }
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
                <option value={60}>60</option>
              </select>
            </label>
            <label className="editor-label">
              Tag
              <select
                className="editor-select"
                value={editor.tag ?? "# work"}
                onChange={(e) =>
                  setEditor((s) => ({ ...s, tag: e.target.value }))
                }
              >
                <option value="# work"># work</option>
                <option value="# personal"># personal</option>
                <option value="# errands"># errands</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
