import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Send, Image as ImageIcon, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRoute } from "wouter";

const MOCK_MESSAGES = [
  { id: "1", senderId: "other", text: "Hi! Is the jacket still available?", time: "10:30 AM" },
  { id: "2", senderId: "me", text: "Yes, it is! Are you interested?", time: "10:35 AM" },
  { id: "3", senderId: "other", text: "Would you take $35 for it?", time: "10:38 AM" },
];

export default function ChatDetail() {
  const [match, params] = useRoute("/chat/:conversationId");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now().toString(), 
      senderId: "me", 
      text: input, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setInput("");
  };

  return (
    <AuthGuard>
      <AppLayout showNav={false}>
        <Header title="Sarah Connor" showBack />
        
        {/* Linked Product Banner */}
        <div className="bg-card p-3 border-b border-border flex items-center gap-3 shadow-sm sticky top-[60px] z-30">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1542272604-787c3835535d" alt="Product" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Vintage Denim Jacket</div>
            <div className="text-xs text-primary font-bold">$45.00</div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4 pb-24">
          <div className="text-center text-xs text-muted-foreground my-4">Today</div>
          
          {messages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.time}</span>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-card border-t border-border p-3 pb-safe z-50">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors flex-shrink-0">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors flex-shrink-0">
              <Camera className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-muted rounded-full flex items-center px-4 py-2">
              <input 
                type="text" 
                placeholder="Message..." 
                className="bg-transparent border-none outline-none w-full text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
            </div>
            <button 
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${input.trim() ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              onClick={handleSend}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}