import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import EmployeeLayout from "@/components/EmployeeLayout";
import NotFound from "./pages/NotFound";
import RequireEmployee from "./components/RequireEmployee";
import Login from "./pages/Login";
import UnresolvedOrders from "./components/orders/UnresolvedOrders";
import EmployeeRouter from "@/routers/EmployeeRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Route yêu cầu login */}
          <Route path="/login" element={<Login />} />
          {/* Route yêu cầu login + role là nhân viên */}
          <Route
            path="/"
            element={
              <RequireEmployee>
                <EmployeeLayout />
              </RequireEmployee>
            }
          >
            <Route path="dashboard" element={<EmployeeRouter />} />
            <Route path="unresolved-orders" element={<EmployeeRouter />} />
            <Route path="customers" element={<EmployeeRouter />} />
            <Route path="conversations" element={<EmployeeRouter />} />
            <Route path="calls" element={<EmployeeRouter />} />
            <Route path="personal-calendar" element={<EmployeeRouter />} />
            <Route path="weekly-schedule" element={<EmployeeRouter />} />
            <Route path="analytics" element={<EmployeeRouter />} />
            <Route path="settings" element={<EmployeeRouter />} />
            <Route path="help" element={<EmployeeRouter />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="/orders/:orderId" element={<UnresolvedOrders />} />
          {/* Route mặc định khi không khớp */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
