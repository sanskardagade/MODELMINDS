"use client";

import { useState, useEffect, useRef } from "react";

export default function ClientMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      if (selectedClient) {
        fetchMessages(selectedClient.id);
      } else {
        fetchConversations();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/messages/conversations", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data.conversations || []);
        if (data.data.conversations.length > 0 && !selectedClient) {
          setSelectedClient(data.data.conversations[0].user);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (clientId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/messages?otherUserId=${clientId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    fetchMessages(client.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient) return;

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
          receiverId: selectedClient.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewMessage("");
        await fetchMessages(selectedClient.id);
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
    return <div className="text-center py-8 text-gray-400">Loading messages...</div>;
  }

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Client Messages</h2>
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[500px] sm:h-[550px] md:h-[600px]">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 pb-4 md:pb-0 md:pr-4 overflow-y-auto">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-3">Clients</h3>
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-xs sm:text-sm">No conversations yet</p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const isSelected = selectedClient?.id === conv.user.id;
                const hasUnread = conv.unreadCount > 0;
                return (
                  <div
                    key={conv.user.id}
                    onClick={() => handleSelectClient(conv.user)}
                    className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-gray-800 border border-gray-600"
                        : "hover:bg-gray-900 border border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm sm:text-base truncate">{conv.user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{conv.user.email}</p>
                        {conv.lastMessage && (
                          <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {hasUnread && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedClient ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-700 pb-3 mb-4">
                <p className="text-gray-400 text-xs sm:text-sm">Chatting with</p>
                <p className="text-white font-medium text-sm sm:text-base">{selectedClient.name}</p>
                <p className="text-gray-500 text-xs truncate">{selectedClient.email}</p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 text-sm">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  messages.map((message) => {
                    const isSent = message.sender.role === "HEAD";
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
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a client to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


