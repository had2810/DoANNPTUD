import Index from "@/pages/user/Index";
import Services from "@/pages/user/Services";
import Booking from "@/pages/user/Booking";
import LookUp from "@/pages/user/LookUp";
import AboutUs from "@/pages/user/AboutUs";
import Login from "@/pages/user/Login";
import Register from "@/pages/user/Register";
import ProfileLayout from "@/pages/user/ProfileLayout";

import AccountInfo from "@/components/layout/user/profile/AccountInfo";
import UpdateAccount from "@/components/layout/user/profile/UpdateAccount";
import BookingOrders from "@/components/layout/user/profile/BookingOrders";
import BookingHistory from "@/components/layout/user/profile/BookingHistory";

export const userRoutes = [
  { path: "", element: <Index /> },
  { path: "services", element: <Services /> },
  { path: "booking", element: <Booking /> },
  { path: "lookup", element: <LookUp /> },
  { path: "about", element: <AboutUs /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },

  {
    path: "profile",
    element: <ProfileLayout />,
    children: [
      { path: "", element: <AccountInfo /> },
      { path: "update", element: <UpdateAccount /> },
      { path: "orders", element: <BookingOrders /> },
      { path: "history", element: <BookingHistory /> },
      { path: "password", element: <div>Chức năng đang phát triển</div> },
    ],
  },
];
