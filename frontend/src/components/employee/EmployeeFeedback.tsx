"use client";

import { useState, useEffect } from "react";

export default function EmployeeFeedback() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [percentage, setPercentage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employee/projects", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedProject || !workDone.trim()) {
      setMessage("Please select a project and describe the work done");
      return;
    }

    const percentageNum = percentage ? parseFloat(percentage) : 0;
    if (percentageNum < 0 || percentageNum > 100) {
      setMessage("Percentage must be between 0 and 100");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/employee/work-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          projectId: selectedProject,
          workDone: workDone.trim(),
          percentage: percentageNum,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Feedback submitted successfully!");
        setSelectedProject("");
        setWorkDone("");
        setPercentage("");
        fetchProjects();
      } else {
        setMessage(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Submit feedback error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Submit Work Feedback</h2>
      <p className="text-gray-400 text-sm mb-6">
        Provide feedback about the work you have completed. This will be visible to the admin.
      </p>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
            required
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.progressPercent}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Work Done
          </label>
          <textarea
            value={workDone}
            onChange={(e) => setWorkDone(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100 resize-none"
            rows={5}
            placeholder="Describe what work you have completed..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Progress Percentage (0-100)
          </label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
            placeholder="Enter percentage (optional)"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

