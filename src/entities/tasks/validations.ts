import { t } from "elysia";

enum taskStatus {
  ToDO = "Todo",
  InPROGRESS = "InProgress",
  InREVIEW = "InReview",
  COMPLETED = "Completed",
}

export const taskValidator = t.Object({
  description: t.String(),
  status: t.Enum(taskStatus),
  assignee: t.String({
    format: "email",
  }),
});
