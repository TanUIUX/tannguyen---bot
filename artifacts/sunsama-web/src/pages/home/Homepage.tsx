import "./homepage.css";
import { useRef, useEffect, useState, useMemo } from "react";
import type { Project } from "./types";
import { generateDays } from "./generateDays";
import { sampleProjects } from "./sampleData";
import Sidebar from "./Sidebar";
import BoardHeader from "./BoardHeader";
import DayColumn from "./DayColumn";
import TaskEditor from "./TaskEditor";
import CalendarPane from "./CalendarPane";
import BacklogPanel from "./BacklogPanel";

export function HomePage() {
  const days = useMemo(() => generateDays(), []);
  const todayIndex = 29;
  const daysRef = useRef<HTMLDivElement | null>(null);

  const [localProjects, setLocalProjects] =
    useState<Project[]>(sampleProjects);
  const [pendingToggles, setPendingToggles] = useState<
    Record<string, boolean>
  >({});

  const [editor, setEditor] = useState<{
    open: boolean;
    dayId?: string;
    title?: string;
    description?: string;
    tag?: string;
    timeEstimate?: number;
  }>({ open: false });

  const [showBacklog, setShowBacklog] = useState(false);

  function openEditor(dayId: string) {
    setEditor({
      open: true,
      dayId,
      title: "",
      description: "",
      tag: "# work",
      timeEstimate: 30,
    });
  }

  function closeEditor() {
    setEditor({ open: false });
  }

  function saveEditor() {
    if (!editor.dayId) return closeEditor();
    const newTask: Project = {
      _id: `local-${Date.now()}`,
      title: editor.title || "New task",
      date: editor.dayId,
      plannedTime: editor.timeEstimate ?? 0,
      subtasks: [],
      tag: editor.tag,
    };

    setLocalProjects((prev) => [newTask, ...prev]);
    closeEditor();
  }

  function handleWheel(e: React.WheelEvent) {
    const el = daysRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }

  useEffect(() => {
    const container = daysRef.current;
    const todayEl = container?.children[todayIndex - 1] as
      | HTMLElement
      | undefined;
    if (!container || !todayEl) return;
    container.scrollTo({ left: todayEl.offsetLeft, behavior: "instant" });
  }, [todayIndex]);

  function handleToggleSubtask(projectId: string, subtaskTitle: string) {
    const toggleKey = `${projectId}::${subtaskTitle}`;
    if (pendingToggles[toggleKey]) return;

    setLocalProjects((prev) =>
      prev.map((p) => {
        if (p._id !== projectId) return p;
        return {
          ...p,
          subtasks: p.subtasks.map((s) =>
            s.title === subtaskTitle ? { ...s, isDone: !s.isDone } : s,
          ),
        };
      }),
    );

    setPendingToggles((prev) => ({ ...prev, [toggleKey]: true }));
    setTimeout(() => {
      setPendingToggles((prev) => {
        const copy = { ...prev };
        delete copy[toggleKey];
        return copy;
      });
    }, 300);
  }

  function handleArchiveTask(projectId: string) {
    setLocalProjects((prev) =>
      prev.map((p) =>
        p._id === projectId ? { ...p, archived: true } : p,
      ),
    );
  }

  function handleRestoreTask(projectId: string) {
    setLocalProjects((prev) =>
      prev.map((p) =>
        p._id === projectId ? { ...p, archived: false } : p,
      ),
    );
  }

  const activeProjects = localProjects.filter((p) => !p.archived);
  const archivedProjects = localProjects.filter((p) => p.archived);

  return (
    <div className="app">
      <Sidebar />

      <main className="board">
        <BoardHeader />

        <section className="days" ref={daysRef} onWheel={handleWheel}>
          {days.map((day) => (
            <DayColumn
              key={day.id}
              day={day}
              projects={activeProjects.filter((p) => p.date === day.id)}
              openEditor={openEditor}
              pendingToggles={pendingToggles}
              onToggleSubtask={handleToggleSubtask}
              onArchiveTask={handleArchiveTask}
            />
          ))}
        </section>

        {editor.open && (
          <TaskEditor
            editor={editor}
            setEditor={setEditor}
            closeEditor={closeEditor}
            saveEditor={saveEditor}
          />
        )}
      </main>

      {showBacklog ? (
        <BacklogPanel
          archivedProjects={archivedProjects}
          onRestore={handleRestoreTask}
          onClose={() => setShowBacklog(false)}
        />
      ) : (
        <CalendarPane onOpenBacklog={() => setShowBacklog(true)} />
      )}
    </div>
  );
}
