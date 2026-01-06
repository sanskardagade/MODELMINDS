"use client";

import { useState, useEffect } from "react";

export default function EmployeeTasks() {
  const [workLogs, setWorkLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employee/work-logs", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setWorkLogs(data.data.workLogs || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (logId: string, currentWorkDone: string) => {
    setMarkingComplete(logId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/work-logs/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            workDone: currentWorkDone,
            percentage: 100,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh tasks after marking as complete
        await fetchTasks();
      } else {
        alert(data.message || "Failed to mark task as completed");
      }
    } catch (error) {
      console.error("Error marking task as complete:", error);
      alert("Network error. Please try again.");
    } finally {
      setMarkingComplete(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading tasks...</div>;
  }

  // Separate tasks into active and completed
  const activeTasks = workLogs.filter((log) => log.percentage < 100);
  const completedTasks = workLogs.filter((log) => log.percentage === 100);

  const TaskCard = ({ log }: { log: any }) => (
    <div
      className="border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-medium text-white mb-1">
            {log.project.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {new Date(log.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-400 text-sm">Progress</span>
          <p className="text-white font-semibold">{log.percentage}%</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-gray-300">{log.workDone}</p>
      </div>
      {log.project.progressPercent !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Project Progress</span>
            <span>{log.project.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gray-300 h-2 rounded-full transition-all"
              style={{ width: `${log.project.progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
      {log.percentage < 100 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={() => handleMarkComplete(log.id, log.workDone)}
            disabled={markingComplete === log.id}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {markingComplete === log.id ? "Marking..." : "Mark as Completed"}
          </button>
        </div>
      )}
      {log.percentage === 100 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-500">
            ✓ Completed
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Assigned Tasks</h2>
        
        {activeTasks.length === 0 ? (
          <p className="text-gray-400">No active tasks assigned.</p>
        ) : (
          <div className="space-y-4">
            {activeTasks.map((log) => (
              <TaskCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-black border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Previous Tasks Done</h2>
          <div className="space-y-4">
            {completedTasks.map((log) => (
              <TaskCard key={log.id} log={log} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

