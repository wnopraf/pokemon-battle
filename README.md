# Pokémon Battle

**[🔗 Ver demo en vivo →](https://combatpokemon.netlify.app/)**

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

## Decisiones técnicas y trade-offs

### Error boundaries: React Router `errorElement` vs `react-error-boundary`

**Decisión:** Usar `errorElement` de React Router v6.4+ en lugar de `react-error-boundary`.

**Razón:** React Router 6.4 introdujo soporte nativo para error boundaries a nivel de ruta. Esto permite:
- Declarar el error boundary directamente en la definición de ruta
- Acceso automático a `useRouteError` para obtener información del error
- Integración con el sistema de navegación sin componentes wrapper adicionales

**Trade-off:** `react-error-boundary` ofrece más flexibilidad (fallbacks declarativos, recovery strategies), pero para este caso el `errorElement` nativo es suficiente y reduce una dependencia.

### Lazy loading: nivel de ruta vs componente individual

**Decisión:** Implementar lazy loading a nivel de ruta usando la propiedad `lazy` de React Router.

**Razón:**
- Reduce el bundle inicial de ~572KB a ~395KB (main chunk) + chunks más pequeños por ruta
- Evita warnings de Fast Refresh que aparecen al mezclar `React.lazy()` con named exports
- La API `lazy` de React Router es el patrón recomendado para v6.4+

**Implementación:**
```jsx
const BattlePage = lazy(() => import('./pages/BattlePage'))
<Route path="/battle" element={<BattlePage />} lazy />
```

**Trade-off:** Carga inicial más rápida, pero navegación entre rutas tiene un pequeño delay al cargar el chunk. Mitigado con Suspense fallback (`PageLoader`).

### Retry en errores de PokeAPI

**Decisión:** Añadir botones de retry en todos los estados de error de PokeAPI usando `refetch` de react-query.

**Razón:** PokeAPI es un servicio externo que puede fallar temporalmente. Dar al usuario la opción de reintentar mejora la UX sin necesidad de recargar la página.

**Implementación:**
- Exponer `refetch` desde los hooks `usePokemonSearch`, `usePokemonDetail`, etc.
- Añadir botón "Reintentar" en componentes `PokeSearch`, `PokemonDetailStep`, `PokemonConfirmStep`

**Trade-off:** Añade complejidad mínima a los hooks (exponer `refetch`), pero el beneficio en UX supera el coste.

### Testing: pirámide de tests + fixtures deterministas

**Decisión:** Estrategia de testing en tres niveles con fixtures y mocks para PokeAPI.

**Niveles:**
1. **Unitarios:** Lógica de dominio pura (`battle.logic.test.js`)
2. **Integración:** Hooks y componentes aislados con mocks acotados
3. **E2E:** Flujos completos con Playwright y mocks de PokeAPI

**Razón:** Permite detectar errores en diferentes capas sin depender de API externa. Los mocks de PokeAPI en `e2e/fixtures/pokeapi-mocks.js` garantizan tests deterministas.

**Trade-off:** Mantener los mocks sincronizados con la API real requiere esfuerzo, pero evita tests flaky y permite ejecutar tests offline.

### Estado: Zustand (cliente) + TanStack Query (servidor)

**Decisión:** Zustand para estado cliente (equipos, historial de batallas), TanStack Query para estado servidor (PokeAPI).

**Razón:**
- Zustand es simple, no requiere providers, y es ideal para estado global mutable
- TanStack Query maneja caching, deduping, y revalidación automática de datos servidor

**Trade-off:** Dos librerías de estado en lugar de una, pero cada una optimizada para su caso de uso.

### Arquitectura: Feature-Sliced Design

**Decisión:** Estructura por features en lugar de por tipo de archivo.

**Razón:**
- Cada feature es autónoma (dominio, estado, hooks, componentes, tests)
- La orquestación ocurre en `pages/`, no en las features
- Facilita testing aislado y escalabilidad

**Trade-off:** Puede haber duplicación de código entre features si comparten lógica, pero esto se mitige con utilidades en `lib/`.

