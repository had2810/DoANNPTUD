import { Check } from "lucide-react";

const ServiceFeature = ({ text }) => {
  return (
    <div className="flex items-center gap-2">
      <Check className="w-4 h-4 text-techmate-purple" />
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
};

export default ServiceFeature;
