import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Login from "@/pages/user/Login";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/user/ResetPassword";
import NotFound from "@/pages/NotFound";

import { AdminLayout } from "@/components/layout/AdminLayout";
import UserLayout from "@/components/layout/UserLayout";
import RequireAdmin from "@/components/RequireAdmin";

// Route tách riêng
import { adminRoutes } from "@/routes/adminRoutes";
import { userRoutes } from "@/routes/userRoutes";

const queryClient = new QueryClient();

const renderRoutes = (routes) =>
  routes.map(({ path, element, children }, idx) => (
    <Route key={idx} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </RequireAdmin>
            }
          >
            {adminRoutes.map(({ path, element }, idx) => (
              <Route key={idx} path={path} element={element} />
            ))}
          </Route>

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            {renderRoutes(userRoutes)}
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
