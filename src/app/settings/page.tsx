"use client";

import { Button } from "@/components/ui/button";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import {
  seedAccounts,
  seedPaymentOrders,
  seedScenarios,
} from "@/data/seed/seed";
import { DatabaseIcon } from "lucide-react";
import { db } from "@/data/db";

export default function SettingsPage() {
  const handleDbSeedOnclick = async () => {
    await seedScenarios();
    await seedAccounts();
    await seedPaymentOrders();

    alert("Hotovo!");
  };

  const handleDbDeleteOnClick = async () => {
    if (confirm("Opravdu chcete smazat všechna data?")) {
      await db.delete();
      alert("Hotovo!");
      window.location.reload();
    }
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
            onClick={handleDbSeedOnclick}
          >
            <DatabaseIcon className="h-4 w-4" />
            DB seed
          </Button>

          <Button
            variant={"destructive"}
            size={"lg"}
            onClick={handleDbDeleteOnClick}
          >
            <DatabaseIcon className="h-4 w-4" />
            DB delete
          </Button>
        </div>
      </div>
    </>
  );
}
