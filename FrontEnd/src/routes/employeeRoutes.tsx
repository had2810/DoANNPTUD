import Dashboard from "@/pages/employee/Dashboard";
import Customers from "@/components/customers/Customers.jsx";
import Conversations from "@/components/conversations/Conversations.jsx";
import Calls from "@/components/calls/Calls.jsx";
import Orders from "@/components/orders/Order.jsx";
import PersonalSchedule from "@/pages/employee/PersonalSchedule";
import UpdatingView from "@/pages/UpdatingView";

export const employeeRoutes = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "customers", element: <Customers /> },
  { path: "conversations", element: <Conversations /> },
  { path: "calls", element: <Calls /> },
  { path: "unresolved-orders", element: <Orders /> },
  { path: "personal-calendar", element: <PersonalSchedule /> },
  { path: "analytics", element: <UpdatingView /> },
  { path: "settings", element: <UpdatingView /> },
  { path: "help", element: <UpdatingView /> },
];
