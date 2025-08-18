import React from "react";

const SimpleBarChart = ({ data, height = 200 }) => {
  // Add fallback data in case data prop is not provided
  const chartData = data || [
    { month: "Jan", applications: 45, approved: 35, rejected: 10, pending: 5 },
    { month: "Feb", applications: 52, approved: 40, rejected: 8, pending: 4 },
    { month: "Mar", applications: 48, approved: 38, rejected: 7, pending: 3 },
    { month: "Apr", applications: 65, approved: 50, rejected: 10, pending: 5 },
    { month: "May", applications: 58, approved: 45, rejected: 8, pending: 5 },
    { month: "Jun", applications: 72, approved: 60, rejected: 9, pending: 3 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.applications));

  return (
    <div className="simple-bar-chart-container">
      {/* Chart Header */}
      <div className="chart-header mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Application Insights
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Statistics of Active Applications
        </p>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Week</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Month</span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Applications</p>
          <p className="text-lg font-semibold text-blue-600">100%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-lg font-semibold text-yellow-600">67%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-lg font-semibold text-red-600">30%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">On Hold</p>
          <p className="text-lg font-semibold text-gray-600">23%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-lg font-semibold text-green-600">20%</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div
        className="flex items-end justify-between px-4"
        style={{ height: `${height}px` }}
      >
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 mx-1">
            <div className="w-full flex flex-col items-center space-y-1">
              <div
                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                style={{
                  height: `${
                    (item.applications / maxValue) * (height * 0.7)
                  }px`,
                  minHeight: "4px",
                }}
                title={`Applications: ${item.applications}`}
              />
              <div
                className="w-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
                style={{
                  height: `${(item.approved / maxValue) * (height * 0.7)}px`,
                  minHeight: "2px",
                }}
                title={`Approved: ${item.approved}`}
              />
              <div
                className="w-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                style={{
                  height: `${(item.rejected / maxValue) * (height * 0.7)}px`,
                  minHeight: "2px",
                }}
                title={`Rejected: ${item.rejected}`}
              />
              <div
                className="w-full bg-yellow-500 rounded-b hover:bg-yellow-600 transition-colors cursor-pointer"
                style={{
                  height: `${(item.pending / maxValue) * (height * 0.7)}px`,
                  minHeight: "2px",
                }}
                title={`Pending: ${item.pending}`}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2 font-medium">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleBarChart;
