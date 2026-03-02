import { createClient } from "@libsql/client"
import type { Client } from "@libsql/client"
import { getContext } from "../context/app_context";

let dbClient: Client | null = null;

export async function getDBClient(): Promise<Client> {
  if (dbClient) {
    return dbClient;
  }

  const context = await getContext();

  const config = context.config as Record<string, string>;

  const url = config["TURSO_URL"];
  const token = config["TURSO_TOKEN"];

  if (!url || !token) {
    throw new Error("TURSO_URL or TURSO_TOKEN is missing in config");
  }

  dbClient = createClient({
    url,
    authToken: token,
  });

  return dbClient;
}
