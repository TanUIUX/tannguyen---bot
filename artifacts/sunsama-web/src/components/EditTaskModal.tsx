import { useState } from "react";
import type { Task } from "../types/task";
import type { UpdateTaskInput } from "../api/tasks";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateTaskInput) => void;
  isLoading?: boolean;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [timeEstimate, setTimeEstimate] = useState<number | undefined>(
    task.timeEstimate ?? undefined
  );
  const [isRecurring, setIsRecurring] = useState(task.isRecurring);
  const [recurrencePattern, setRecurrencePattern] = useState(
    task.recurrencePattern || "daily"
  );
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>(
    task.recurrenceDays ? (JSON.parse(task.recurrenceDays) as string[]) : []
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    task.recurrenceInterval || 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: UpdateTaskInput = {
      title,
      description: description || undefined,
      dueDate: dueDate || undefined,
      timeEstimate: timeEstimate || undefined,
    };

    if (isRecurring) {
      data.isRecurring = true;
      data.recurrencePattern = recurrencePattern;
      if (recurrencePattern === "weekly") {
        data.recurrenceDays = JSON.stringify(recurrenceDays);
      }
      if (recurrencePattern === "custom") {
        data.recurrenceInterval = recurrenceInterval;
      }
    } else {
      data.isRecurring = false;
      data.recurrencePattern = undefined;
      data.recurrenceDays = undefined;
      data.recurrenceInterval = undefined;
    }
    onSave(task.id, data);
    onClose();
  };

  const toggleDay = (day: string) => {
    setRecurrenceDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  if (!isOpen) return null;

  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title *
            </label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-desc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-due"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="edit-due"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-estimate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Estimate
            </label>
            <input
              type="number"
              id="edit-estimate"
              value={timeEstimate ?? ""}
              onChange={(e) =>
                setTimeEstimate(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="e.g., 30"
              min="5"
              step="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Recurring Task
              </span>
            </label>

            {isRecurring && (
              <div className="mt-4 space-y-3 bg-gray-50 p-3 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeat Pattern
                  </label>
                  <select
                    value={recurrencePattern}
                    onChange={(e) => setRecurrencePattern(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays (Mon-Fri)</option>
                    <option value="weekly">Weekly (specific days)</option>
                    <option value="custom">Custom interval</option>
                  </select>
                </div>

                {recurrencePattern === "weekly" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            recurrenceDays.includes(day)
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {recurrencePattern === "custom" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Every N days
                    </label>
                    <input
                      type="number"
                      value={recurrenceInterval}
                      onChange={(e) =>
                        setRecurrenceInterval(parseInt(e.target.value) || 1)
                      }
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
