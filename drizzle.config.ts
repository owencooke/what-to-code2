// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import { connectionString } from "@/app/(server)/db/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    url: connectionString,
  },
  //   extensionsFilters: ["postgis"],
  schemaFilter: ["test"],
  tablesFilter: ["*"],
});
