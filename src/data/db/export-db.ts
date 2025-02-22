import Dexie from "dexie";

// Blob to Base64 conversion
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

// Schema fingerprinting function
export const getSchemaFingerprint = (db: Dexie): Record<string, string> => {
  return db.tables.reduce(
    (acc, table) => {
      // use primary key and indices as schema fingerprint
      const tableFingerprint = [
        table.schema.primKey.name,
        ...table.schema.indexes.map((index) => index.name),
      ].join(",");

      acc[table.name] = tableFingerprint;
      return acc;
    },
    {} as Record<string, string>,
  );
};

// Export function
export const exportDatabase = async (db: Dexie) => {
  type ExportData = Record<string, unknown[]> & {
    _meta: {
      schema: Record<string, string>;
      version: number;
      exportedAt: string;
    };
  };

  // @ts-expect-error This is 4o generated code and the ExportData type is terribly vague
  const exportData: ExportData = {
    _meta: {
      schema: getSchemaFingerprint(db),
      version: db.verno,
      exportedAt: new Date().toISOString(),
    },
  };

  await db.transaction("r", db.tables, async () => {
    for (const table of db.tables) {
      exportData[table.name] = await table.toArray();
    }
  });

  // Convert Blobs & Dates for JSON compatibility
  for (const [storeName, records] of Object.entries(exportData)) {
    if (storeName === "_meta") continue;

    // @ts-expect-error This is 4o generated code and the ExportData type is terribly vague
    for (const record of records) {
      for (const key in record) {
        if (record[key] instanceof Date) {
          record[key] = { __date: record[key].toISOString() };
        } else if (record[key] instanceof Blob) {
          record[key] = {
            __blob: await blobToBase64(record[key]),
            type: record[key].type,
          };
        }
      }
    }
  }

  // Download JSON file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${db.name}_dump.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
