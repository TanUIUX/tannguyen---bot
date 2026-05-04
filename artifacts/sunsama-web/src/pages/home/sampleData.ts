import { format, addDays } from "date-fns";
import type { Project } from "./types";

const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

export const sampleProjects: Project[] = [
  {
    _id: "sample-1",
    title: "Design landing page",
    date: today,
    plannedTime: 60,
    tag: "# work",
    subtasks: [
      { title: "Create wireframe", isDone: true },
      { title: "Choose color palette", isDone: true },
      { title: "Build in Figma", isDone: false },
    ],
  },
  {
    _id: "sample-2",
    title: "Review pull requests",
    date: today,
    plannedTime: 30,
    tag: "# work",
    subtasks: [
      { title: "Check API changes", isDone: false },
      { title: "Test frontend build", isDone: false },
    ],
  },
  {
    _id: "sample-3",
    title: "Weekly team sync",
    date: today,
    plannedTime: 45,
    tag: "# work",
    subtasks: [
      { title: "Prepare agenda", isDone: true },
      { title: "Share meeting notes", isDone: false },
    ],
  },
  {
    _id: "sample-4",
    title: "Write blog post",
    date: tomorrow,
    plannedTime: 90,
    tag: "# personal",
    subtasks: [
      { title: "Draft outline", isDone: false },
      { title: "Write first section", isDone: false },
      { title: "Add images", isDone: false },
    ],
  },
  {
    _id: "sample-5",
    title: "Grocery shopping",
    date: tomorrow,
    plannedTime: 30,
    tag: "# errands",
    subtasks: [
      { title: "Check fridge inventory", isDone: true },
      { title: "Make shopping list", isDone: false },
    ],
  },
];
