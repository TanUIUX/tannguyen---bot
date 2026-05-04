import { Router } from "express";
import { db, sunsamaTasksTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { generateInstances } from "../utils/recurringTasks";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const userId = "temp-user-id";
    const tasks = await db
      .select()
      .from(sunsamaTasksTable)
      .where(eq(sunsamaTasksTable.userId, userId))
      .orderBy(sunsamaTasksTable.createdAt);

    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      timeEstimate,
      isRecurring,
      recurrencePattern,
      recurrenceDays,
      recurrenceInterval,
    } = req.body;
    const userId = "temp-user-id";

    const [task] = await db
      .insert(sunsamaTasksTable)
      .values({
        id: randomUUID(),
        title,
        description: description ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        timeEstimate: timeEstimate ?? null,
        userId,
        isRecurring: isRecurring ?? false,
        recurrencePattern: recurrencePattern ?? null,
        recurrenceDays: recurrenceDays ?? null,
        recurrenceInterval: recurrenceInterval ?? null,
      })
      .returning();

    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    const [task] = await db
      .select()
      .from(sunsamaTasksTable)
      .where(eq(sunsamaTasksTable.id, id))
      .limit(1);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const [updatedTask] = await db
      .update(sunsamaTasksTable)
      .set({ completed: !task.completed })
      .where(eq(sunsamaTasksTable.id, id))
      .returning();

    res.json(updatedTask);
  } catch {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(sunsamaTasksTable).where(eq(sunsamaTasksTable.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

router.patch("/:id/plan", async (req, res) => {
  try {
    const { id } = req.params;
    const { plannedDate } = req.body;

    const [task] = await db
      .select()
      .from(sunsamaTasksTable)
      .where(eq(sunsamaTasksTable.id, id))
      .limit(1);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const [updatedTask] = await db
      .update(sunsamaTasksTable)
      .set({ plannedDate: plannedDate ? new Date(plannedDate) : null })
      .where(eq(sunsamaTasksTable.id, id))
      .returning();

    res.json(updatedTask);
  } catch {
    res.status(500).json({ error: "Failed to update planned date for task" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      plannedDate,
      timeEstimate,
      startTime,
      actualTime,
      isRecurring,
      recurrencePattern,
      recurrenceDays,
      recurrenceInterval,
    } = req.body;

    const [task] = await db
      .select()
      .from(sunsamaTasksTable)
      .where(eq(sunsamaTasksTable.id, id))
      .limit(1);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (plannedDate !== undefined) updateData.plannedDate = plannedDate ? new Date(plannedDate) : null;
    if (timeEstimate !== undefined) updateData.timeEstimate = timeEstimate;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (actualTime !== undefined) updateData.actualTime = actualTime;
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
    if (recurrencePattern !== undefined) updateData.recurrencePattern = recurrencePattern;
    if (recurrenceDays !== undefined) updateData.recurrenceDays = recurrenceDays;
    if (recurrenceInterval !== undefined) updateData.recurrenceInterval = recurrenceInterval;

    const [updatedTask] = await db
      .update(sunsamaTasksTable)
      .set(updateData)
      .where(eq(sunsamaTasksTable.id, id))
      .returning();

    res.json(updatedTask);
  } catch {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.post("/:id/generate-instances", async (req, res) => {
  try {
    const { id } = req.params;
    const { weeks = 2 } = req.body;

    const [template] = await db
      .select()
      .from(sunsamaTasksTable)
      .where(eq(sunsamaTasksTable.id, id))
      .limit(1);

    if (!template) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    if (!template.isRecurring) {
      res.status(400).json({ error: "Task not recurring" });
      return;
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + weeks * 7);
    endDate.setHours(0, 0, 0, 0);

    const instances = generateInstances(
      {
        id: template.id,
        title: template.title,
        description: template.description,
        timeEstimate: template.timeEstimate,
        recurrencePattern: template.recurrencePattern,
        recurrenceDays: template.recurrenceDays,
        recurrenceInterval: template.recurrenceInterval,
        userId: template.userId,
      },
      startDate,
      endDate
    );

    const existingInstances = await db
      .select()
      .from(sunsamaTasksTable)
      .where(
        and(
          eq(sunsamaTasksTable.parentTaskId, template.id),
          gte(sunsamaTasksTable.plannedDate, startDate),
          lte(sunsamaTasksTable.plannedDate, endDate)
        )
      );

    const existingDates = new Set(
      existingInstances.map((t: { plannedDate: Date | null }) =>
        t.plannedDate?.toISOString().split("T")[0]
      )
    );

    const newInstances = instances.filter(
      (inst) => !existingDates.has(inst.plannedDate.toISOString().split("T")[0])
    );

    if (newInstances.length > 0) {
      await db.insert(sunsamaTasksTable).values(
        newInstances.map((inst) => ({
          id: randomUUID(),
          title: inst.title,
          description: inst.description,
          timeEstimate: inst.timeEstimate,
          plannedDate: inst.plannedDate,
          userId: inst.userId,
          parentTaskId: inst.parentTaskId,
        }))
      );
    }

    res.json({
      message: `Generated ${newInstances.length} new instances`,
      total: newInstances.length,
    });
  } catch {
    res.status(500).json({ error: "Failed to generate instances" });
  }
});

export default router;
