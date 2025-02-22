"use client";

import { Button } from "@/components/ui/button";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import {
  seedAccounts,
  seedPaymentOrders,
  seedScenarios,
} from "@/data/seed/seed";
import {
  DatabaseIcon,
  DatabaseZapIcon,
  HardDriveDownloadIcon,
  HardDriveUploadIcon,
} from "lucide-react";
import { client } from "@/data/db/client";
import { exportDatabase } from "@/data/db/export-db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialogStore } from "@/stores/use-dialog.store";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { importDatabase } from "@/data/db/import-db";

export default function SettingsPage() {
  const { openDialog, closeDialog } = useDialogStore();

  const handleDbSeedOnclick = async () => {
    await seedScenarios();
    await seedAccounts();
    await seedPaymentOrders();

    alert("Hotovo!");
  };

  const handleDbDeleteOnClick = async () => {
    if (confirm("Opravdu chcete smazat všechna data?")) {
      await client.delete();
      alert("Hotovo!");
      window.location.reload();
    }
  };

  const handleDbExportOnclick = () => exportDatabase(client);

  const handleDbImportOnclick = () => {
    console.log(`handleDbImportOnclick`);
    openDialog(
      <>
        <DialogHeader>
          <DialogTitle>Importovat databázi</DialogTitle>

          <DialogDescription className="sr-only">
            Vyberte JSON soubor s exportovanou databází
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="db_import">DB Import</Label>
          <Input
            id="db_import"
            type="file"
            placeholder={"DB Import"}
            onChange={async (event) => {
              if (
                event.target instanceof HTMLInputElement &&
                event.target.files &&
                event.target.files.length
              ) {
                await importDatabase(client, event.target.files[0]);
                alert("Hotovo!");
                closeDialog();
              }
            }}
          />
        </div>
      </>,
    );
  };

  return (
    <>
      <div className={"lg:max-w-2xl"}>
        <PageHeader>
          <PageHeaderTitle>Nastavení</PageHeaderTitle>
        </PageHeader>
      </div>

      <div className={"lg:max-w-2xl"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={handleDbExportOnclick}
          >
            <HardDriveDownloadIcon className="h-4 w-4" />
            DB Export
          </Button>

          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={handleDbImportOnclick}
          >
            <HardDriveUploadIcon className="h-4 w-4" />
            DB Import
          </Button>

          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={handleDbSeedOnclick}
          >
            <DatabaseZapIcon className="h-4 w-4" />
            DB Seed
          </Button>

          <Button
            variant={"destructive"}
            size={"lg"}
            onClick={handleDbDeleteOnClick}
          >
            <DatabaseIcon className="h-4 w-4" />
            DB Delete
          </Button>
        </div>
      </div>
    </>
  );
}
