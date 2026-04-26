import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PokemonSlot({ pokemon, onRemove, isDraggable = true }) {
  if (pokemon) {
    return (
      <div className="relative group">
        <div
          className={cn(
            "aspect-square rounded-xl bg-white border-2 border-(--gray-200) flex items-center justify-center overflow-hidden transition-all duration-300 ease-out shadow-sm",
            isDraggable
              ? "cursor-grab active:cursor-grabbing hover:border-(--blue-500) hover:shadow-lg"
              : "cursor-default",
          )}
        >
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        {isDraggable ? (
          <div className="absolute top-2 left-2 rounded-md bg-white/85 p-0.5 text-(--gray-500) shadow-sm pointer-events-none">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        ) : null}
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onRemove(pokemon.id)}
          className="absolute -top-2 -right-2 w-8 h-8 bg-(--red-500) text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-250 ease-out hover:scale-110 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-xs text-center mt-2 text-(--gray-700) font-semibold capitalize truncate">
          {pokemon.name}
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-square rounded-xl bg-(--gray-50) border border-(--gray-200)" />
  );
}
