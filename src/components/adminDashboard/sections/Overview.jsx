import React, { useEffect, useState } from "react";
import { BarChart2, ChevronDown, MoreHorizontal, Star } from "lucide-react";
import apiInstance from "../../../utils/axios";
<<<<<<< HEAD
import "../styles/StatsOverview.css";
=======
import "../styles/Overview.css";
>>>>>>> main

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

<<<<<<< HEAD
const genderData = { male: 2324, female: 1893 };

export default function Overview() {
=======
export default function Overview() {
  // Current date/time and user as specified
  const getCurrentDateTime = () => {
    return "2025-08-08 22:15:43";
  };

  const getCurrentUser = () => {
    return "NeduStack";
  };

>>>>>>> main
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

<<<<<<< HEAD
=======
  const [genderData, setGenderData] = useState({ male: 0, female: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate percentage changes (mock calculation since we don't have historical data)
  const calculateChangePercent = (current, type) => {
    // Mock calculation - you can replace this with actual historical data comparison
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
      {
        label: "Applications",
        color: "blue",
        value: 100, // Always 100% as it represents the total
      },
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
      {
        label: "On Hold",
        color: "brown",
        value: 0, // Not provided by API, keeping as 0
      },
      {
        label: "Approved",
        color: "green",
        value: Math.round((apiData.approvedApplications / total) * 100),
      },
    ];
  };

>>>>>>> main
  // Fetch applications summary from API
  useEffect(() => {
    async function fetchApplicationStats() {
      try {
<<<<<<< HEAD
        const response = await apiInstance.get(
          "StudentApplication/allapplications"
        );
        if (response?.data?.statusCode === 200 && response?.data?.result) {
          const {
            totalNumOfApplications,
            approvedApplications,
            rejectedApplications,
            pendingApplications,
          } = response.data.result;

          // Compute change and changePercent
          // For demo, we use 0% and 0. Use your own logic if you have previous stats or trends.
          setStatCards([
            {
              title: "Total Applications",
              value:
                typeof totalNumOfApplications === "number"
                  ? totalNumOfApplications.toLocaleString()
                  : "--",
              change: "+12% Inc",
              changePercent: 0,
=======
        setLoading(true);
        //console.log(
        //`Overview: Fetching application statistics at ${getCurrentDateTime()} by ${getCurrentUser()}`
        //);

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

          // Calculate change percentages
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

          // Update stat cards with API data
          setStatCards([
            {
              title: "Total Applications",
              value: totalNumOfApplications.toLocaleString(),
              change: `${totalChange >= 0 ? "+" : ""}${totalChange}% ${
                totalChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(totalChange), 100),
>>>>>>> main
              color: "blue",
            },
            {
              title: "Approved Applications",
<<<<<<< HEAD
              value:
                typeof approvedApplications === "number"
                  ? approvedApplications.toLocaleString()
                  : "--",
              change: "+8% Inc",
              changePercent: 0,
=======
              value: approvedApplications.toLocaleString(),
              change: `${approvedChange >= 0 ? "+" : ""}${approvedChange}% ${
                approvedChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(approvedChange), 100),
>>>>>>> main
              color: "green",
            },
            {
              title: "Rejected Applications",
<<<<<<< HEAD
              value:
                typeof rejectedApplications === "number"
                  ? rejectedApplications.toLocaleString()
                  : "--",
              change: "+5% Dec",
              changePercent: 0,
=======
              value: rejectedApplications.toLocaleString(),
              change: `${rejectedChange >= 0 ? "+" : ""}${rejectedChange}% ${
                rejectedChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(rejectedChange), 100),
>>>>>>> main
              color: "red",
            },
            {
              title: "Pending Applications",
<<<<<<< HEAD
              value:
                typeof pendingApplications === "number"
                  ? pendingApplications.toLocaleString()
                  : "--",
              change: "+10% Dec",
              changePercent: 0,
              color: "gray",
            },
          ]);
        }
      } catch (error) {
        // Optionally show an error, otherwise leave stat cards at defaults
        // You may set error state here if you want
      }
    }
    fetchApplicationStats();
  }, []);

  return (
    <div className="overview-main">
      {/* Stat Cards */}
      <h1
        className="section-title mb-2"
        style={{ color: "#264de4", fontSize: "1.5rem" }}
      >
        Application Overview
      </h1>

=======
              value: pendingApplications.toLocaleString(),
              change: `${pendingChange >= 0 ? "+" : ""}${pendingChange}% ${
                pendingChange >= 0 ? "Inc" : "Dec"
              }`,
              changePercent: Math.min(Math.abs(pendingChange), 100),
              color: "gray",
            },
          ]);

          // Update gender data
          setGenderData({
            male: numberOfMale,
            female: numberOfFemale,
          });

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

        // Keep default values on error
        //console.log(
        //  `Overview: Using default values due to API error at ${getCurrentDateTime()} by ${getCurrentUser()}`
        //);
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
>>>>>>> main
      <div className="stat-cards-row">
        {statCards.map((stat, i) => (
          <div key={stat.title} className={`stat-card ${stat.color}`}>
            <div className="stat-card-header">
              <span>{stat.title}</span>
<<<<<<< HEAD
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
=======
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

>>>>>>> main
            <div className="stat-card-change">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Application Insights Section */}
      <h2 className="overview-section-title">Application Insights</h2>
<<<<<<< HEAD
=======

>>>>>>> main
      <div className="insights-cards-row">
        {/* Active Applications Breakdown */}
        <div className="insights-card breakdown">
          <div className="insights-card-header">
            <span>Statistics of Active Applications</span>
            <div className="insights-card-switch">
<<<<<<< HEAD
              <BarChart2 size={18} className="text-blue-700" />
              <span className="font-semibold text-blue-700">Week</span>
              <ChevronDown size={16} />
=======
              <BarChart2 size={14} />
              <span className="font-semibold">Week</span>
              <ChevronDown size={12} />
>>>>>>> main
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
<<<<<<< HEAD
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
=======
>>>>>>> main
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
<<<<<<< HEAD
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
=======
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
>>>>>>> main
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
<<<<<<< HEAD
=======

>>>>>>> main
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
<<<<<<< HEAD
=======

>>>>>>> main
      <div className="analytics-cards-row">
        {analytics.map((a) => (
          <div key={a.title} className="analytics-card">
            <div className="analytics-card-header">
              <span>{a.title}</span>
<<<<<<< HEAD
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
=======
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

>>>>>>> main
          <div className="gender-bar-chart">
            <div className="gender-bar-col">
              <div
                className="gender-bar-male"
                style={{
                  height: `${
<<<<<<< HEAD
                    (genderData.male / (genderData.male + genderData.female)) *
                    70
=======
                    genderData.male + genderData.female > 0
                      ? Math.max(
                          (genderData.male /
                            (genderData.male + genderData.female)) *
                            50,
                          2
                        )
                      : 2
>>>>>>> main
                  }px`,
                }}
              ></div>
              <div className="gender-label">Male</div>
              <div className="gender-value">{genderData.male}</div>
            </div>
<<<<<<< HEAD
=======

>>>>>>> main
            <div className="gender-bar-col">
              <div
                className="gender-bar-female"
                style={{
                  height: `${
<<<<<<< HEAD
                    (genderData.female /
                      (genderData.male + genderData.female)) *
                    70
=======
                    genderData.male + genderData.female > 0
                      ? Math.max(
                          (genderData.female /
                            (genderData.male + genderData.female)) *
                            50,
                          2
                        )
                      : 2
>>>>>>> main
                  }px`,
                }}
              ></div>
              <div className="gender-label">Female</div>
              <div className="gender-value">{genderData.female}</div>
            </div>
<<<<<<< HEAD
            <div className="gender-bar-legend">
              <span className="legend-dot male"></span> Male
              <span className="legend-dot female"></span> Female
            </div>
=======
          </div>

          <div className="gender-bar-legend">
            <span>
              <span className="legend-dot male"></span> Male
            </span>
            <span>
              <span className="legend-dot female"></span> Female
            </span>
>>>>>>> main
          </div>
        </div>
      </div>
    </div>
  );
}
