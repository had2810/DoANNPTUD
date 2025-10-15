import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-50">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
