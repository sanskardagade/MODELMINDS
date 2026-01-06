"use client";

import { useState, useEffect } from "react";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-8">Loading employees...</div>;
  }

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>
      
      {employees.length === 0 ? (
        <p className="text-gray-400">No employees found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Assigned Projects</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-800">
                  <td className="py-3 px-4">{employee.name}</td>
                  <td className="py-3 px-4">{employee.email}</td>
                  <td className="py-3 px-4">{employee.projectCount || 0}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

