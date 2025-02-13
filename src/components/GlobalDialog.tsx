"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDialogStore } from "@/stores/use-dialog.store";

export function GlobalDialog() {
  const { isOpen, content, closeDialog } = useDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}
