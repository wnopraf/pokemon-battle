import { AlertTriangle, RotateCw } from "lucide-react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Algo ha fallado";
  let detail = "Ha ocurrido un error inesperado. Prueba a recargar la página.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} · ${error.statusText || "Error"}`;
    if (error.data?.message) detail = error.data.message;
  } else if (error instanceof Error && error.message) {
    detail = error.message;
  }

  const stack =
    import.meta.env.DEV && error instanceof Error ? error.stack : null;

  return (
    <div className="min-h-screen bg-(--gray-100) p-2 md:p-3">
      <div className="flex min-h-[calc(100vh-1rem)] items-center justify-center rounded-2xl border border-(--gray-200) bg-white shadow-sm md:min-h-[calc(100vh-1.5rem)]">
        <div className="mx-auto w-full max-w-md p-6 text-center md:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-(--red-50)">
            <AlertTriangle className="size-6 text-(--red-500)" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-(--gray-900)">{title}</h1>
          <p className="mt-2 text-sm text-(--gray-600)">{detail}</p>

          {stack ? (
            <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-(--gray-50) p-3 text-left text-[10px] leading-snug text-(--gray-500)">
              {stack}
            </pre>
          ) : null}

          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RotateCw className="size-3.5" />
              Recargar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
