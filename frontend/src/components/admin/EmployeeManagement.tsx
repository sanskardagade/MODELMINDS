"use client";

import { useState, useEffect } from "react";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState("");
  
  // Create employee form
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!newEmployee.name.trim()) {
      setMessage("Name is required");
      return;
    }

    if (!newEmployee.email.trim()) {
      setMessage("Email is required");
      return;
    }

    if (!newEmployee.password || newEmployee.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newEmployee.name.trim(),
          email: newEmployee.email.trim(),
          password: newEmployee.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Employee created successfully!");
        setNewEmployee({
          name: "",
          email: "",
          password: "",
        });
        setShowCreateForm(false);
        fetchEmployees();
      } else {
        setMessage(data.message || "Failed to create employee");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Create employee error:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 sm:px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          {showCreateForm ? "Cancel" : "+ Create New Employee"}
        </button>
      </div>

      {/* Create Employee Form */}
      {showCreateForm && (
        <div className="bg-black border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Employee</h3>
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter employee name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter employee email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded text-sm ${
                  message.includes("success")
                    ? "bg-green-500/20 border border-green-500 text-green-300"
                    : "bg-red-500/20 border border-red-500 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
            >
              Create Employee
            </button>
          </form>
        </div>
      )}

      {/* Employees List */}
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">All Employees</h3>
        
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading employees...</div>
        ) : employees.length === 0 ? (
          <p className="text-gray-400">No employees found</p>
        ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-6 sm:px-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base">Name</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base">Email</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base">Assigned Projects</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-800">
                    <td className="py-3 px-2 sm:px-4 text-sm sm:text-base">{employee.name}</td>
                    <td className="py-3 px-2 sm:px-4 text-sm sm:text-base break-all">{employee.email}</td>
                    <td className="py-3 px-2 sm:px-4 text-sm sm:text-base">{employee.projectCount || 0}</td>
                    <td className="py-3 px-2 sm:px-4 text-sm sm:text-base">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs sm:text-sm">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Success/Error Message */}
        {message && !showCreateForm && (
          <div
            className={`mt-4 p-3 rounded text-sm ${
              message.includes("success")
                ? "bg-green-500/20 border border-green-500 text-green-300"
                : "bg-red-500/20 border border-red-500 text-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}


