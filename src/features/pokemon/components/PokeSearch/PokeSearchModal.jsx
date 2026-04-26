import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PokeSearch } from "./PokeSearch";

export function PokeSearchModal({
  open,
  onOpenChange,
  title = "Buscar Pokémon",
  description = "Filtra por nombre o tipo y selecciona un Pokémon para añadirlo al equipo.",
  children,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[min(96vw,760px)] max-w-none p-6 sm:max-w-none sm:h-[80vh] sm:max-h-[80vh]"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="h-full min-h-0 overflow-y-auto pr-1">
          {children || <PokeSearch />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
