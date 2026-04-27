# Pokémon Battle

**[🔗 Ver demo en vivo →](https://pokemon-battle-1ob.pages.dev/)**

App de gestión de equipos y combates Pokémon construida sobre **React 18.3** y **React Router 6.26**, con un enfoque claro hacia el desacoplamiento entre dominio y vista.

## Arquitectura

El proyecto sigue un planteamiento **Feature-Sliced Design**: cada feature vive aislada en su propia carpeta dentro de `src/features/`, e incluye todo lo que necesita para funcionar (lógica de dominio, estado, hooks, providers, componentes y, cuando aplica, sus propios tests).

```
src/
├── app/              → entrada de la app, layout y router
├── components/ui/    → primitivas reutilizables (shadcn)
├── features/
│   ├── battle/       → lógica de combate
│   ├── pokemon/      → catálogo, búsqueda y detalle de Pokémon
│   └── teams/        → equipos, draft, ordenación, persistencia
├── pages/            → orquestación de features por ruta
└── lib/              → utilidades transversales
```

La regla principal es simple: **el dominio no se mezcla**. Cada módulo expone su API a través de hooks y componentes públicos, y el resto del sistema lo consume sin conocer su interior. La orquestación —es decir, juntar varias features para construir un caso de uso— ocurre exclusivamente en la capa de vista (`pages/`). Una página puede combinar `pokemon` y `teams` para construir el flujo de "añadir Pokémon a un equipo", pero ninguna de las dos features sabe de la existencia de la otra.

Este planteamiento persigue tres cosas:

- **Testing aislado.** El dominio se prueba sin React, los hooks se prueban con mocks acotados, y las páginas se prueban a nivel de integración mockeando las features que no son el foco. El test de `TeamBuilderPage` es un buen ejemplo: mockea `PokeSearch`, `PokemonDetailStep` y `PokemonConfirmStep` para validar la orquestación sin arrastrar dependencias.
- **Escalabilidad.** Añadir una feature nueva no obliga a tocar las existentes. Crece por adición, no por modificación.
- **Mantenimiento.** Como cada módulo es autónomo, cualquier feature puede desenchufarse o reemplazarse sin efectos colaterales en el resto del sistema. La lógica de negocio vive separada de la UI, así que cambiar un componente no rompe reglas de dominio y viceversa.

## Stack

- **Node** ≥ 20
- **React** 18.3.1
- **React Router DOM** 6.26.2
- **Vite** 5
- **TanStack Query** 5 para estado servidor
- **Zustand** 5 para estado cliente
- **Tailwind CSS** 4 + shadcn/ui + Base UI
- **Jest** + Testing Library para los tests
- **pnpm** como gestor de paquetes

## Puesta en marcha

```bash
pnpm install
pnpm dev
```

La app levanta en `http://localhost:5173`.

## Scripts disponibles

```bash
pnpm dev              # servidor de desarrollo
pnpm build            # build de producción
pnpm preview          # sirve el build local
pnpm test             # ejecuta la suite de tests
pnpm lint             # eslint
pnpm format:check     # comprueba formato con prettier
pnpm format:fix       # aplica el formato
pnpm ci:check         # lint + format:check + test
pnpm storybook        # storybook en :6006
```

## Tests

Los tests viven junto al código que cubren. La política es:

- Lógica de dominio → tests unitarios puros (sin React).
- Stores y hooks → tests aislados con mocks mínimos.
- Páginas → tests de integración que validan la orquestación, mockeando las features hijas para no acoplar el test al detalle interno.

Para correr todo:

```bash
pnpm test
```

