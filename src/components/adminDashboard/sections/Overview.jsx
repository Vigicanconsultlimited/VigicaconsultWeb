import React, { useEffect, useState } from "react";
import { BarChart2, ChevronDown, MoreHorizontal, Star } from "lucide-react";
import apiInstance from "../../../utils/axios";
import "../styles/Overview.css";

// Static (mocked) data for non-API sections
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

export default function Overview() {
  // Current date/time and user (stubbed)
  const getCurrentDateTime = () => "2025-08-08 22:15:43";
  const getCurrentUser = () => "NeduStack";

  // States for API-driven stats
  const [statCards, setStatCards] = useState([
    {
      title: "Total Applications",
      value: "--",
      change: "+0% Inc",
      changePercent: 0,
      color: "blue",
    },
    {
      title: "Approved Applications",
      value: "--",
      change: "+0% Inc",
      changePercent: 0,
      color: "green",
    },
    {
      title: "Rejected Applications",
      value: "--",
      change: "+0% Dec",
      changePercent: 0,
      color: "red",
    },
    {
      title: "Pending Applications",
      value: "--",
      change: "+0% Dec",
      changePercent: 0,
      color: "gray",
    },
  ]);

  const [genderData, setGenderData] = useState({ male: 0, female: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate percentage changes (mock calculation since we don't have historical data)
  const calculateChangePercent = (current, type) => {
    const mockPrevious = {
      total: Math.max(0, current - Math.floor(Math.random() * 5)),
      approved: Math.max(0, current - Math.floor(Math.random() * 3)),
      rejected: Math.max(0, current - Math.floor(Math.random() * 2)),
      pending: Math.max(0, current - Math.floor(Math.random() * 4)),
    };
    const previous = mockPrevious[type] || 1;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Update acquisitions data based on API response
  const updateAcquisitionsData = (apiData) => {
    const total = apiData.totalNumOfApplications || 1; // Avoid division by zero
    return [
      { label: "Applications", color: "blue", value: 100 },
      {
        label: "Pending",
        color: "gray",
        value: Math.round((apiData.pendingApplications / total) * 100),
      },
      {
        label: "Rejected",
        color: "red",
        value: Math.round((apiData.rejectedApplications / total) * 100),
      },
      { label: "On Hold", color: "brown", value: 0 },
      {
        label: "Approved",
        color: "green",
        value: Math.round((apiData.approvedApplications / total) * 100),
      },
    ];
  };

  // Fetch applications summary from API
  useEffect(() => {
    async function fetchApplicationStats() {
      try {
        setLoading(true);
        const response = await apiInstance.get(
          "StudentApplication/allapplications"
        );
        if (response?.data?.statusCode === 200 && response?.data?.result) {
          const {
            totalNumOfApplications = 0,
            approvedApplications = 0,
            rejectedApplications = 0,
            pendingApplications = 0,
            numberOfMale = 0,
            numberOfFemale = 0,
          } = response.data.result;

          const totalChange = calculateChangePercent(
            totalNumOfApplications,
            "total"
          );
          const approvedChange = calculateChangePercent(
            approvedApplications,
            "approved"
          );
          const rejectedChange = calculateChangePercent(
            rejectedApplications,
            "rejected"
          );
          const pendingChange = calculateChangePercent(
            pendingApplications,
            "pending"
          );

          setStatCards([
            {
              title: "Total Applications",
              value: totalNumOfApplications.toLocaleString(),
              change: `${totalChange >= 0 ? "+" : ""}${totalChange}% ${
                totalChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(totalChange), 100),
              color: "blue",
            },
            {
              title: "Approved Applications",
              value: approvedApplications.toLocaleString(),
              change: `${approvedChange >= 0 ? "+" : ""}${approvedChange}% ${
                approvedChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(approvedChange), 100),
              color: "green",
            },
            {
              title: "Rejected Applications",
              value: rejectedApplications.toLocaleString(),
              change: `${rejectedChange >= 0 ? "+" : ""}${rejectedChange}% ${
                rejectedChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(rejectedChange), 100),
              color: "red",
            },
            {
              title: "Pending Applications",
              value: pendingApplications.toLocaleString(),
              change: `${pendingChange >= 0 ? "+" : ""}${pendingChange}% ${
                pendingChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(pendingChange), 100),
              color: "gray",
            },
          ]);

          setGenderData({ male: numberOfMale, female: numberOfFemale });
          setError(null);
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (error) {
        console.error(
          `Overview: Error fetching application stats: ${
            error.message
          } at ${getCurrentDateTime()} by ${getCurrentUser()}`
        );
        setError("Failed to load application statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchApplicationStats();
  }, []);

  // Get updated acquisitions data based on current stats
  const currentAcquisitionsData =
    statCards[0].value !== "--"
      ? updateAcquisitionsData({
          totalNumOfApplications:
            parseInt(statCards[0].value.replace(/,/g, "")) || 1,
          approvedApplications:
            parseInt(statCards[1].value.replace(/,/g, "")) || 0,
          rejectedApplications:
            parseInt(statCards[2].value.replace(/,/g, "")) || 0,
          pendingApplications:
            parseInt(statCards[3].value.replace(/,/g, "")) || 0,
        })
      : acquisitionsData;

  if (loading) {
    return (
      <div className="overview-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading application statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-main">
      {/* Header */}
      <div className="overview-header">
        <h1 className="section-title">Application Overview</h1>
        {error && <div className="error-badge">{error}</div>}
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-row">
        {statCards.map((stat) => (
          <div key={stat.title} className={`stat-card ${stat.color}`}>
            <div className="stat-card-header">
              <span>{stat.title}</span>
              <MoreHorizontal size={16} />
            </div>

            <div className="stat-card-value">{stat.value}</div>

            <div className="stat-card-progress">
              <svg width={50} height={50}>
                <circle
                  cx={25}
                  cy={25}
                  r={20}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={4}
                />
                <circle
                  cx={25}
                  cy={25}
                  r={20}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth={4}
                  strokeDasharray={`${stat.changePercent * 1.25} ${
                    125 - stat.changePercent * 1.25
                  }`}
                  strokeLinecap="round"
                  className="progress-circle"
                />
                <text
                  x="25"
                  y="29"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="rgba(255, 255, 255, 0.9)"
                >
                  {stat.changePercent}%
                </text>
              </svg>
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
              <BarChart2 size={14} />
              <span className="font-semibold">Week</span>
              <ChevronDown size={12} />
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
                        style={{ height: `${(d.application / max) * 100}%` }}
                      />
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
            </div>
          </div>
        </div>

        {/* Application Distribution */}
        <div className="insights-card acquisitions">
          <div className="insights-card-header">
            <span>Application Distribution</span>
            <div className="insights-card-switch">
              <BarChart2 size={14} />
              <span className="font-semibold">Current</span>
              <ChevronDown size={12} />
            </div>
          </div>
          <div className="acquisitions-list">
            {currentAcquisitionsData.map((a) => (
              <div key={a.label} className="acq-row">
                <span className="acq-label">{a.label}</span>
                <div className={`acq-bar ${a.color}`}>
                  <div
                    className={`acq-bar-fill ${a.color}`}
                    style={{ width: `${a.value}%` }}
                  />
                </div>
                <span className={`acq-value ${a.color}`}>{a.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Satisfaction */}
        {/* Audience Satisfaction (REPLACE THIS WHOLE CARD) */}
        <div className="insights-card satisfaction">
          <div className="insights-card-header">
            <span>Audience Satisfaction</span>
            <MoreHorizontal size={18} />
          </div>

          <div className="audience-layout">
            {/* Left: Gauge */}
            <div className="aud-gauge">
              <svg viewBox="0 0 120 60" className="aud-gauge-svg">
                {/* background arc */}
                <path
                  d="M10,55 A50,50 0 0,1 110,55"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* foreground arc */}
                <path
                  d="M10,55 A50,50 0 0,1 110,55"
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="120"
                  strokeDashoffset={120 - satisfaction.percentage}
                />
                {/* number */}
                <text
                  x="60"
                  y="42"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="800"
                  fill="#1976d2"
                >
                  {satisfaction.percentage}%
                </text>
              </svg>

              <span className="aud-gauge-caption">
                0% Based on Star Rating 100%
              </span>
            </div>

            {/* Right: Rows */}
            <div className="aud-rows">
              {satisfaction.stars.map((s) => (
                <div key={s.star} className="aud-row">
                  <span className="aud-label">{s.star} Stars</span>

                  {/* Always render 5 stars horizontally, color first N */}
                  <span className="aud-stars" aria-label={`${s.star} star row`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={18}
                        className={`aud-star ${n <= s.star ? "is-filled" : ""}`}
                      />
                    ))}
                  </span>

                  <span className="aud-votes">
                    {s.votes.toLocaleString()} votes
                  </span>
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
              <MoreHorizontal size={14} />
            </div>

            <div className="analytics-card-value">{a.value}</div>

            <div className="analytics-card-progress">
              <svg width={30} height={30}>
                <circle
                  cx={15}
                  cy={15}
                  r={12}
                  fill="none"
                  stroke="#eee"
                  strokeWidth={3}
                />
                {a.icon === "circle" && (
                  <circle
                    cx={15}
                    cy={15}
                    r={12}
                    fill="none"
                    stroke="#264de4"
                    strokeWidth={3}
                    strokeDasharray={`${a.percent * 0.75} ${
                      75 - a.percent * 0.75
                    }`}
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>

            <div className="analytics-card-change">{a.change}</div>
          </div>
        ))}

        {/* Gender Distribution */}
        <div className="analytics-card gender">
          <div className="analytics-card-header">
            <span>Applicants by Gender</span>
            <MoreHorizontal size={14} />
          </div>

          <div className="gender-bar-chart">
            <div className="gender-bar-col">
              <div
                className="gender-bar-male"
                style={{
                  height: `${
                    genderData.male + genderData.female > 0
                      ? Math.max(
                          (genderData.male /
                            (genderData.male + genderData.female)) *
                            50,
                          2
                        )
                      : 2
                  }px`,
                }}
              />
              <div className="gender-label">Male</div>
              <div className="gender-value">{genderData.male}</div>
            </div>
            <div className="gender-bar-col">
              <div
                className="gender-bar-female"
                style={{
                  height: `${
                    genderData.male + genderData.female > 0
                      ? Math.max(
                          (genderData.female /
                            (genderData.male + genderData.female)) *
                            50,
                          2
                        )
                      : 2
                  }px`,
                }}
              />
              <div className="gender-label">Female</div>
              <div className="gender-value">{genderData.female}</div>
            </div>
          </div>

          <div className="gender-bar-legend">
            <span>
              <span className="legend-dot male"></span> Male
            </span>
            <span>
              <span className="legend-dot female"></span> Female
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
