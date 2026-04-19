import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-white border-r p-4">
        <nav className="flex flex-col gap-2">
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/battle">Battle</NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
