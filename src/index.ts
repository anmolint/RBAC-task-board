import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { userRouter } from "./entities";
import { envVars } from "./config";

const app = new Elysia().use(cors()).use(userRouter()).listen(envVars.PORT);
console.info(
  `🦊 Elysia is running in ${envVars.ENV} mode at ${app.server?.hostname}:${app.server?.port}`
);
