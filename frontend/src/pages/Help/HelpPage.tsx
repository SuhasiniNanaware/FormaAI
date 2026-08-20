import React, { useMemo, useState } from 'react';
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
  ExternalLink,
  CheckCircle2,
  Lightbulb,
  Link2,
  BarChart3,
  LockKeyhole,
  X,
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

interface GuideContent {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  points: string[];
}

const FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Getting Started',
    question: 'How does FormaAI construct forms from text?',
    answer:
      'FormaAI uses high-performance LLMs such as Google Gemini to convert natural language descriptions into structured JSON schemas. It automatically infers field types, labels, placeholder text, and validation logic.',
  },
  {
    id: 'faq_2',
    category: 'Getting Started',
    question: 'Can I edit the form after AI generation?',
    answer:
      'Absolutely! Once the AI processing finishes, you will be taken directly to the Interactive Form Builder. From there, you can reorder fields, add new options, change required toggles, or manually rewrite question prompts.',
  },
  {
    id: 'faq_3',
    category: 'Publishing & Sharing',
    question: 'How do I share my form or embed it on my website?',
    answer:
      'Navigate to the Publish tab for any form. You can copy a direct shareable link for standalone responses or grab an HTML iframe snippet to embed the form into platforms like Webflow, WordPress, React, or standard HTML sites.',
  },
  {
    id: 'faq_4',
    category: 'Responses & Data',
    question: 'Where can I view submitted form responses?',
    answer:
      'All submissions are collected in real-time. You can view individual submissions under the Responses page or check aggregated graphs, conversion stats, and drop-off rates on the Analytics dashboard.',
  },
  {
    id: 'faq_5',
    category: 'API & Settings',
    question: 'Can I use my own API keys?',
    answer:
      'Yes! Go to Settings > AI & API to input your custom OpenAI or Gemini API key. This allows the existing AI integration to use the configured developer credential.',
  },
];

const QUICK_CATEGORIES = [
  {
    id: 'ai',
    title: 'AI Generation Guide',
    icon: Sparkles,
    color: 'text-indigo-400',
    desc: 'Learn how to write prompts that produce useful forms.',
  },
  {
    id: 'embedding',
    title: 'Embedding & Exporting',
    icon: FileCode,
    color: 'text-purple-400',
    desc: 'Add forms to your website or work with form schemas.',
  },
  {
    id: 'analytics',
    title: 'Analytics & Exporting',
    icon: Zap,
    color: 'text-amber-400',
    desc: 'Track responses and understand form performance.',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    desc: 'Understand how form data and API credentials are handled.',
  },
];

