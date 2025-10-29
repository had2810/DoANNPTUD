import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Conversations from "@/components/conversations/Conversations";
import Customers from "@/components/customers/Customers";
import Calls from "@/components/calls/Calls";
import Orders from "@/components/orders/Order";
import PersonalSchedule from "@/pages/PersonalSchedule";
import WeeklyScheduleRegistration from "@/components/schedule/WeeklyScheduleRegistration";
import RepairStatusList from "@/components/orders/RepairStatusList";

const EmployeeRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="unresolved-orders" element={<Orders />} />
      <Route path="customers" element={<Customers />} />
      <Route path="conversations" element={<Conversations />} />
      <Route path="calls" element={<Calls />} />
      <Route path="personal-calendar" element={<PersonalSchedule />} />
      <Route path="weekly-schedule" element={<WeeklyScheduleRegistration />} />
      <Route path="repair-status" element={<RepairStatusList />} />
      <Route
        path="analytics"
        element={
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Analytics dashboard coming soon
          </div>
        }
      />
      <Route
        path="settings"
        element={
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Settings panel coming soon
          </div>
        }
      />
      <Route
        path="help"
        element={
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Help documentation coming soon
          </div>
        }
      />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default EmployeeRouter;
