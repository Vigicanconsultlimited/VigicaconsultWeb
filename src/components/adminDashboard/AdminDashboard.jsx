import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import StatCard from "./cards/StatCard";
import Card from "./cards/Card";
import SimpleBarChart from "./SimpleBarChart";
import SatisfactionRating from "./SatisfactionRating";
import ProgressBar from "./ProgressBar";
import apiInstance from "../../utils/axios";
import { FileText } from "lucide-react";

//const API_URL = "https://vigica-001-site1.qtempurl.com/api/StudentPersonalInfo";
//const personalRes = await apiInstance.get(`StudentPersonalInfo/user/${userId}`);

export default function AdminDashboard() {
  const [currentStep, setCurrentStep] = useState("dashboard-home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personalData, setPersonalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the correct path - check your baseURL
        const response = await apiInstance.get("StudentPersonalInfo");
        console.log("Fetched Personal Info:", response.data);
        // Response from axios is already JSON
        setPersonalData(response.data.result || []);
      } catch (err) {
        setError(err.message || "Unknown error");
        console.error("API error:", err);
      }
      setLoading(false);
    };

    fetchPersonalInfo();
  }, []);

  // Example: Analytics Calculations
  const totalApplications = personalData.length;
  const maleApplications = personalData.filter(
    (p) => p.preferredPronoun === 1
  ).length;
  const femaleApplications = personalData.filter(
    (p) => p.preferredPronoun === 2
  ).length;
  const applicationsByGender = {
    male:
      totalApplications === 0
        ? 0
        : Math.round((maleApplications / totalApplications) * 100),
    female:
      totalApplications === 0
        ? 0
        : Math.round((femaleApplications / totalApplications) * 100),
  };

  // Example: Applications by Month (for chart)
  const getMonth = (dob) => {
    // Accepts both "YYYY-MM-DD" and "DD/MM/YYYY"
    if (!dob) return "Unknown";
    if (dob.includes("-")) {
      const [year, month] = dob.split("-");
      return new Date(year, month - 1).toLocaleString("en-US", {
        month: "short",
      });
    }
    if (dob.includes("/")) {
      const [day, month, year] = dob.split("/");
      return new Date(year, month - 1).toLocaleString("en-US", {
        month: "short",
      });
    }
    return "Unknown";
  };

  // Group applications by month (using dob for demonstration)
  const applicationsByMonth = [];
  personalData.forEach((p) => {
    const month = getMonth(p.dob);
    let group = applicationsByMonth.find((g) => g.month === month);
    if (!group) {
      group = { month, applications: 0, approved: 0, rejected: 0, pending: 0 };
      applicationsByMonth.push(group);
    }
    group.applications += 1;

    // For demo purposes, randomly assign status:
    if (p.firstName.length % 3 === 0) group.approved += 1;
    else if (p.firstName.length % 2 === 0) group.rejected += 1;
    else group.pending += 1;
  });

  // Demo satisfaction ratings data (replace with real if available)
  const satisfactionRatings = [
    { stars: 5, percentage: 45 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 },
  ];

  // Analytics (replace with real if available)
  const siteVisitation = 215341;
  const conversionRate = 14;
  const bounceRate = 38.67;

  const closeSidebar = () => setSidebarOpen(false);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full py-20 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold mb-4">
            Loading dashboard...
          </span>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    if (error) {
      return (
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </Card>
      );
    }
    switch (currentStep) {
      case "dashboard-home":
        return (
          <div className="space-y-6">
            {/* Application Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Applications"
                value={totalApplications}
                change={12}
                changeType="increase"
                color="bg-blue-100"
                icon={<FileText className="text-blue-600" size={24} />}
              />
              <StatCard
                title="Approved Applications"
                value={applicationsByMonth.reduce((a, b) => a + b.approved, 0)}
                change={8}
                changeType="increase"
                color="bg-green-100"
                icon={<FileText className="text-green-600" size={24} />}
              />
              <StatCard
                title="Rejected Applications"
                value={applicationsByMonth.reduce((a, b) => a + b.rejected, 0)}
                change={3}
                changeType="decrease"
                color="bg-red-100"
                icon={<FileText className="text-red-600" size={24} />}
              />
              <StatCard
                title="Pending Applications"
                value={applicationsByMonth.reduce((a, b) => a + b.pending, 0)}
                change={15}
                changeType="increase"
                color="bg-yellow-100"
                icon={<FileText className="text-yellow-600" size={24} />}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  Application Insights
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Statistics of Active Applications
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Applications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Approved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Rejected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
                <SimpleBarChart data={applicationsByMonth} />
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  Audience Satisfaction
                </h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600">78%</div>
                  <p className="text-sm text-gray-600">Based on User Rating</p>
                </div>
                <SatisfactionRating ratings={satisfactionRatings} />
              </Card>
            </div>

            {/* Site Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Total Site Visitation
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {siteVisitation.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +20% from last month
                </p>
              </Card>
              <Card>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Conversion Rate
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {conversionRate}%
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +5% from last month
                </p>
              </Card>
              <Card>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Bounce Rate
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {bounceRate}%
                </p>
                <p className="text-sm text-red-600 mt-1">-3% from last month</p>
              </Card>
              <Card>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Applications by Gender
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Male</span>
                    <span className="text-sm font-medium">
                      {applicationsByGender.male}%
                    </span>
                  </div>
                  <ProgressBar
                    percentage={applicationsByGender.male}
                    color="bg-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Female</span>
                    <span className="text-sm font-medium">
                      {applicationsByGender.female}%
                    </span>
                  </div>
                  <ProgressBar
                    percentage={applicationsByGender.female}
                    color="bg-pink-500"
                  />
                </div>
              </Card>
            </div>
          </div>
        );
      // ... rest of your cases unchanged ...
      case "document-review":
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Document Review</h2>
            <p className="text-gray-600">
              Review and approve submitted documents.
            </p>
          </Card>
        );
      case "user-management":
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-600">
              Manage user accounts and permissions.
            </p>
          </Card>
        );
      case "uploaded-files":
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
            <p className="text-gray-600">View and manage uploaded files.</p>
          </Card>
        );
      case "question-center":
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Question Center</h2>
            <p className="text-gray-600">Manage questions and answers.</p>
          </Card>
        );
      case "inbox":
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <p className="text-gray-600">View and respond to messages.</p>
          </Card>
        );
      default:
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-gray-600">
              The requested page could not be found.
            </p>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <div className="flex-1 lg:ml-0">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          <main className="p-4 lg:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Application Overview
              </h1>
              <p className="text-gray-600">
                Monitor your application statistics and performance
              </p>
            </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
