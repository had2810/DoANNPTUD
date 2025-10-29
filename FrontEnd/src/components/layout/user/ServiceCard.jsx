import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, CheckCircle2 } from "lucide-react";

const ServiceCard = ({
  title,
  description,
  price,
  features = [],
  image,
  icon,
  link = "/user/booking",
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl hover:border-techmate-purple group flex flex-col">
      {image && (
        <div className="h-44 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-2 text-techmate-purple group-hover:text-techmate-purpleDark transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 text-base flex-1">{description}</p>
        {price && (
          <div className="mb-4 flex items-center gap-2">
            <BadgeDollarSign className="w-5 h-5 text-green-500" />
            <span className="text-lg font-semibold text-green-600">
              {price}
            </span>
          </div>
        )}
        {features && features.length > 0 && (
          <ul className="mb-6 space-y-2">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-techmate-purple" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <Button
          className="w-full bg-gradient-to-r from-techmate-purple to-techmate-purpleDark text-white font-semibold shadow-md hover:from-techmate-purpleDark hover:to-techmate-purple focus:ring-2 focus:ring-techmate-purple focus:ring-offset-2 transition-all"
          asChild
        >
          <Link to={link}>Đặt lịch ngay</Link>
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
