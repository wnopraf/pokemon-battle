import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { PokeSearch } from "./PokeSearch";

export function PokeSearchModal({
  open,
  onOpenChange,
  title = "Buscar Pokémon",
  description = "Filtra por nombre o tipo y selecciona un Pokémon para añadirlo al equipo.",
  size = "search",
  children,
}) {
  const contentClassName = {
    search:
      "w-[min(96vw,880px)] max-w-none gap-6 p-5 sm:max-w-none sm:h-[84vh] sm:max-h-[84vh] sm:p-7 lg:p-8",
    detail:
      "w-[min(96vw,640px)] max-w-none gap-5 p-4.5 sm:max-w-none sm:h-[78vh] sm:max-h-[78vh] sm:p-5 lg:p-5.5",
    confirm: "w-[min(92vw,560px)] gap-5 p-5 sm:max-w-lg sm:p-6",
  };

  const isConfirmStep = size === "confirm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={contentClassName[size] ?? contentClassName.search}
        showCloseButton
      >
        <DialogHeader
          className={cn(
            "pr-10",
            isConfirmStep ? "max-w-lg gap-2" : "max-w-2xl gap-3",
          )}
        >
          <DialogTitle className="text-lg leading-tight sm:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            isConfirmStep ? "overflow-visible" : "h-full min-h-0 overflow-hidden",
          )}
        >
          {children || <PokeSearch />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
