import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, ArrowLeft, Bot, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I am your FormaAI real-time assistant. Ask me anything about building forms, validation schemas, deployment, or general questions, and I'll help you right away!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulated intelligent assistant engine handling any user query
    setTimeout(() => {
      let aiReply = "I understand your query. ";
      const query = userMessage.toLowerCase();

      if (query.includes('form') || query.includes('create') || query.includes('build')) {
        aiReply = "To build a form, you can head over to our AI generator dashboard where you can type prompts in plain English to generate fields, inputs, and validation instantly.";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        aiReply = "Hello there! How can I assist you with your project today?";
      } else if (query.includes('help') || query.includes('support')) {
        aiReply = "I'm here to support you! You can ask me about form templates, schema validation, analytics, or navigation.";
      } else if (query.includes('analytics') || query.includes('responses')) {
        aiReply = "Our platform tracks real-time telemetry, completion velocity, conversion metrics, and individual submission data under your dashboard tabs.";
      } else {
        aiReply = `That's a great question regarding "${userMessage}". As your AI assistant, I can help guide you through implementing features, configuring code blocks, or optimizing your workflow here in FormaAI.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative font-sans">
      
      {/* Background Lighting & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">FormaAI Expert Assistant</span>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-3xl mx-auto w-full px-4 py-6 flex-1 flex flex-col z-10">
        <Card glow className="flex-1 bg-slate-900/90 border-slate-800 backdrop-blur-xl flex flex-col justify-between shadow-2xl overflow-hidden">
          
          {/* Chat Header Banner */}
          <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-3">
            <img src="/Live chatbot.gif" alt="AI Bot" className="w-8 h-8 object-contain" />
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Expert Assistant Online</h2>
              <p className="text-[10px] text-slate-400 font-mono">Ready to answer any questions or guide your workflow</p>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[60vh]">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-indigo-300 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" />
                  <span className="ml-1">Assistant is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any question about forms, code, or features..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-3 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>

        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 z-10">
        <p>© {new Date().getFullYear()} FormaAI Real-time Assistance Protocol.</p>
      </footer>
    </div>
  );
};

export default AIAssistantPage;