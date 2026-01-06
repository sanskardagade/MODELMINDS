"use client";

import { useState, useEffect } from "react";

export default function UserMoney() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDealAmount, setTotalDealAmount] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/projects", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        const projectsData = data.data.projects || [];
        setProjects(projectsData);
        
        // Calculate totals
        const dealTotal = projectsData.reduce((sum: number, p: any) => sum + (p.dealAmount || 0), 0);
        const receivedTotal = projectsData.reduce((sum: number, p: any) => sum + (p.receivedAmount || 0), 0);
        const pendingTotal = projectsData.reduce((sum: number, p: any) => sum + (p.pendingAmount || 0), 0);
        
        setTotalDealAmount(dealTotal);
        setTotalReceived(receivedTotal);
        setTotalPending(pendingTotal);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Deal Amount</h3>
          <p className="text-2xl font-bold text-white">
            ₹{totalDealAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Amount Received</h3>
          <p className="text-2xl font-bold text-green-400">
            ₹{totalReceived.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Amount Pending</h3>
          <p className="text-2xl font-bold text-red-400">
            ₹{totalPending.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Project-wise Breakdown */}
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Project-wise Payment Details</h2>
        
        {projects.length === 0 ? (
          <p className="text-gray-400">No projects found.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-400 text-sm">{project.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Deal Amount</p>
                    <p className="text-white font-semibold">
                      ₹{project.dealAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Received</p>
                    <p className="text-green-400 font-semibold">
                      ₹{project.receivedAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Pending</p>
                    <p className="text-red-400 font-semibold">
                      ₹{project.pendingAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Payment Progress</span>
                    <span>
                      {project.dealAmount > 0
                        ? ((project.receivedAmount / project.dealAmount) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          project.dealAmount > 0
                            ? (project.receivedAmount / project.dealAmount) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Payment History */}
                {project.payments && project.payments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">Payment History</p>
                    <div className="space-y-2">
                      {project.payments.map((payment: any) => (
                        <div
                          key={payment.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-300">
                            {new Date(payment.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span
                            className={
                              payment.type === "RECEIVED"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            ₹{payment.amount.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}{" "}
                            ({payment.type})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

