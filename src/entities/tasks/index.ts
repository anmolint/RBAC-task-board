import { Elysia } from "elysia";
import { managerAuth } from "../../libs/auth";
import { taskValidator } from "./validations";
import { createTask } from "./tasks.dao";

export const taskRouter = () => {
  return new Elysia({ prefix: "/v1/tasks" }).use(managerAuth).post(
    "/create",
    async ({ body, manager }) => {
      const newTask = {
        ...body,
        createdBy: manager.id,
      };
      const task = await createTask(newTask);
      return task;
    },
    {
      body: taskValidator,
    }
  );
};
