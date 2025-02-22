import Dexie from "dexie";
import { getSchemaFingerprint } from "@/data/db/export-db";

// Convert Base64 to Blob
const base64ToBlob = async (base64: string): Promise<Blob> => {
  const response = await fetch(base64);
  return await response.blob();
};

// Compare schema fingerprint
const compareSchemas = (
  importedSchema: Record<string, string>,
  currentSchema: Record<string, string>,
): string[] => {
  const differences: string[] = [];

  for (const table in importedSchema) {
    if (!(table in currentSchema)) {
      differences.push(`Missing table: ${table}`);
    } else if (importedSchema[table] !== currentSchema[table]) {
      differences.push(`Schema mismatch in table: ${table}`);
    }
  }
  for (const table in currentSchema) {
    if (!(table in importedSchema)) {
      differences.push(`Extra table in current schema: ${table}`);
    }
  }

  return differences;
};

// Import function
export const importDatabase = async (db: Dexie, file: File) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    if (!event.target) return;
    const rawData = event.target.result as string;

    const parsedData = JSON.parse(rawData) as Record<string, unknown[]> & {
      _meta?: {
        schema: Record<string, string>;
        version: number;
        exportedAt: string;
      };
    };

    // Check schema validity
    if (!parsedData._meta || !parsedData._meta.schema) {
      console.error("Invalid export file: missing schema information.");
      return;
    }

    const importedSchema = parsedData._meta.schema;
    const currentSchema = getSchemaFingerprint(db);
    const schemaDifferences = compareSchemas(importedSchema, currentSchema);

    if (schemaDifferences.length > 0) {
      console.warn("Schema mismatch detected:", schemaDifferences);
      if (!confirm("Schema does not match. Do you want to continue?")) return;
    }

    // Convert Dates & Blobs back
    for (const [storeName, records] of Object.entries(parsedData)) {
      if (storeName === "_meta") continue;

      // @ts-expect-error This is 4o generated code and the ExportData type is terribly vague
      for (const record of records) {
        for (const key in record) {
          if (record[key] && typeof record[key] === "object") {
            if (record[key].__date) {
              record[key] = new Date(record[key].__date);
            } else if (record[key].__blob) {
              record[key] = await base64ToBlob(record[key].__blob);
            }
          }
        }
      }
    }

    // Insert records into IndexedDB
    await db.transaction("rw", db.tables, async () => {
      for (const [storeName, records] of Object.entries(parsedData)) {
        if (storeName === "_meta") continue;
        if (db.tables.some((t) => t.name === storeName)) {
          // @ts-expect-error This is 4o generated code and the ExportData type is terribly vague
          await db.table(storeName).bulkPut(records);
        } else {
          console.warn(`Skipping unknown store: ${storeName}`);
        }
      }
    });

    console.log("Database import completed.");
  };

  reader.readAsText(file);
};
