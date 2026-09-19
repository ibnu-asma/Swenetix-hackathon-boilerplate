import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <aside>
        Admin Sidebar
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;