"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Languages, Loader2 } from "lucide-react";
import { Conversation, Message } from "@/types";

interface Props { locale: string; }

export function ChatInterface({ locale }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [showTranslated, setShowTranslated] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => { if (activeConv) fetchMessages(activeConv); }, [activeConv]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function fetchConversations() {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data.conversations || []);
    if (data.conversations?.[0]) setActiveConv(data.conversations[0].id);
  }

  async function fetchMessages(convId: string) {
    const res = await fetch(`/api/conversations/${convId}/messages`);
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    setLoading(true);
    await fetch(`/api/conversations/${activeConv}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });
    setNewMessage("");
    await fetchMessages(activeConv);
    setLoading(false);
  }

  async function toggleTranslation(msgId: string, content: string) {
    if (showTranslated[msgId]) { setShowTranslated((p) => ({ ...p, [msgId]: false })); return; }
    setTranslating(true);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, target: locale }),
    });
    const data = await res.json();
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, content_translated: { ...m.content_translated, [locale]: data.translated } } : m));
    setShowTranslated((p) => ({ ...p, [msgId]: true }));
    setTranslating(false);
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="w-72 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Messages</h2></div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-sm text-gray-400 text-center mt-8">No conversations yet.</div>
          ) : conversations.map((conv) => (
            <button key={conv.id} onClick={() => setActiveConv(conv.id)}
              className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition ${activeConv === conv.id ? "bg-blue-50" : ""}`}>
              <p className="font-medium text-sm text-gray-800 truncate">
                {(conv.participants as any)?.[0]?.company_name || (conv.participants as any)?.[0]?.full_name || "Conversation"}
              </p>
              {conv.last_message && <p className="text-xs text-gray-400 truncate mt-0.5">{conv.last_message.content}</p>}
            </button>
          ))}
        </div>
      </div>
      {activeConv ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="group flex flex-col items-start max-w-[70%]">
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm">
                  {showTranslated[msg.id] && msg.content_translated?.[locale] ? msg.content_translated[locale] : msg.content}
                </div>
                <button onClick={() => toggleTranslation(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition text-xs text-blue-500 mt-1 flex items-center gap-1">
                  {translating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                  {showTranslated[msg.id] ? "Original" : "Translate"}
                </button>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2">
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            <button type="submit" disabled={!newMessage.trim() || loading}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center"><div className="text-5xl mb-3">💬</div><p>Select a conversation</p></div>
        </div>
      )}
    </div>
  );
}
