import Statistics from "@/components/dashboard/Statistics";
import RecentTickets from "@/components/dashboard/RecentTickets";
import OrderChart from "@/components/dashboard/OrderChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Statistics />
      <OrderChart />
      <RecentTickets />
    </div>
  );
};

export default Dashboard;
