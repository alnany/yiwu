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
    if (showTranslated[msgId]) {
      setShowTranslated((prev) => ({ ...prev, [msgId]: false }));
      return;
    }
    setTranslating(true);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, target: locale }),
    });
    const data = await res.json();
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, content_translated: { ...m.content_translated, [locale]: data.translated } }
          : m
      )
    );
    setShowTranslated((prev) => ({ ...prev, [msgId]: true }));
    setTranslating(false);
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-ink-800 border border-ink-700/50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-ink-700/50 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-ink-700/50">
          <h2 className="font-display text-base font-medium text-cream">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-xs text-ink-500 text-center mt-8 leading-relaxed font-light">
              No conversations yet.<br />
              Message a manufacturer or designer to get started.
            </div>
          ) : (
            conversations.map((conv) => {
              const participant = (conv.participants as any)?.[0];
              const name = participant?.company_name || participant?.full_name || "Conversation";
              const initial = name.charAt(0).toUpperCase();
              const isActive = activeConv === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv.id)}
                  className={`w-full text-left p-4 border-b border-ink-700/30 transition-colors duration-200 flex items-center gap-3 ${
                    isActive ? "bg-gold/10 border-l-2 border-l-gold" : "hover:bg-ink-700/30"
                  }`}
                >
                  <div className="w-8 h-8 bg-ink-700 flex items-center justify-center text-gold font-display text-xs font-medium flex-shrink-0">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate font-medium ${isActive ? "text-cream" : "text-ink-200"}`}>
                      {name}
                    </p>
                    {conv.last_message && (
                      <p className="text-xs text-ink-500 truncate mt-0.5 font-light">
                        {conv.last_message.content}
                      </p>
                    )}
                  </div>
                  {conv.unread_count ? (
                    <span className="text-xs bg-gold text-ink-900 font-medium rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {conv.unread_count}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="group flex flex-col items-start max-w-[70%]">
                <div className="bg-ink-700 border border-ink-600/50 text-ink-100 px-4 py-3 text-sm font-light leading-relaxed">
                  {showTranslated[msg.id] && msg.content_translated?.[locale as keyof typeof msg.content_translated]
                    ? msg.content_translated[locale as keyof typeof msg.content_translated]
                    : msg.content}
                </div>
                <button
                  onClick={() => toggleTranslation(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-gold/60 hover:text-gold mt-1.5 flex items-center gap-1"
                >
                  {translating
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Languages className="w-3 h-3" />}
                  {showTranslated[msg.id] ? "Original" : "Translate"}
                </button>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-ink-700/50 flex gap-px">
            <input
              value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-ink-900 border border-ink-600 border-r-0 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-ink-600"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="bg-gold text-ink-900 px-4 hover:bg-gold-light disabled:opacity-40 transition-colors duration-300 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display text-xl text-ink-600">Select a conversation</p>
            <p className="text-xs text-ink-700 mt-2">to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
