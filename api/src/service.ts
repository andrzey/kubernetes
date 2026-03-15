import { db } from "./db/index.ts";
import { usersTable } from "./db/schema.ts";

export const getUsers = async () => {
  return await db.select().from(usersTable);
};
