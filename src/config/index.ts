import { z } from "zod";

enum environment {
  development = "development",
  production = "production",
}
const envSchema = z.object({
  ENV: z.nativeEnum(environment),
  databaseUrl: z.string().min(1),
  jwtSecret: z.string(),
  PORT: z.preprocess(Number, z.number()),
});

export const envVars = envSchema.parse(Bun.env);
