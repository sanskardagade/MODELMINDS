"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    progressPercent: 0,
    dealAmount: 0,
    receivedAmount: 0,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchClients();
    }
  }, [projectId]);

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

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setProject(data.data.project);
        setSelectedClientId(data.data.project.userId || "");
        setFormData({
          name: data.data.project.name,
          description: data.data.project.description || "",
          progressPercent: data.data.project.progressPercent,
          dealAmount: data.data.project.dealAmount,
          receivedAmount: data.data.project.receivedAmount,
        });
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setMessage("");
    try {
      // Update project details
      const updateResponse = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update project");
      }

      // Assign client if changed
      if (selectedClientId !== project.userId) {
        const assignResponse = await fetch(
          `http://localhost:5000/api/projects/${projectId}/assign-user`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              userId: selectedClientId || null,
            }),
          }
        );
        
        if (!assignResponse.ok) {
          const assignData = await assignResponse.json();
          throw new Error(assignData.message || "Failed to assign client");
        }
      }

      // Update progress
      if (formData.progressPercent !== project.progressPercent) {
        await fetch(
          `http://localhost:5000/api/projects/${projectId}/progress`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              progressPercent: formData.progressPercent,
            }),
          }
        );
      }

      // Update amounts
      if (
        formData.dealAmount !== project.dealAmount ||
        formData.receivedAmount !== project.receivedAmount
      ) {
        await fetch(`http://localhost:5000/api/projects/${projectId}/amounts`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            dealAmount: formData.dealAmount,
            receivedAmount: formData.receivedAmount,
          }),
        });
      }

      setMessage("Project updated successfully!");
      setEditing(false);
      fetchProject();
    } catch (error) {
      setMessage("Failed to update project");
      console.error("Update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="text-center py-12">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="text-center py-12">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.push("/admin")}
          className="mb-4 text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Edit Project</h1>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-300 text-sm">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                />
              ) : (
                <p className="text-white">{project.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              {editing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                  rows={4}
                />
              ) : (
                <p className="text-white">{project.description || "No description"}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Progress (%)
                </label>
                {editing ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progressPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progressPercent: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                  />
                ) : (
                  <p className="text-white">{project.progressPercent}%</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deal Amount (₹)
                </label>
                {editing ? (
                  <input
                    type="number"
                    min="0"
                    value={formData.dealAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dealAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                  />
                ) : (
                  <p className="text-white">₹{project.dealAmount.toLocaleString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Received Amount (₹)
                </label>
                {editing ? (
                  <input
                    type="number"
                    min="0"
                    value={formData.receivedAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        receivedAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
                  />
                ) : (
                  <p className="text-white">
                    ₹{project.receivedAmount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Client Assignment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Assign to Client
              </label>
              {editing ? (
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100"
                >
                  <option value="">No client assigned</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-white">
                  {project.user?.name || "Not assigned to any client"}
                </p>
              )}
            </div>

            {editing && (
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Save Changes
              </button>
            )}
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Project Images</h2>
              <div className="grid grid-cols-4 gap-4">
                {project.images.map((img: any) => (
                  <div key={img.id} className="relative aspect-square">
                    <Image
                      src={img.imageUrl}
                      alt="Project image"
                      fill
                      className="object-cover border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

