import React from "react";
import { BarChart2, ChevronDown, MoreHorizontal, Star } from "lucide-react";
import "../styles/StatsOverview.css";

// Mocked Data
const statCards = [
  {
    title: "Total Applications",
    value: "51,341",
    change: "+14% Inc",
    changePercent: 74,
    color: "blue",
  },
  {
    title: "Approved Applications",
    value: "3,231",
    change: "+07% Inc",
    changePercent: 14,
    color: "green",
  },
  {
    title: "Rejected Applications",
    value: "1,055",
    change: "+04% Dec",
    changePercent: 24,
    color: "red",
  },
  {
    title: "Pending Applications",
    value: "1,055",
    change: "+04% Dec",
    changePercent: 24,
    color: "gray",
  },
];

const breakdownData = [
  { day: "Mon", application: 100, approved: 60, rejected: 30, pending: 10 },
  { day: "Tue", application: 90, approved: 55, rejected: 28, pending: 7 },
  { day: "Wed", application: 95, approved: 65, rejected: 20, pending: 10 },
  { day: "Thur", application: 86, approved: 50, rejected: 25, pending: 11 },
  { day: "Fri", application: 90, approved: 60, rejected: 27, pending: 13 },
  { day: "Sat", application: 92, approved: 62, rejected: 18, pending: 12 },
  { day: "Sun", application: 88, approved: 55, rejected: 22, pending: 11 },
];

const acquisitionsData = [
  { label: "Applications", color: "blue", value: 80 },
  { label: "Pending", color: "gray", value: 67 },
  { label: "Rejected", color: "red", value: 50 },
  { label: "On Hold", color: "brown", value: 25 },
  { label: "Approved", color: "green", value: 24 },
];

const satisfaction = {
  percentage: 78,
  stars: [
    { star: 5, votes: 897 },
    { star: 4, votes: 1243 },
    { star: 3, votes: 97 },
    { star: 2, votes: 40 },
    { star: 1, votes: 8 },
  ],
};

const analytics = [
  {
    title: "Total Site Visitation",
    value: "215,341",
    change: "+14% Inc",
    icon: "up",
  },
  {
    title: "Conversion Rate",
    value: "14%",
    change: "+02% Inc",
    icon: "circle",
    percent: 14,
  },
  {
    title: "Bounce Rate",
    value: "38.67%",
    change: "+27% Dec",
    icon: "up",
  },
];

const genderData = { male: 2324, female: 1893 };

