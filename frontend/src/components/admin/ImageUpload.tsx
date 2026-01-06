"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageUpload() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [createNewProject, setCreateNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");

  useEffect(() => {
    // Fetch projects
    fetch("http://localhost:5000/api/projects", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data.projects || []);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));

    // Fetch clients
    fetch("http://localhost:5000/api/admin/clients", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClients(data.data.clients || []);
        }
      })
      .catch((err) => console.error("Error fetching clients:", err));

    // Fetch uploaded images
    fetch("http://localhost:5000/api/project-images", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUploadedImages(data.data.images || []);
        }
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length < 2 || files.length > 10) {
      setMessage("Please select 2-10 images");
      return;
    }

    setImages(files);
    
    // Create previews
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
    setMessage("");
  };

  const handleUpload = async () => {
    if (images.length < 2 || images.length > 10) {
      setMessage("Please select 2-10 images");
      return;
    }

    if (!selectedProject && !createNewProject) {
      setMessage("Please select a project or create a new one");
      return;
    }

    if (createNewProject && !newProjectName.trim()) {
      setMessage("Please enter a project name");
      return;
    }

    setUploading(true);
    setMessage("");

    let projectId = selectedProject;

    // Create new project if needed
    if (createNewProject) {
      try {
        const createResponse = await fetch("http://localhost:5000/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: newProjectName,
            description: "",
            userId: selectedClientId || null,
          }),
        });
        const createData = await createResponse.json();
        if (createData.success) {
          projectId = createData.data.project.id;
          // Refresh projects list
          fetch("http://localhost:5000/api/projects", {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setProjects(data.data.projects || []);
                setSelectedProject(projectId);
                setCreateNewProject(false);
                setNewProjectName("");
                setSelectedClientId("");
              }
            });
        } else {
          setMessage("Failed to create project");
          setUploading(false);
          return;
        }
      } catch (error) {
        setMessage("Failed to create project");
        setUploading(false);
        return;
      }
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/project-images/${projectId}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Images uploaded successfully!");
        setImages([]);
        setPreviews([]);
        // Refresh uploaded images list
        setTimeout(() => {
          fetch("http://localhost:5000/api/project-images", {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((refreshData) => {
              if (refreshData.success) {
                setUploadedImages(refreshData.data.images || []);
              }
            })
            .catch((err) => console.error("Error refreshing images:", err));
        }, 500);
      } else {
        setMessage(data.message || "Upload failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Images (2-10 images)</h2>
        
        {/* Project Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Project</label>
          <div className="flex gap-4 items-center mb-2">
            <input
              type="radio"
              id="existing"
              name="projectType"
              checked={!createNewProject}
              onChange={() => setCreateNewProject(false)}
              className="mr-2"
            />
            <label htmlFor="existing" className="cursor-pointer">
              Existing Project
            </label>
            <input
              type="radio"
              id="new"
              name="projectType"
              checked={createNewProject}
              onChange={() => setCreateNewProject(true)}
              className="ml-4 mr-2"
            />
            <label htmlFor="new" className="cursor-pointer">
              Create New Project
            </label>
          </div>

          {createNewProject ? (
            <div className="space-y-3 mt-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded"
              />
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assign to Client (Optional)
                </label>
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
              </div>
            </div>
          ) : (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-300 rounded mt-2"
            >
              <option value="">Choose a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 text-white"
        />

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

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || images.length < 2 || images.length > 10}
          className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : `Upload ${images.length} Images`}
        </button>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
          <div className="grid grid-cols-4 gap-4">
            {uploadedImages.map((img: any) => (
              <div key={img.id} className="relative aspect-square">
                <Image
                  src={img.imageUrl}
                  alt="Uploaded"
                  fill
                  className="object-cover border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

