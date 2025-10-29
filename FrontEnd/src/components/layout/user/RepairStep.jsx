import {
  Wrench,
  CheckCircle,
  Clock,
  Info,
  UserCheck,
  LifeBuoy,
} from "lucide-react";

const stepIcons = [
  <Info key="1" className="w-7 h-7" />, // 1
  <UserCheck key="2" className="w-7 h-7" />, // 2
  <Wrench key="3" className="w-7 h-7" />, // 3
  <CheckCircle key="4" className="w-7 h-7" />, // 4
  <Clock key="5" className="w-7 h-7" />, // 5
  <LifeBuoy key="6" className="w-7 h-7" />, // 6
];

const stepColors = [
  "from-purple-500 to-purple-300",
  "from-blue-500 to-blue-300",
  "from-pink-500 to-pink-300",
  "from-green-500 to-green-300",
  "from-yellow-500 to-yellow-300",
  "from-cyan-500 to-cyan-300",
];

const RepairStep = ({ number, title, description }) => {
  const icon = stepIcons[number - 1] || <Info className="w-7 h-7" />;
  const color = stepColors[number - 1] || "from-gray-400 to-gray-200";
  return (
    <div
      className={`bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center transition hover:shadow-lg border border-gray-100`}
    >
      <div
        className={`bg-gradient-to-br ${color} rounded-full p-3 mb-3 text-white flex items-center justify-center w-14 h-14 shadow-lg`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-300 mb-2">{number}</div>
      <h3 className="text-lg font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default RepairStep;
