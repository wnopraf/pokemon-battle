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
        className="w-[min(96vw,880px)] max-w-none gap-6 p-5 sm:max-w-none sm:h-[84vh] sm:max-h-[84vh] sm:p-7 lg:p-8"
        showCloseButton
      >
        <DialogHeader className="max-w-2xl gap-3 pr-10">
          <DialogTitle className="text-lg leading-tight sm:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="h-full min-h-0 overflow-hidden">
          {children || <PokeSearch />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
