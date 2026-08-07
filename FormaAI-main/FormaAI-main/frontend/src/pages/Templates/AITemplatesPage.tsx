import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  LayoutTemplate, 
  Briefcase, 
  GraduationCap, 
  Users, 
  ShoppingCart, 
  Headphones, 
  Calendar 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  fieldsCount: number;
  popular?: boolean;
}

const TEMPLATE_CATEGORIES = [
  'All',
  'HR & Hiring',
  'Customer Feedback',
  'Events & RSVP',
  'E-Commerce & Sales',
  'Education'
];

const TEMPLATES: Template[] = [
  {
    id: 'tpl_1',
    title: 'Customer Satisfaction Survey (CSAT)',
    description: 'Collect overall satisfaction, Net Promoter Score (NPS), feature preferences, and detailed feedback.',
    category: 'Customer Feedback',
    prompt: 'Create a Customer Satisfaction Survey with NPS rating scale (0-10), feature satisfaction checkboxes, and open-ended feedback text area.',
    fieldsCount: 5,
    popular: true,
  },
  {
    id: 'tpl_2',
    title: 'Software Engineer Job Application',
    description: 'Gather candidate contact info, portfolio link, years of experience, resume file upload, and tech skills selection.',
    category: 'HR & Hiring',
    prompt: 'Design a Software Engineer Job Application form requesting full name, email, GitHub/Portfolio URL, tech stack checkboxes, and resume file upload.',
    fieldsCount: 6,
    popular: true,
  },
  {
    id: 'tpl_3',
    title: 'Event Registration & RSVP',
    description: 'Streamline event check-ins with guest details, attendance confirmation, dietary restrictions, and date selection.',
    category: 'Events & RSVP',
    prompt: 'Build an Event RSVP form with guest name, email, attendance dropdown (Yes/No/Maybe), dietary requirements checkboxes, and plus-one count.',
    fieldsCount: 5,
    popular: true,
  },
  {
    id: 'tpl_4',
    title: 'Product Bug Report & Support Ticket',
    description: 'Allow users to submit technical issues with severity rating, reproduction steps, browser info, and screenshot upload.',
    category: 'Customer Feedback',
    prompt: 'Create a Product Bug Report form asking for issue title, description, bug severity dropdown, steps to reproduce, and file upload.',
    fieldsCount: 5,
  },
  {
    id: 'tpl_5',
    title: 'E-Commerce Product Order Form',
    description: 'Simple checkout/order request form asking for product selection, quantity, shipping address, and delivery date.',
    category: 'E-Commerce & Sales',
    prompt: 'Generate an order placement form with product dropdown list, quantity counter, shipping address text area, and preferred delivery date.',
    fieldsCount: 4,
  },
  {
    id: 'tpl_6',
    title: 'Student Course Evaluation Survey',
    description: 'Gather student feedback on course materials, instructor performance ratings, and improvement suggestions.',
    category: 'Education',
    prompt: 'Build a Course Evaluation form with 5-star ratings for course clarity, instructor responsiveness, multiple choice questions, and suggestion box.',
    fieldsCount: 6,
  },
];

export const AITemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAiPrompt } = useFormContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUseTemplate = (prompt: string) => {
    setAiPrompt(prompt);
    navigate('/ai-processing');
  };

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Template Gallery
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Start faster with pre-built prompts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick an AI-engineered template to generate tailored fields and validation rules instantly.
          </p>
        </div>

        <Button onClick={() => navigate('/create-form')} size="sm">
          <Sparkles className="w-4 h-4 mr-1.5" /> Blank Prompt
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            glow={template.popular}
            className="p-6 border-slate-800 flex flex-col justify-between gap-6 group hover:border-indigo-500/50 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="indigo" className="text-[10px]">
                  {template.category}
                </Badge>
                {template.popular && (
                  <Badge variant="emerald" className="text-[10px]">
                    Popular
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {template.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                ~{template.fieldsCount} AI fields
              </span>

              <Button
                size="sm"
                variant="secondary"
                className="group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                onClick={() => handleUseTemplate(template.prompt)}
              >
                Use Template <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800 space-y-3">
          <LayoutTemplate className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm">No templates found matching your search criteria.</p>
          <Button size="sm" variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AITemplatesPage;