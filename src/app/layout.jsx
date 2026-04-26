import {
  ArrowLeft,
  Bolt,
  Flame,
  History,
  LayoutGrid,
  Moon,
  User,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import pokeBallIcon from "@/assets/poke-ball.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDraftSaveWithFeedback } from "@/features/teams/hooks/useDraftSaveWithFeedback";
import { useTeamsStore } from "@/features/teams/teams.store";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { to: "/teams", label: "Equipos", icon: LayoutGrid },
  { to: "/battle", label: "Combate", icon: Bolt },
  { to: "/dev", label: "Historial", icon: History },
];

const secondaryNavItems = [{ label: "Perfil", icon: User }];

export default function AppLayout() {
  const draftTeam = useTeamsStore((s) => s.draftTeam);
  const clearDraft = useTeamsStore((s) => s.clearDraft);
  const { canSaveDraft, saveWithFeedback } = useDraftSaveWithFeedback();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const showBackButton = !["/", "/teams", "/battle", "/dev"].includes(pathname);
  const isCreatingTeam = pathname === "/teams/new";
  const hasDraftChanges =
    Boolean(draftTeam?.name?.trim()) || (draftTeam?.pokemons?.length ?? 0) > 0;

  const handleBack = () => {
    if (isCreatingTeam && hasDraftChanges) {
      setIsDiscardDialogOpen(true);
      return;
    }

    if (pathname.startsWith("/teams/")) {
      navigate("/teams");
      return;
    }

    if (pathname.startsWith("/battle/")) {
      navigate("/battle");
      return;
    }

    navigate(-1);
  };

  const handleConfirmDiscardDraft = () => {
    clearDraft();
    setIsDiscardDialogOpen(false);
    navigate("/teams");
  };

  const handleSaveAndExitDraft = () => {
    const wasSaved = saveWithFeedback();
    if (!wasSaved) return;

    setIsDiscardDialogOpen(false);
    navigate("/teams");
  };

  return (
    <div className="min-h-screen bg-(--gray-100) p-2 md:p-3">
      <div className="flex min-h-[calc(100vh-1rem)] rounded-2xl border border-(--gray-200) bg-white shadow-sm md:min-h-[calc(100vh-1.5rem)]">
        <aside className="hidden w-[220px] border-r border-(--gray-200) bg-white px-3 py-4 md:flex md:flex-col">
          <div className="mb-5 flex items-center gap-2 px-2">
            <img src={pokeBallIcon} alt="PokeBattle" className="size-5" />
            <p className="text-sm font-semibold text-(--gray-900)">
              PokeBattle
            </p>
          </div>

          <nav className="space-y-1">
            {mainNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-(--blue-50) text-(--blue-600)"
                      : "text-(--gray-500) hover:bg-(--gray-50) hover:text-(--gray-700)",
                  )
                }
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-2 space-y-1">
            {secondaryNavItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="flex w-full cursor-default items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-(--gray-500)"
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-(--gray-200) px-3 py-2 text-xs text-(--gray-600)"
            >
              <span className="inline-flex items-center gap-2">
                <Moon className="size-3.5" />
                Tema claro
              </span>
              <span className="text-(--gray-400)">^</span>
            </button>

            <div className="flex items-center justify-between rounded-lg border border-(--gray-200) px-3 py-2">
              <div className="flex items-center gap-2">
                <UserCircle2 className="size-4 text-(--red-500)" />
                <div>
                  <p className="text-xs font-medium text-(--gray-700)">
                    Entrenador
                  </p>
                  <p className="text-[10px] text-(--gray-500)">Nivel 25</p>
                </div>
              </div>
              <Flame className="size-3.5 text-(--blue-500)" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-(--gray-50) p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-5xl">
            {showBackButton ? (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-(--gray-600) transition-colors hover:bg-(--gray-100) hover:text-(--gray-800)"
                >
                  <ArrowLeft className="size-3.5" />
                  Volver
                </button>
              </div>
            ) : null}
            <Outlet />
          </div>
        </main>
      </div>

      <Dialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Descartar borrador</DialogTitle>
            <DialogDescription>
              Tienes cambios sin guardar en el equipo. Si sales ahora, se
              perderán.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDiscardDialogOpen(false)}
            >
              Seguir editando
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!canSaveDraft}
              onClick={handleSaveAndExitDraft}
            >
              Guardar y salir
            </Button>
            <Button type="button" onClick={handleConfirmDiscardDraft}>
              Descartar borrador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
