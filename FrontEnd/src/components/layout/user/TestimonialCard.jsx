import { Star } from "lucide-react";

const TestimonialCard = ({ name, role, image, stars, testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
      <p className="text-gray-700">{testimonial}</p>
    </div>
  );
};

export default TestimonialCard;
