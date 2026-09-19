import { Outlet } from "react-router-dom";

function StudentLayout() {
  return (
    <div>
      <aside>
        Student Sidebar
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;