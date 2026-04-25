import { Plus, X } from "lucide-react";


export function PokemonSlot({ pokemon, onClick, onRemove, index }) {
  if (pokemon) {
    return (
      <div className="relative group">
        <div className="aspect-square rounded-xl bg-white border-2 border-[var(--gray-200)] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[var(--blue-500)] hover:shadow-lg transition-all shadow-sm">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => onRemove(index)}
          className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--red-500)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-xs text-center mt-2 text-[var(--gray-700)] font-semibold capitalize truncate">
          {pokemon.name}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-xl bg-white border-2 border-dashed border-[var(--gray-300)] flex items-center justify-center hover:border-[var(--blue-500)] hover:bg-[var(--gray-50)] hover:shadow-lg transition-all cursor-pointer group"
    >
      <Plus className="w-10 h-10 text-[var(--gray-400)] group-hover:text-[var(--blue-500)] transition-colors" />
    </button>
  );
}
