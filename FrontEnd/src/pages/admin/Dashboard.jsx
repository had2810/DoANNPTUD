import {
  ArrowDown,
  ArrowUp,
  Package,
  CheckCircle2,
  XCircle,
  User2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import appointmentService from "@/services/appointmentService";
import customerService from "@/services/customerService";

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Tổng đơn hàng",
      amount: "0",
      change: "0%",
      isPositive: true,
      icon: Package,
    },
    {
      title: "Đơn hoàn thành",
      amount: "0",
      change: "0%",
      isPositive: true,
      icon: CheckCircle2,
    },
    {
      title: "Đơn đã hủy",
      amount: "0",
      change: "0%",
      isPositive: false,
      icon: XCircle,
    },
    {
      title: "Khách hàng",
      amount: "0",
      change: "0%",
      isPositive: true,
      icon: User2,
    },
  ]);
  const [orderByMonth, setOrderByMonth] = useState([]);
  const [orderByWeek, setOrderByWeek] = useState([]);
  const [tab, setTab] = useState("month");
  const [incomeByWeek, setIncomeByWeek] = useState([]);
  const [totalIncomeWeek, setTotalIncomeWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  // Tên tháng tiếng Anh
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Tên thứ tiếng Anh
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy danh sách đơn hàng
        const appointmentsResponse = await appointmentService.getAppointments();
        const appointments = appointmentsResponse.data;

        // Lấy danh sách khách hàng
        const customersResponse = await customerService.getAllCustomers();
        const customers = customersResponse;

        // Lấy tháng hiện tại
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Lọc đơn hàng trong tháng hiện tại (dùng appointmentTime)
        const appointmentsThisMonth = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.appointmentTime);
          return (
            appointmentDate.getMonth() === currentMonth &&
            appointmentDate.getFullYear() === currentYear
          );
        });

        // Lọc khách hàng mới trong tháng
        const customersThisMonth = customers.filter((customer) => {
          const customerDate = new Date(customer.createdAt);
          return (
            customerDate.getMonth() === currentMonth &&
            customerDate.getFullYear() === currentYear
          );
        });

        // Tính toán số liệu
        const totalOrders = appointmentsThisMonth.length;
        const completedOrders = appointmentsThisMonth.filter(
          (a) => a.status === "confirmed"
        ).length;
        const cancelledOrders = appointmentsThisMonth.filter(
          (a) => a.status === "cancelled"
        ).length;
        const totalCustomers = customersThisMonth.length;

        // Tính số cao nhất của từng loại
        const highestOrders = appointments.length;
        const highestCompleted = appointments.filter(
          (a) => a.status === "confirmed"
        ).length;
        const highestCancelled = appointments.filter(
          (a) => a.status === "cancelled"
        ).length;
        const highestCustomers = customers.length;

        // Cập nhật state
        setStats([
          {
            title: "Tổng đơn hàng",
            amount: totalOrders.toString(),
            change: "+12%",
            isPositive: true,
            icon: Package,
            highest: highestOrders,
          },
          {
            title: "Đơn hoàn thành",
            amount: completedOrders.toString(),
            change: "+8%",
            isPositive: true,
            icon: CheckCircle2,
            highest: highestCompleted,
          },
          {
            title: "Đơn đã hủy",
            amount: cancelledOrders.toString(),
            change: "-5%",
            isPositive: true,
            icon: XCircle,
            highest: highestCancelled,
          },
          {
            title: "Khách hàng",
            amount: totalCustomers.toString(),
            change: "+15%",
            isPositive: true,
            icon: User2,
            highest: highestCustomers,
          },
        ]);

        // Tính số lượng đơn hàng và đơn bị hủy theo từng tháng trong năm hiện tại (dùng appointmentTime)
        const ordersPerMonth = Array(12).fill(0);
        const cancelledPerMonth = Array(12).fill(0);
        appointments.forEach((a) => {
          const d = new Date(a.appointmentTime);
          if (d.getFullYear() === currentYear) {
            ordersPerMonth[d.getMonth()]++;
            if (a.status === "cancelled") cancelledPerMonth[d.getMonth()]++;
          }
        });
        // Tạo dữ liệu cho biểu đồ tháng
        const chartData = ordersPerMonth.map((value, idx) => ({
          month: `T${idx + 1}`,
          orders: value,
          cancelled: cancelledPerMonth[idx],
        }));
        setOrderByMonth(chartData);

        // Tính số lượng đơn hàng và đơn bị hủy theo từng ngày trong tuần hiện tại (dùng appointmentTime)
        const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
        const ordersPerDay = Array(7).fill(0);
        const cancelledPerDay = Array(7).fill(0);
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Đầu tuần (T2)
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          appointments.forEach((a) => {
            const d = new Date(a.appointmentTime);
            if (
              d.getFullYear() === day.getFullYear() &&
              d.getMonth() === day.getMonth() &&
              d.getDate() === day.getDate()
            ) {
              ordersPerDay[i]++;
              if (a.status === "cancelled") cancelledPerDay[i]++;
            }
          });
        }
        const chartDataWeek = days.map((day, idx) => ({
          day,
          orders: ordersPerDay[idx],
          cancelled: cancelledPerDay[idx],
        }));
        setOrderByWeek(chartDataWeek);

        // Tính tổng thu nhập từng ngày trong tuần hiện tại (dùng appointmentTime, chỉ tính đơn không bị hủy)
        const incomePerDay = Array(7).fill(0);
        let totalIncome = 0;
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          appointments.forEach((a) => {
            const d = new Date(a.appointmentTime);
            if (
              d.getFullYear() === day.getFullYear() &&
              d.getMonth() === day.getMonth() &&
              d.getDate() === day.getDate() &&
              a.status !== "cancelled"
            ) {
              incomePerDay[i] += a.estimatedCost || 0;
              totalIncome += a.estimatedCost || 0;
            }
          });
        }
        const incomeChartData = days.map((day, idx) => ({
          name: day,
          value: incomePerDay[idx],
        }));
        setIncomeByWeek(incomeChartData);
        setTotalIncomeWeek(totalIncome);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Lấy tab từ scope
      const isMonth = tab === "month";
      let labelText = "";
      if (isMonth) {
        // label là 'T1', 'T2', ...
        const idx = parseInt(label.replace("T", "")) - 1;
        labelText = `${MONTHS[idx] || label}`;
      } else {
        // label là 'T2', 'T3', ..., 'CN'
        const map = {
          T2: "Mon",
          T3: "Tue",
          T4: "Wed",
          T5: "Thu",
          T6: "Fri",
          T7: "Sat",
          CN: "Sun",
        };
        labelText = `${map[label] || label}`;
      }
      return (
        <div className="custom-tooltip bg-white p-3 shadow-lg rounded-md border border-gray-200">
          <div className="font-semibold mb-2 text-base text-gray-800">
            {labelText}
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-medium">{entry.name}: </span>
              <span className="text-sm font-semibold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend cho biểu đồ
  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "flex",
          gap: 32,
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 18,
                backgroundColor: entry.color,
                marginRight: 8,
                borderRadius: 3,
              }}
            />
            <span style={{ color: "#222" }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan về tình hình kinh doanh của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          // Đặt màu cho từng icon
          let iconColor = "";
          if (stat.title === "Tổng đơn hàng")
            iconColor = "#3b82f6"; // xanh dương
          else if (stat.title === "Đơn hoàn thành")
            iconColor = "#22c55e"; // xanh lá
          else if (stat.title === "Đơn đã hủy") iconColor = "#ef4444"; // đỏ
          else if (stat.title === "Khách hàng") iconColor = "#f59e42"; // vàng cam
          return (
            <Card
              key={index}
              className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </span>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Icon className="w-5 h-5" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="mt-1">
                    <p className="text-2xl font-bold mb-1">{stat.amount}</p>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium flex items-center ${
                          stat.isPositive
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }`}
                      >
                        {stat.isPositive ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stat.change} so với tháng trước
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
                    <span className="text-blue-600 font-medium">
                      {stat.highest}
                    </span>{" "}
                    tổng số
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold">Biểu đồ đơn hàng</h3>
                <Tabs
                  value={tab}
                  onValueChange={setTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="month">Tháng</TabsTrigger>
                    <TabsTrigger value="week">Tuần</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="h-[500px] px-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-gray-400">
                    Đang tải dữ liệu...
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={tab === "month" ? orderByMonth : orderByWeek}
                    margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorOrders"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCancelled"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey={tab === "month" ? "month" : "day"}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      tickFormatter={(value) => {
                        if (tab === "month") {
                          // value dạng 'T1', 'T2', ...
                          const idx = parseInt(value.replace("T", "")) - 1;
                          return MONTHS[idx] || value;
                        } else {
                          // value dạng 'T2', 'T3', ..., 'CN'
                          const map = {
                            T2: "Mon",
                            T3: "Tue",
                            T4: "Wed",
                            T5: "Thu",
                            T6: "Fri",
                            T7: "Sat",
                            CN: "Sun",
                          };
                          return map[value] || value;
                        }
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                      tickFormatter={(value) => (value === 0 ? "0" : value)}
                    />
                    <CartesianGrid
                      vertical={false}
                      stroke="#EEE"
                      strokeDasharray="5 5"
                      strokeOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      name="Đơn hàng"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                    <Area
                      type="monotone"
                      dataKey="cancelled"
                      name="Đơn hủy"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCancelled)"
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Tổng Quan Thu Nhập</h3>
              <div className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                Tuần này
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-pulse text-gray-400">
                  Đang tải dữ liệu...
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(totalIncomeWeek)}
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                    <div className="flex items-center text-sm text-emerald-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span>+8.2% so với tuần trước</span>
                    </div>
                  </div>
                </div>

                <div className="h-[250px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={incomeByWeek}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                        tickFormatter={(value) => {
                          const map = {
                            T2: "Mon",
                            T3: "Tue",
                            T4: "Wed",
                            T5: "Thu",
                            T6: "Fri",
                            T7: "Sat",
                            CN: "Sun",
                          };
                          return map[value] || value;
                        }}
                      />
                      <YAxis hide={true} domain={[0, "dataMax + 100000"]} />
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: "#666" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #eee",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <CartesianGrid
                        stroke="#f0f0f0"
                        vertical={false}
                        strokeDasharray="3 3"
                      />
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        fill="#3b82f6"
                        barSize={30}
                        name="Thu nhập"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Ngày cao nhất</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(
                        Math.max(...incomeByWeek.map((item) => item.value))
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">
                      Trung bình/ngày
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(totalIncomeWeek / 7)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
