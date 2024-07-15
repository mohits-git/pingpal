'use client';
import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { useModal } from "./providers/modal-provider";

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
        {children}
      </DialogContent>
    </Dialog>
  )
}
