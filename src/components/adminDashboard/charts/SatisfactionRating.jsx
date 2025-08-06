import React from "react";
import { Star } from "lucide-react";

export default function SatisfactionRating() {
  const satisfactionPercentage = 78;
  const ratings = [
    { stars: 5, percentage: 45 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 },
  ];

  return (
    <div className="satisfaction-rating bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Audience Satisfaction
      </h3>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#4c6ef5"
              strokeWidth="8"
              strokeDasharray={`${satisfactionPercentage * 3.39} ${100 * 3.39}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {satisfactionPercentage}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Based on their Rating</p>
          <p className="text-xs text-gray-500">100%</p>
        </div>
      </div>

      <div className="space-y-2">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`${
                    i < rating.stars
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rating.percentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 w-8 text-right">
              {rating.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
