import { Smartphone, Laptop, Wrench, Tv } from "lucide-react";

const getIcon = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("điện thoại"))
    return <Smartphone className="w-6 h-6 text-techmate-purple/70" />;
  if (lower.includes("laptop"))
    return <Laptop className="w-6 h-6 text-blue-400/70" />;
  if (
    lower.includes("thiết bị điện tử") ||
    lower.includes("tivi") ||
    lower.includes("máy tính")
  )
    return <Tv className="w-6 h-6 text-yellow-400/70" />;
  return <Wrench className="w-6 h-6 text-techmate-purple/70" />;
};

const ServiceCategory = ({ title, children }) => {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-center gap-2 mb-4">
        {getIcon(title)}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
    </section>
  );
};

export default ServiceCategory;
