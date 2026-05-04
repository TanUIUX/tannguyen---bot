interface RecurringTemplate {
  id: string;
  title: string;
  description: string | null;
  timeEstimate: number | null;
  recurrencePattern: string | null;
  recurrenceDays: string | null;
  recurrenceInterval: number | null;
  userId: string;
}

interface TaskInstance {
  title: string;
  description: string | null;
  timeEstimate: number | null;
  plannedDate: Date;
  userId: string;
  parentTaskId: string;
}

export function generateInstances(
  template: RecurringTemplate,
  startDate: Date,
  endDate: Date
): TaskInstance[] {
  if (!template.recurrencePattern) {
    return [];
  }

  const instances: TaskInstance[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    let shouldCreate = false;

    switch (template.recurrencePattern) {
      case "daily":
        shouldCreate = true;
        break;

      case "weekdays": {
        const day = current.getDay();
        shouldCreate = day >= 1 && day <= 5;
        break;
      }

      case "weekly":
        if (template.recurrenceDays) {
          const selectedDays = JSON.parse(template.recurrenceDays) as string[];
          const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
          const currentDayName = dayNames[current.getDay()];
          shouldCreate = selectedDays.includes(currentDayName);
        }
        break;

      case "custom":
        if (template.recurrenceInterval) {
          const daysSinceStart = Math.floor(
            (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          shouldCreate = daysSinceStart % template.recurrenceInterval === 0;
        }
        break;
    }

    if (shouldCreate) {
      instances.push({
        title: template.title,
        description: template.description,
        timeEstimate: template.timeEstimate,
        plannedDate: new Date(current),
        userId: template.userId,
        parentTaskId: template.id,
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return instances;
}
