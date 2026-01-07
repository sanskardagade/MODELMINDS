"use client";

import { useState, useEffect, useRef } from "react";

export default function UserChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdminAndMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAdminAndMessages = async () => {
    try {
      // Get admin user
      const adminResponse = await fetch("http://localhost:5000/api/messages/admin", {
        credentials: "include",
      });
      const adminData = await adminResponse.json();
      
      if (adminData.success && adminData.data.admin) {
        const admin = adminData.data.admin;
        setAdminUser(admin);
        await fetchMessages(admin.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (adminId?: string) => {
    if (!adminId && !adminUser) return;
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/messages?otherUserId=${adminId || adminUser?.id}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages || []);
        if (data.data.messages.length > 0 && !adminUser) {
          // Get admin from first message
          const firstMsg = data.data.messages[0];
          const admin = firstMsg.sender.role === "HEAD" ? firstMsg.sender : firstMsg.receiver;
          setAdminUser(admin);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !adminUser) return;

    setSending(true);
    try {
      const response = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId: adminUser.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewMessage("");
        await fetchMessages();
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading chat...</div>;
  }

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Chat with Admin</h2>
      
      {adminUser ? (
        <div className="flex flex-col h-[400px] sm:h-[500px] md:h-[600px]">
          {/* Chat Header */}
          <div className="border-b border-gray-700 pb-3 mb-4">
            <p className="text-gray-400 text-xs sm:text-sm">Chatting with</p>
            <p className="text-white font-medium text-sm sm:text-base">{adminUser.name}</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isSent = message.sender.role === "USER";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                        isSent
                          ? "bg-gray-300 text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <p className="text-xs sm:text-sm break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSent ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 sm:px-4 py-2 bg-black border border-gray-300 rounded-md focus:outline-none focus:border-gray-100 text-sm sm:text-base"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 sm:px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p>No admin found. Please contact support.</p>
        </div>
      )}
    </div>
  );
}

