import { db, sunsamaUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function ensureTempUser() {
  const userId = "temp-user-id";

  const existing = await db
    .select()
    .from(sunsamaUsersTable)
    .where(eq(sunsamaUsersTable.id, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(sunsamaUsersTable).values({
      id: userId,
      email: "temp@example.com",
      name: "Temp User",
      password: "temp",
    });
  }
}
