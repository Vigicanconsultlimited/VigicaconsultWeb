import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  percentage,
  change,
  trend,
  color,
}) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className="stat-info">
          <h3 className="stat-title">{title}</h3>
          <div className="stat-value">{value}</div>
        </div>
        <div className="stat-chart">
          <div className="circular-progress">
            <svg className="progress-ring" width="60" height="60">
              <circle
                className="progress-ring-bg"
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                className={`progress-ring-fill ${color}`}
                cx="30"
                cy="30"
                r="25"
                fill="none"
                strokeWidth="4"
                strokeDasharray={`${percentage * 1.57} 157`}
                strokeDashoffset="0"
                transform="rotate(-90 30 30)"
              />
            </svg>
            <div className="progress-text">{percentage}%</div>
          </div>
        </div>
      </div>

      <div className="stat-footer">
        <div className="stat-trend">
          {trend === "up" ? (
            <TrendingUp size={16} className="trend-icon up" />
          ) : (
            <TrendingDown size={16} className="trend-icon down" />
          )}
          <span className={`trend-value ${trend}`}>{change}</span>
        </div>
        <span className="trend-period">vs last month</span>
      </div>
    </div>
  );
}
