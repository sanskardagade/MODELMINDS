"use client";

import { useState, useEffect } from "react";

export default function MoneyOverview() {
  const [summary, setSummary] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoneyData();
  }, []);

  const fetchMoneyData = async () => {
    try {
      const [summaryRes, projectsRes] = await Promise.all([
        fetch("http://localhost:5000/api/payments/summary", {
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/projects", {
          credentials: "include",
        }),
      ]);

      const summaryData = await summaryRes.json();
      const projectsData = await projectsRes.json();

      if (summaryData.success) {
        setSummary(summaryData.data.overallTotals);
      }

      if (projectsData.success) {
        setProjects(projectsData.data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching money data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading money overview...</div>;
  }

  const totalPending = summary
    ? summary.totalDealAmount - summary.totalReceivedAmount
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h3 className="text-sm text-gray-400 mb-2">Total Deal Amount</h3>
          <p className="text-2xl font-bold text-white">
            ₹{summary?.totalDealAmount?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h3 className="text-sm text-gray-400 mb-2">Total Received</h3>
          <p className="text-2xl font-bold text-green-300">
            ₹{summary?.totalReceivedAmount?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h3 className="text-sm text-gray-400 mb-2">Total Pending</h3>
          <p className="text-2xl font-bold text-yellow-300">
            ₹{totalPending.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Projects Breakdown */}
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Projects Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4">Project Name</th>
                <th className="text-left py-3 px-4">Deal Amount</th>
                <th className="text-left py-3 px-4">Received</th>
                <th className="text-left py-3 px-4">Pending</th>
                <th className="text-left py-3 px-4">Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const pending = project.dealAmount - project.receivedAmount;
                return (
                  <tr key={project.id} className="border-b border-gray-800">
                    <td className="py-3 px-4">{project.name}</td>
                    <td className="py-3 px-4">
                      ₹{project.dealAmount?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 text-green-300">
                      ₹{project.receivedAmount?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 text-yellow-300">
                      ₹{pending.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{
                              width: `${project.progressPercent || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm">{project.progressPercent || 0}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

