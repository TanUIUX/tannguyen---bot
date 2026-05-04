import { apiClient } from "./client";
import type { CreateTaskInput, Task } from "../types/task";

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  plannedDate?: string;
  timeEstimate?: number;
  actualTime?: number;
  startTime?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  recurrenceDays?: string;
  recurrenceInterval?: number;
}

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get("/api/tasks");
    return response.data;
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await apiClient.post("/api/tasks", data);
    return response.data;
  },

  toggleTask: async (id: string): Promise<Task> => {
    const response = await apiClient.patch(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/tasks/${id}`);
  },

  planTask: async (
    id: string,
    plannedDate: string | null
  ): Promise<Task> => {
    const response = await apiClient.patch(`/api/tasks/${id}/plan`, {
      plannedDate,
    });
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await apiClient.patch(`/api/tasks/${id}`, data);
    return response.data;
  },

  generateInstances: async (
    id: string,
    weeks: number = 2
  ): Promise<{ message: string; total: number }> => {
    const response = await apiClient.post(
      `/api/tasks/${id}/generate-instances`,
      { weeks }
    );
    return response.data;
  },
};
