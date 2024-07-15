'use client';
import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "./ui/dialog";
import { useModal } from "./providers/modal-provider";
import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
  children: ReactNode
}

export default function CustomModal({ children }: Props) {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setClose}
    >
      <DialogContent className="overflow-auto md:max-h-[700px] bg-card" >
        <DialogTitle className="hidden">
          Modal
        </DialogTitle>
        <DialogDescription className="hidden">
          Description
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  )
}
