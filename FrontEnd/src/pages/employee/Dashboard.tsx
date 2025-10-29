import Statistics from "@/components/dashboard/Statistics.jsx";
import RecentTickets from "@/components/dashboard/RecentTickets.jsx";
import OrderChart from "@/components/dashboard/OrderChart.jsx";

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
