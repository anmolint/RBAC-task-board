import { t } from "elysia";

enum employeeType {
  admin = "admin",
  employee = "employee",
  manager = "manager",
}
export const signUpValidation = t.Object({
  name: t.String({}),
  password: t.String({
    minLength: 8,
  }),
  email: t.String({
    format: "email",
  }),
  role: t.Enum(employeeType),
});

export const loginValidation = t.Object({
  email: t.String({
    format: "email",
  }),
  password: t.String({
    minLength: 8,
  }),
});
