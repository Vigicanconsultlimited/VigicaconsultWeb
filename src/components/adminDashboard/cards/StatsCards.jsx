import React from "react";
import Card from "./Card";
import StatCard from "./StatCard";

export default function StatsCards() {
  const statsData = [
    {
      title: "Total Applications",
      value: "51,341",
      percentage: 100,
      change: "+8.2%",
      trend: "up",
      color: "blue",
    },
    {
      title: "Approved Applications",
      value: "3,231",
      percentage: 78,
      change: "+10.5%",
      trend: "up",
      color: "green",
    },
    {
      title: "Rejected Applications",
      value: "1,055",
      percentage: 63,
      change: "-2.3%",
      trend: "down",
      color: "red",
    },
    {
      title: "Pending Applications",
      value: "1,055",
      percentage: 45,
      change: "+5.1%",
      trend: "up",
      color: "yellow",
    },
  ];

  return (
    <div className="stats-cards-container">
      <div className="stats-cards-grid">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}

{
  /*
  import React from "react";
import StatCard from "./StatCard";

// Accept statsData as a prop!
export default function StatsCards({ statsData }) {
  if (!statsData || statsData.length === 0) {
    return <div className="mb-4 p-4">No stats available.</div>;
  }

  return (
    <div className="stats-cards-container">
      <div className="stats-cards-grid">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}

  */
}
