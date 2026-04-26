import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PokeSearch } from "./PokeSearch";

export function PokeSearchModal({ open, onOpenChange, onSelectPokemon }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6" showCloseButton>
        <DialogHeader>
          <DialogTitle>Buscar Pokémon</DialogTitle>
          <DialogDescription>
            Filtra por nombre o tipo y selecciona un Pokémon para añadirlo al equipo.
          </DialogDescription>
        </DialogHeader>

        <PokeSearch onSelectPokemon={onSelectPokemon} />
      </DialogContent>
    </Dialog>
  );
}
