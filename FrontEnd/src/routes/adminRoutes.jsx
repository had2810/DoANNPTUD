import Dashboard from "@/pages/admin/Dashboard";
import CustomerList from "@/pages/admin/CustomerList";
import EmployeeList from "@/pages/admin/EmployeeList";
import AppointmentList from "@/pages/admin/AppointmentList";
import ServiceList from "@/pages/admin/ServiceList";
import DeviceTemplateList from "@/pages/admin/deviceTemplateList";
import EmployeeWorkList from "@/pages/admin/EmployeeWorkList";
import RepairStatusList from "@/pages/admin/RepairStatusList";
import UpdatingView from "@/pages/UpdatingView";
import ProfileAdmin from "@/pages/admin/ProfileAdmin";

export const adminRoutes = [
  { path: "", element: <Dashboard /> },
  { path: "customer", element: <CustomerList /> },
  { path: "employee", element: <EmployeeList /> },
  { path: "appointment-list", element: <AppointmentList /> },
  { path: "service", element: <ServiceList /> },
  { path: "device-template", element: <DeviceTemplateList /> },
  { path: "employee-work", element: <EmployeeWorkList /> },
  { path: "repair-status-device", element: <RepairStatusList /> },
  { path: "role", element: <UpdatingView /> },
  { path: "equipment-list", element: <UpdatingView /> },
  { path: "invoice", element: <UpdatingView /> },
  { path: "payment", element: <UpdatingView /> },
  { path: "profile/edit", element: <ProfileAdmin /> },
  { path: "profile/view", element: <ProfileAdmin /> },
  { path: "profile/social", element: <ProfileAdmin /> },
  { path: "billing", element: <ProfileAdmin /> },
];
