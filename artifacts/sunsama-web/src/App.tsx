import { useState, useCallback } from "react";
import { Today } from "./pages/Today";
import { Tasks } from "./pages/Tasks";
import { Week } from "./pages/Week";
import { CreateTaskModal } from "./components/CreateTaskModal";
import { SettingsModal } from "./components/SettingsModal";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "./api/tasks";
import type { CreateTaskInput } from "./types/task";

type View = "today" | "week" | "tasks";

function App() {
  const [currentView, setCurrentView] = useState<View>("today");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleCreateTask = (data: CreateTaskInput) => {
    createMutation.mutate(data);
    setShowCreateModal(false);
  };

  useKeyboardShortcut(
    "n",
    useCallback(() => setShowCreateModal(true), [])
  );

  useKeyboardShortcut(
    "t",
    useCallback(() => setCurrentView("today"), [])
  );

  useKeyboardShortcut(
    "w",
    useCallback(() => setCurrentView("week"), [])
  );

  useKeyboardShortcut(
    "a",
    useCallback(() => setCurrentView("tasks"), [])
  );

  useKeyboardShortcut(
    "Escape",
    useCallback(() => {
      setShowCreateModal(false);
      setShowSettings(false);
    }, [])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-xl font-bold text-blue-600">Sunsama Clone</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView("today")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentView === "today"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Today (T)
          </button>
          <button
            onClick={() => setCurrentView("week")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentView === "week"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Week (W)
          </button>
          <button
            onClick={() => setCurrentView("tasks")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentView === "tasks"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Tasks (A)
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-blue-700"
          >
            + New Task (N)
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-md font-medium text-sm"
          >
            Settings
          </button>
        </div>
      </nav>

      <main>
        {currentView === "today" && <Today />}
        {currentView === "week" && <Week />}
        {currentView === "tasks" && <Tasks />}
      </main>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        isLoading={createMutation.isPending}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;
