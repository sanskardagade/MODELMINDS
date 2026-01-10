"use client";

import { useState, useEffect } from "react";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateClientForm, setShowCreateClientForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");
  
  // Create project form
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    dealAmount: "",
    userId: "",
  });

  // Create client form
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Edit project form
  const [editForm, setEditForm] = useState({
    progressPercent: 0,
    dealAmount: 0,
    receivedAmount: 0,
    userId: "",
  });

  const [message, setMessage] = useState("");
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/clients", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setClients(data.data.clients || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!newClient.name.trim()) {
      setMessage("Client name is required");
      return;
    }

    if (!newClient.email.trim()) {
      setMessage("Email is required");
      return;
    }

    if (!newClient.password || newClient.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newClient.name.trim(),
          email: newClient.email.trim(),
          password: newClient.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Client created successfully!");
        setNewClient({
          name: "",
          email: "",
          password: "",
        });
        setShowCreateClientForm(false);
        fetchClients();
        // Refresh project form to include new client in dropdown
        fetchProjects();
      } else {
        setMessage(data.message || "Failed to create client");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Create client error:", error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!newProject.name.trim()) {
      setMessage("Project name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newProject.name.trim(),
          description: newProject.description.trim() || null,
          dealAmount: parseFloat(newProject.dealAmount) || 0,
          userId: newProject.userId || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Project created successfully!");
        setNewProject({
          name: "",
          description: "",
          dealAmount: "",
          userId: "",
        });
        setShowCreateForm(false);
        fetchProjects();
      } else {
        setMessage(data.message || "Failed to create project");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Create project error:", error);
    }
  };

  const handleStartEdit = (project: any) => {
    setEditingProject(project.id);
    setEditForm({
      progressPercent: project.progressPercent,
      dealAmount: project.dealAmount,
      receivedAmount: project.receivedAmount,
      userId: project.userId || "",
    });
  };

  const handleUpdateProject = async (projectId: string) => {
    setMessage("");
    try {
      // Update project details
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      // Update progress
      if (editForm.progressPercent !== project.progressPercent) {
        await fetch(
          `http://localhost:5000/api/projects/${projectId}/progress`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              progressPercent: editForm.progressPercent,
            }),
          }
        );
      }

      // Update amounts
      if (
        editForm.dealAmount !== project.dealAmount ||
        editForm.receivedAmount !== project.receivedAmount
      ) {
        await fetch(`http://localhost:5000/api/projects/${projectId}/amounts`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            dealAmount: editForm.dealAmount,
            receivedAmount: editForm.receivedAmount,
          }),
        });
      }

      // Update client assignment
      if (editForm.userId !== project.userId) {
        await fetch(
          `http://localhost:5000/api/projects/${projectId}/assign-user`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              userId: editForm.userId || null,
            }),
          }
        );
      }

      setMessage("Project updated successfully!");
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      setMessage("Failed to update project");
      console.error("Update error:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setMessage("");
    setDeletingProject(projectId);
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Project deleted successfully!");
        setConfirmDelete(null);
        fetchProjects();
      } else {
        setMessage(data.message || "Failed to delete project");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setDeletingProject(null);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "ongoing") return project.progressPercent < 100;
    if (filter === "completed") return project.progressPercent === 100;
    return true;
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                filter === "all"
                  ? "bg-gray-300 text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("ongoing")}
              className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                filter === "ongoing"
                  ? "bg-gray-300 text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                filter === "completed"
                  ? "bg-gray-300 text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCreateClientForm(!showCreateClientForm)}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              {showCreateClientForm ? "Cancel Client" : "+ Create Client"}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 sm:px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              {showCreateForm ? "Cancel Project" : "+ Create Project"}
            </button>
          </div>
        </div>
      </div>

      {/* Create Client Form */}
      {showCreateClientForm && (
        <div className="bg-black border-2 border-blue-500 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Client</h2>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter client name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter client email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={newClient.password}
                onChange={(e) =>
                  setNewClient({ ...newClient, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            {message && showCreateClientForm && (
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Client
            </button>
          </form>
        </div>
      )}

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="bg-black border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100 resize-none"
                rows={3}
                placeholder="Enter project description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deal Amount (₹)
                </label>
                <input
                  type="number"
                  value={newProject.dealAmount}
                  onChange={(e) =>
                    setNewProject({ ...newProject, dealAmount: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Assign to Client
                </label>
                <select
                  value={newProject.userId}
                  onChange={(e) =>
                    setNewProject({ ...newProject, userId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                >
                  <option value="">No client assigned</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {message && showCreateForm && !showCreateClientForm && (
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
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-black border-2 border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Projects Management</h2>
        
        {filteredProjects.length === 0 ? (
          <p className="text-gray-400">No projects found</p>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border-2 border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-colors"
              >
                {editingProject === project.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {project.description || "No description"}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleUpdateProject(project.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setConfirmDelete(null);
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Progress (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editForm.progressPercent}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              progressPercent: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Deal Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.dealAmount}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              dealAmount: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Received Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.receivedAmount}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              receivedAmount: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Assign Client
                        </label>
                        <select
                          value={editForm.userId}
                          onChange={(e) =>
                            setEditForm({ ...editForm, userId: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                        >
                          <option value="">No client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {project.description || "No description"}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <span
                          className={`px-3 py-1 rounded text-sm whitespace-nowrap text-center ${
                            project.progressPercent === 100
                              ? "bg-green-500/20 text-green-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {project.progressPercent}%
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(project)}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors text-sm flex-1 sm:flex-none"
                          >
                            Edit
                          </button>
                          {confirmDelete === project.id ? (
                            <div className="flex gap-2 flex-1 sm:flex-none">
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                disabled={deletingProject === project.id}
                                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                              >
                                {deletingProject === project.id ? "Deleting..." : "Confirm"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm flex-1"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(project.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex-1 sm:flex-none"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-gray-400">Deal Amount:</span>
                        <p className="text-white">₹{project.dealAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Received:</span>
                        <p className="text-white">₹{project.receivedAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Pending:</span>
                        <p className="text-white">
                          ₹{(project.dealAmount - project.receivedAmount)?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-sm">
                        <div>
                          <span className="text-gray-400">Assigned to:</span>
                          <p className="text-white">
                            {project.user?.name || "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Work Logs:</span>
                          <p className="text-white">{project._count?.workLogs || 0}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success/Error Message */}
      {message && !showCreateForm && (
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
    </div>
  );
}


