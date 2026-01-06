"use client";

import { useState, useEffect } from "react";

export default function TaskAssignment() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedProject) {
      setMessage("Please select both employee and project");
      return;
    }

    setMessage("");

    try {
      // First, we need to create a work log entry to assign the project
      const response = await fetch(
        "http://localhost:5000/api/employee/work-logs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            projectId: selectedProject,
            workDone: "Project assigned",
            percentage: 0,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Project assigned successfully!");
        setSelectedEmployee("");
        setSelectedProject("");
        fetchEmployees();
      } else {
        setMessage(data.message || "Assignment failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Assignment error:", error);
    }
  };

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Assign Project to Employee</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.includes("success")
              ? "bg-green-500/20 border border-green-500 text-green-300"
              : "bg-red-500/20 border border-red-500 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
          >
            <option value="">Choose an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({employee.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.progressPercent}%)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          disabled={!selectedEmployee || !selectedProject}
          className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign Project
        </button>
      </div>
    </div>
  );
}

