export interface Subtask {
  title: string;
  isDone: boolean;
}

export interface Project {
  _id: string;
  title: string;
  date: string;
  plannedTime: number;
  subtasks: Subtask[];
  tag?: string;
  archived?: boolean;
}

export interface DayItem {
  id: string;
  name: string;
  date: string;
  fullDate: Date;
}
