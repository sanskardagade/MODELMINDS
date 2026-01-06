"use client";

import { useState, useEffect } from "react";

export default function EmployeeFeedback() {
  const [workLogs, setWorkLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchFeedback();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/employees", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data.employees || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/employee-feedback", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setWorkLogs(data.data.workLogs || []);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = workLogs.filter((log) => {
    if (filter === "all") return true;
    return log.employeeId === filter;
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading feedback...</div>;
  }

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Employee Feedback</h2>
      <p className="text-gray-400 text-sm mb-6">
        View all work logs and feedback submitted by employees.
      </p>

      {/* Filter by Employee */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Employee</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
        >
          <option value="all">All Employees</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      {/* Work Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No feedback submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {log.employee.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{log.employee.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(log.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">Project:</span>
                  <span className="text-white font-medium">{log.project.name}</span>
                  <span className="text-gray-500 text-sm">
                    ({log.project.progressPercent}%)
                  </span>
                </div>
                {log.percentage > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Progress:</span>
                    <span className="text-white font-semibold">{log.percentage}%</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap">{log.workDone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

