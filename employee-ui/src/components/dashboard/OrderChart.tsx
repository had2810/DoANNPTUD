import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";

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
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock data demo
const mockMonthData = [
  { month: "Jan", orders: 0, cancelled: 0 },
  { month: "Feb", orders: 0, cancelled: 0 },
  { month: "Mar", orders: 0, cancelled: 0 },
  { month: "Apr", orders: 0, cancelled: 0 },
  { month: "May", orders: 7, cancelled: 0 },
  { month: "Jun", orders: 0, cancelled: 0 },
  { month: "Jul", orders: 0, cancelled: 0 },
  { month: "Aug", orders: 0, cancelled: 0 },
  { month: "Sep", orders: 0, cancelled: 0 },
  { month: "Oct", orders: 0, cancelled: 0 },
  { month: "Nov", orders: 0, cancelled: 0 },
  { month: "Dec", orders: 0, cancelled: 0 },
];
const mockWeekData = [
  { day: "Mon", orders: 2, cancelled: 0 },
  { day: "Tue", orders: 1, cancelled: 0 },
  { day: "Wed", orders: 0, cancelled: 0 },
  { day: "Thu", orders: 0, cancelled: 0 },
  { day: "Fri", orders: 0, cancelled: 0 },
  { day: "Sat", orders: 0, cancelled: 0 },
  { day: "Sun", orders: 0, cancelled: 0 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = (props: any) => {
  const { active, payload, label, tab } = props;
  if (active && payload && payload.length) {
    let labelText = "";
    if (tab === "month") {
      const idx = MONTHS.findIndex((m) => m === label);
      labelText = `${MONTHS[idx] || label}`;
    } else {
      labelText = label;
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

const OrderChart = () => {
  const [tab, setTab] = useState("month");
  const data = tab === "month" ? mockMonthData : mockWeekData;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold">Biểu đồ đơn hàng</h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${
                tab === "month" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setTab("month")}
            >
              Tháng
            </button>
            <button
              className={`px-3 py-1 rounded ${
                tab === "week" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setTab("week")}
            >
              Tuần
            </button>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={tab === "month" ? "month" : "day"} />
              <YAxis />
              <CartesianGrid stroke="#EEE" strokeDasharray="5 5" />
              <Area
                type="monotone"
                dataKey="orders"
                name="Đơn hàng"
                stroke="#3b82f6"
                fill="url(#colorOrders)"
              />
              <Area
                type="monotone"
                dataKey="cancelled"
                name="Đơn hủy"
                stroke="#ef4444"
                fill="url(#colorCancelled)"
              />
              <RechartsTooltip
                content={(props) => <CustomTooltip {...props} tab={tab} />}
              />
              <Legend content={<CustomLegend />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderChart;
