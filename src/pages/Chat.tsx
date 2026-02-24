import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { getMessages } from "../services/chatService.ts";
import { Send, ArrowLeft, User } from "lucide-react";
import { motion } from "motion/react";

export default function Chat({ user }: { user: any }) {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !matchId) return;

    // Fetch message history
    getMessages(matchId, token).then(data => {
      if (Array.isArray(data)) {
        setMessages(data);
      }
    });

    // Initialize socket
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit("join_room", matchId);

    newSocket.on("receive_message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !matchId) return;

    socket.emit("send_message", {
      matchId,
      senderId: user.id,
      text: newMessage
    });

    setNewMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
          <User size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Study Buddy Chat</h2>
          <p className="text-xs text-emerald-500 font-medium">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.sender === user.id;
          return (
            <motion.div
              key={msg._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  isMe 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-slate-100 text-slate-900 rounded-tl-none"
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
