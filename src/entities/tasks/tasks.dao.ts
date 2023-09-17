import { eq } from "drizzle-orm";
import { db } from "../../database";
import { tasks, createTask as newTask } from "../../database/schema";

export const createTask = async (task: newTask) => {
  const createdTask = await db.insert(tasks).values(task).returning();
  return createdTask[0];
};
