import { eq } from "drizzle-orm";
import { db } from "../../database";
import { users, createUser as newUser } from "../../database/schema";

export const createUser = async (body: newUser) => {
  const user = await db.insert(users).values(body).returning({
    userId: users.id,
    email: users.email,
    name: users.name,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  });
  return user[0];
};

export const getUser = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0];
};
