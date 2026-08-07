import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  MessageSquare, 
  FileCode, 
  Zap, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Getting Started',
    question: 'How does FormaAI construct forms from text?',
    answer: 'FormaAI uses high-performance LLMs (such as Google Gemini) to convert natural language descriptions into structured JSON schemas. It automatically infers field types (short answer, multiple choice, file upload), labels, placeholder text, and validation logic.'
  },
  {
    id: 'faq_2',
    category: 'Getting Started',
    question: 'Can I edit the form after AI generation?',
    answer: 'Absolutely! Once the AI processing finishes, you will be taken directly to the Interactive Form Builder. From there, you can reorder fields, add new options, change required toggles, or manually rewrite question prompts.'
  },
  {
    id: 'faq_3',
    category: 'Publishing & Sharing',
    question: 'How do I share my form or embed it on my website?',
    answer: 'Navigate to the Publish tab for any form. You can copy a direct shareable link for standalone responses or grab an HTML `<iframe>` snippet to embed the form into platforms like Webflow, WordPress, React, or standard HTML sites.'
  },
  {
    id: 'faq_4',
    category: 'Responses & Data',
    question: 'Where can I view submitted form responses?',
    answer: 'All submissions are collected in real-time. You can view individual submissions under the Responses page or check out aggregated graphs, conversion stats, and drop-off rates on the Analytics dashboard.'
  },
  {
    id: 'faq_5',
    category: 'API & Settings',
    question: 'Can I use my own API keys?',
    answer: 'Yes! Go to Settings > AI & API Keys to input your custom OpenAI or Gemini API key. This guarantees privacy and higher usage quotas directly connected to your developer account.'
  },
];

const QUICK_CATEGORIES = [
  { title: 'AI Generation Guide', icon: Sparkles, color: 'text-indigo-400', desc: 'Learn how to write prompts that produce perfect forms.' },
  { title: 'Embedding & Exporting', icon: FileCode, color: 'text-purple-400', desc: 'Add forms into your website or export full JSON schemas.' },
  { title: 'Analytics & Exporting', icon: Zap, color: 'text-amber-400', desc: 'Track response metrics and export submission CSVs.' },
  { title: 'Security & Privacy', icon: ShieldCheck, color: 'text-emerald-400', desc: 'Understand how your data and user entries are protected.' },
];

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>('faq_1');

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5" /> Documentation & Knowledge Base
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Explore quick-start guides, read answers to common questions, or contact our team.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, questions, or keywords..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xl"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-5.5" />
        </div>
      </div>

      {/* Quick Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Card
              key={idx}
              className="p-5 border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2 group"
            >
              <Icon className={`w-6 h-6 ${cat.color} group-hover:scale-110 transition-transform duration-300`} />
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                {cat.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {cat.desc}
              </p>
            </Card>
          );
        })}
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" /> Frequently Asked Questions
          </h2>
          <span className="text-xs text-slate-500">Showing {filteredFaqs.length} articles</span>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <Card
                key={faq.id}
                className={`border-slate-800 transition-all ${
                  isOpen ? 'border-indigo-500/40 bg-slate-900/60' : 'hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <Badge variant="indigo" className="text-[9px]">
                      {faq.category}
                    </Badge>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })}

          {filteredFaqs.length === 0 && (
            <Card className="p-8 text-center text-slate-500 border-dashed border-slate-800 space-y-2">
              <p className="text-xs">No documentation found matching "{searchQuery}".</p>
              <Button size="sm" variant="secondary" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Direct Contact Support Banner */}
      <Card glow className="p-6 border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Still need assistance?</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Our support team is available to help troubleshoot issues or handle custom API requirements.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => window.open('mailto:support@forma.ai')}>
          Contact Support <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </Card>
    </div>
  );
};

export default HelpPage;