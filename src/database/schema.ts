import {
  text,
  timestamp,
  pgTable,
  uuid,
  uniqueIndex,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    role: text("role")
      .$type<"admin" | "manager" | "employee">()
      .default("employee")
      .notNull(),
    managerId: uuid("managerId"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      parentReference: foreignKey({
        columns: [table.managerId],
        foreignColumns: [table.id],
      }),
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  }
);

export type createUser = typeof users.$inferInsert;
export type getUsers = typeof users.$inferSelect;

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    description: text("description"),
    status: text("status")
      .$type<"Todo" | "InProgress" | "InReview" | "Completed">()
      .default("Todo")
      .notNull(),
    createdBy: uuid("createdBy"),
    assignee: text("assignee"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      assigneeIdx: index("assigneeIdx").on(table.assignee),
      parentReference: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [users.id],
      }),
    };
  }
);
export type createTask = typeof tasks.$inferInsert;