const GUIDE_CONTENT: Record<string, GuideContent> = {
  ai: {
    title: 'AI Generation Guide',
    description:
      'Describe the form you want in natural language. The clearer your requirements are, the more useful the generated form will be.',
    icon: Sparkles,
    color: 'text-indigo-400',
    points: [
      'Describe the purpose of your form clearly.',
      'Mention the information you want to collect.',
      'Specify important field types such as email, date, rating, dropdown, or file upload.',
      'Mention which fields should be required.',
      'Add any useful validation or response requirements.',
    ],
  },

  embedding: {
    title: 'Embedding & Exporting',
    description:
      'Use the Publish workflow to make your forms available to users through a shareable link or embedded experience.',
    icon: FileCode,
    color: 'text-purple-400',
    points: [
      'Open the Publish page for the form you want to share.',
      'Use the shareable form link when you want users to access the form directly.',
      'Use the provided embed snippet when adding a form to a supported website.',
      'Keep your published form updated from the Form Builder when changes are required.',
      'Use the available form data and response features to continue working with collected information.',
    ],
  },

  analytics: {
    title: 'Analytics & Exporting',
    description:
      'The Analytics and Responses sections help you understand how users interact with your forms and review submitted information.',
    icon: BarChart3,
    color: 'text-amber-400',
    points: [
      'Open Responses to review submitted form entries.',
      'Use Analytics to understand submission and completion activity.',
      'Review conversion and completion information to identify potential drop-off areas.',
      'Use the available export functionality when you need response data outside Forma.',
      'Compare form activity over time to understand how your forms are performing.',
    ],
  },

  security: {
    title: 'Security & Privacy',
    description:
      'Forma separates form configuration, response data, and workspace preferences so you can manage your workspace more effectively.',
    icon: LockKeyhole,
    color: 'text-emerald-400',
    points: [
      'Keep your AI provider API keys private and never share them publicly.',
      'Only configure API credentials through the Settings page.',
      'Review collected responses regularly and only collect information your form actually needs.',
      'Use required fields intentionally so users are not forced to provide unnecessary information.',
      'Avoid placing passwords, private tokens, or other sensitive credentials inside form questions.',
    ],
  },
};

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] =
    useState('');

  const [openFaq, setOpenFaq] =
    useState<string | null>('faq_1');

  const [activeGuide, setActiveGuide] =
    useState<string | null>(null);

  /*
   * ======================================================
   * FAQ TOGGLE
   * ======================================================
   */

  const toggleFaq = (id: string) => {
    setOpenFaq(
      openFaq === id ? null : id
    );
  };

  /*
   * ======================================================
   * SEARCH
   * ======================================================
   */

  const filteredFaqs = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return FAQS;
    }

    return FAQS.filter((faq) => {
      return (
        faq.question
          .toLowerCase()
          .includes(query) ||
        faq.answer
          .toLowerCase()
          .includes(query) ||
        faq.category
          .toLowerCase()
          .includes(query)
      );
    });
  }, [searchQuery]);

  /*
   * ======================================================
   * GUIDE OPEN
   * ======================================================
   */

  const handleGuideClick = (
    guideId: string
  ) => {
    setActiveGuide(
      activeGuide === guideId
        ? null
        : guideId
    );

    setSearchQuery('');
  };

  /*
   * ======================================================
   * SEARCH RESULT FAQ
   * ======================================================
   */

  const handleSearchFaq = (
    faqId: string
  ) => {
    setActiveGuide(null);
    setOpenFaq(faqId);

    requestAnimationFrame(() => {
      document
        .getElementById(
          `faq-${faqId}`
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
    });
  };

  /*
   * ======================================================
   * CLEAR SEARCH
   * ======================================================
   */

  const clearSearch = () => {
    setSearchQuery('');
  };

  /*
   * ======================================================
   * ACTIVE GUIDE
   * ======================================================
   */

  const selectedGuide =
    activeGuide
      ? GUIDE_CONTENT[activeGuide]
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">

      {/* ==================================================
          HEADER BANNER
      ================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">

        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute -left-24 -bottom-28 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative text-center space-y-3">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold">

            <BookOpen className="w-3.5 h-3.5" />

            Documentation & Knowledge Base

          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How can we help you today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Search the Forma knowledge base,
            explore guides, or contact our
            support team.
          </p>

          {/* Search */}

          <div className="relative max-w-xl mx-auto pt-3">

            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-[27px] pointer-events-none" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search guides, questions, or keywords..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-11 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 shadow-xl transition"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-[25px] text-slate-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>

          {searchQuery && (
            <p className="text-[10px] text-slate-500">
              {filteredFaqs.length}{' '}
              result
              {filteredFaqs.length !== 1
                ? 's'
                : ''}{' '}
              found for "
              {searchQuery}"
            </p>
          )}

        </div>

      </div>

      {/* ==================================================
          QUICK CATEGORY CARDS
      ================================================== */}

      <div className="space-y-4">

        <div>

          <h2 className="text-sm font-bold text-white">
            Explore Help Topics
          </h2>

          <p className="text-[11px] text-slate-500 mt-1">
            Select a topic to see practical
            guidance for using Forma.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {QUICK_CATEGORIES.map(
            (cat) => {

              const Icon = cat.icon;

              const isActive =
                activeGuide === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    handleGuideClick(
                      cat.id
                    )
                  }
                  className="text-left"
                >

                  <Card
                    className={`h-full p-5 border-slate-800 transition-all duration-200 group ${
                      isActive
                        ? 'border-indigo-500/40 bg-slate-900/80'
                        : 'hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >

                    <div className="flex items-start justify-between">

                      <div
                        className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${
                          isActive
                            ? 'border-indigo-500/30'
                            : ''
                        }`}
                      >

                        <Icon
                          className={`w-5 h-5 ${cat.color} group-hover:scale-110 transition-transform duration-200`}
                        />

                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform ${
                          isActive
                            ? 'rotate-180 text-indigo-400'
                            : ''
                        }`}
                      />

                    </div>

                    <h3 className="text-xs font-bold text-white mt-4 group-hover:text-indigo-300 transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">
                      {cat.desc}
                    </p>

                  </Card>

                </button>
              );
            }
          )}

        </div>

      </div>

      {/* ==================================================
          ACTIVE GUIDE CONTENT
      ================================================== */}

      {selectedGuide && (
        <Card
          glow
          className="border-indigo-500/25 bg-indigo-500/[0.025] overflow-hidden"
        >

          <div className="p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">

                  <selectedGuide.icon
                    className={`w-5 h-5 ${selectedGuide.color}`}
                  />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-sm sm:text-base font-bold text-white">
                      {selectedGuide.title}
                    </h2>

                    <Badge
                      variant="indigo"
                      className="text-[9px]"
                    >
                      Guide
                    </Badge>

                  </div>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {selectedGuide.description}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveGuide(null)
                }
                className="text-slate-600 hover:text-white transition shrink-0"
                aria-label="Close guide"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

              {selectedGuide.points.map(
                (point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5"
                  >

                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">

                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />

                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {point}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

        </Card>
      )}

      {/* ==================================================
          FAQ ACCORDION SECTION
      ================================================== */}

      <div className="space-y-4">

        <div className="flex items-center justify-between gap-4">

          <h2 className="text-lg font-bold text-white flex items-center gap-2">

            <HelpCircle className="w-5 h-5 text-indigo-400" />

            Frequently Asked Questions

          </h2>

          <span className="text-xs text-slate-500 whitespace-nowrap">
            Showing{' '}
            {filteredFaqs.length}{' '}
            articles
          </span>

        </div>

        <div className="space-y-3">

          {filteredFaqs.map((faq) => {

            const isOpen =
              openFaq === faq.id;

            return (
              <Card
                key={faq.id}
                id={`faq-${faq.id}`}
                className={`border-slate-800 transition-all ${
                  isOpen
                    ? 'border-indigo-500/40 bg-slate-900/60'
                    : 'hover:border-slate-700'
                }`}
              >

                <button
                  type="button"
                  onClick={() =>
                    toggleFaq(faq.id)
                  }
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >

                  <div className="space-y-1.5">

                    <Badge
                      variant="indigo"
                      className="text-[9px]"
                    >
                      {faq.category}
                    </Badge>

                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      {faq.question}
                    </h3>

                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 text-indigo-400'
                        : ''
                    }`}
                  />

                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-slate-800/60 pt-4">

                    <div className="flex items-start gap-3">

                      <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>

                    </div>

                  </div>
                )}

              </Card>
            );
          })}

          {filteredFaqs.length === 0 && (
            <Card className="p-8 text-center border-dashed border-slate-800">

              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">

                <Search className="w-4 h-4 text-slate-500" />

              </div>

              <p className="text-xs text-slate-400 mt-3">
                No documentation found
                matching "
                {searchQuery}".
              </p>

              <p className="text-[10px] text-slate-600 mt-1">
                Try searching for forms,
                AI, publishing, responses,
                analytics, or API.
              </p>

              <Button
                size="sm"
                variant="secondary"
                className="mt-4"
                onClick={clearSearch}
              >
                Clear Search
              </Button>

            </Card>
          )}

        </div>

      </div>

      {/* ==================================================
          DIRECT CONTACT SUPPORT
      ================================================== */}

      <Card
        glow
        className="relative overflow-hidden border-indigo-500/25 bg-gradient-to-br from-indigo-500/[0.07] via-slate-900/70 to-purple-500/[0.04] p-6 sm:p-7"
      >

        <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 shrink-0 flex items-center justify-center">

              <MessageSquare className="w-5 h-5" />

            </div>

            <div>

              <div className="flex items-center gap-2 flex-wrap">

                <h3 className="text-sm sm:text-base font-bold text-white">
                  Still need assistance?
                </h3>

                <Badge
                  variant="indigo"
                  className="text-[9px]"
                >
                  Support
                </Badge>

              </div>

              <p className="text-xs text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                Can't find what you're looking
                for? Contact the Forma support
                team for help with troubleshooting,
                form workflows, or custom API
                requirements.
              </p>

              <div className="flex items-center gap-2 mt-3">

                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] text-slate-500">
                  Support is available by email
                </span>

              </div>

            </div>

          </div>

          <Button
            size="sm"
            onClick={() =>
              window.open(
                'mailto:support@forma.ai',
                '_blank'
              )
            }
            className="shrink-0"
          >
            Contact Support

            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />

          </Button>

        </div>

      </Card>

    </div>
  );
};

export default HelpPage;