export default function Overview() {
  return (
    <div className="overview-main">
      {/* Stat Cards */}
      <h1
        className="section-title mb-2"
        style={{ color: "#264de4", fontSize: "1.5rem" }}
      >
        Application Overview
      </h1>

      <div className="stat-cards-row">
        {statCards.map((stat, i) => (
          <div key={stat.title} className={`stat-card ${stat.color}`}>
            <div className="stat-card-header">
              <span>{stat.title}</span>
              <MoreHorizontal size={18} />
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-progress">
              {["blue", "green", "red"].includes(stat.color) ? (
                <svg width={54} height={54}>
                  <circle
                    cx={27}
                    cy={27}
                    r={24}
                    fill="none"
                    stroke="#eee"
                    strokeWidth={5}
                  />
                  <circle
                    cx={27}
                    cy={27}
                    r={24}
                    fill="none"
                    stroke={
                      stat.color === "blue"
                        ? "#264de4"
                        : stat.color === "green"
                        ? "#43a047"
                        : "#e53935"
                    }
                    strokeWidth={5}
                    strokeDasharray={`${stat.changePercent * 1.5} ${
                      150 - stat.changePercent * 1.5
                    }`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.3s" }}
                  />
                </svg>
              ) : (
                <svg width={54} height={54}>
                  <circle
                    cx={27}
                    cy={27}
                    r={24}
                    fill="none"
                    stroke="#eee"
                    strokeWidth={5}
                  />
                  <circle
                    cx={27}
                    cy={27}
                    r={24}
                    fill="none"
                    stroke="#bdbdbd"
                    strokeWidth={5}
                    strokeDasharray={`${stat.changePercent * 1.5} ${
                      150 - stat.changePercent * 1.5
                    }`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.3s" }}
                  />
                </svg>
              )}
            </div>
            <div className="stat-card-change">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Application Insights Section */}
      <h2 className="overview-section-title">Application Insights</h2>
      <div className="insights-cards-row">
        {/* Active Applications Breakdown */}
        <div className="insights-card breakdown">
          <div className="insights-card-header">
            <span>Statistics of Active Applications</span>
            <div className="insights-card-switch">
              <BarChart2 size={18} className="text-blue-700" />
              <span className="font-semibold text-blue-700">Week</span>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="breakdown-chart">
            <div className="breakdown-chart-bars">
              {breakdownData.map((d) => {
                const max = 100;
                return (
                  <div key={d.day} className="breakdown-chart-bar-col">
                    <div className="breakdown-chart-bar-stack">
                      <div
                        className="breakdown-bar-app"
                        style={{
                          height: `${(d.application / max) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="breakdown-bar-approved"
                        style={{
                          height: `${(d.approved / max) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="breakdown-bar-rejected"
                        style={{
                          height: `${(d.rejected / max) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="breakdown-bar-pending"
                        style={{
                          height: `${(d.pending / max) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="breakdown-bar-label">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="breakdown-chart-legend">
              <div>
                <span className="legend-dot app"></span> Application
              </div>
              <div>
                <span className="legend-dot approved"></span> Approved
              </div>
              <div>
                <span className="legend-dot rejected"></span> Rejected
              </div>
              <div>
                <span className="legend-dot pending"></span> Pending
              </div>
            </div>
          </div>
        </div>
        {/* Acquisitions */}
        <div className="insights-card acquisitions">
          <div className="insights-card-header">
            <span>Acquisitions</span>
            <div className="insights-card-switch">
              <BarChart2 size={18} className="text-blue-700" />
              <span className="font-semibold text-blue-700">Month</span>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="acquisitions-list">
            {acquisitionsData.map((a) => (
              <div key={a.label} className="acq-row">
                <span className="acq-label">{a.label}</span>
                <div className={`acq-bar ${a.color}`}>
                  <div
                    className={`acq-bar-fill ${a.color}`}
                    style={{ width: `${a.value}%` }}
                  ></div>
                </div>
                <span className={`acq-value ${a.color}`}>{a.value}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Audience Satisfaction */}
        <div className="insights-card satisfaction">
          <div className="insights-card-header">
            <span>Audience Satisfaction</span>
            <MoreHorizontal size={18} />
          </div>
          <div className="audience-satisfaction-content">
            <div className="audience-arc">
              <svg width={120} height={60}>
                <path
                  d="M10,55 A50,50 0 0,1 110,55"
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="10"
                />
                <path
                  d="M10,55 A50,50 0 0,1 110,55"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="10"
                  strokeDasharray="120"
                  strokeDashoffset={120 - satisfaction.percentage}
                />
                <text
                  x="60"
                  y="45"
                  textAnchor="middle"
                  fontSize="2rem"
                  fontWeight="bold"
                  fill="#1976d2"
                >
                  {satisfaction.percentage}%
                </text>
              </svg>
              <span className="audience-arc-caption">
                0%&nbsp;Based on Star Rating&nbsp;100%
              </span>
            </div>
            <div className="audience-stars">
              {satisfaction.stars.map((s) => (
                <div key={s.star} className="audience-stars-row">
                  <span className="audience-star-label">{s.star} Stars</span>
                  <span>
                    {[...Array(s.star)].map((_, i) => (
                      <Star key={i} size={18} className="star-yellow" />
                    ))}
                  </span>
                  <span className="audience-votes">{s.votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Site Analytics */}
      <h2 className="overview-section-title">Site Analytics</h2>
      <div className="analytics-cards-row">
        {analytics.map((a) => (
          <div key={a.title} className="analytics-card">
            <div className="analytics-card-header">
              <span>{a.title}</span>
              <MoreHorizontal size={18} />
            </div>
            <div className="analytics-card-value">{a.value}</div>
            <div className="analytics-card-progress">
              {a.icon === "up" ? (
                <svg width={34} height={34}>
                  <circle
                    cx={17}
                    cy={17}
                    r={15}
                    fill="none"
                    stroke="#eee"
                    strokeWidth={5}
                  />
                  <path
                    d="M17 2 A15 15 0 1 1 16.99 2"
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth={5}
                  />
                </svg>
              ) : (
                <svg width={34} height={34}>
                  <circle
                    cx={17}
                    cy={17}
                    r={15}
                    fill="none"
                    stroke="#eee"
                    strokeWidth={5}
                  />
                  <circle
                    cx={17}
                    cy={17}
                    r={15}
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth={5}
                    strokeDasharray={`${a.percent * 1.5} ${
                      47 - a.percent * 1.5
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div className="analytics-card-change">{a.change}</div>
          </div>
        ))}
        <div className="analytics-card gender">
          <div className="analytics-card-header">
            <span>Applicants by Gender</span>
            <MoreHorizontal size={18} />
          </div>
          <div className="gender-bar-chart">
            <div className="gender-bar-col">
              <div
                className="gender-bar-male"
                style={{
                  height: `${
                    (genderData.male / (genderData.male + genderData.female)) *
                    70
                  }px`,
                }}
              ></div>
              <div className="gender-label">Male</div>
              <div className="gender-value">{genderData.male}</div>
            </div>
            <div className="gender-bar-col">
              <div
                className="gender-bar-female"
                style={{
                  height: `${
                    (genderData.female /
                      (genderData.male + genderData.female)) *
                    70
                  }px`,
                }}
              ></div>
              <div className="gender-label">Female</div>
              <div className="gender-value">{genderData.female}</div>
            </div>
            <div className="gender-bar-legend">
              <span className="legend-dot male"></span> Male
              <span className="legend-dot female"></span> Female
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
