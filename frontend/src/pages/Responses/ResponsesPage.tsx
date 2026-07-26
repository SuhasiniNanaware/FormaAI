import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  MessageSquare, 
  User, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

// Mock Submissions Data
interface Submission {
  id: string;
  submittedAt: string;
  completionTime: string;
  answers: Record<string, any>;
}

export const ResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeForm, forms } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const currentForm = activeForm || forms[0];

  if (!currentForm) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">No forms available</h2>
        <p className="text-xs text-slate-400">Create a form first to start collecting responses.</p>
        <Button onClick={() => navigate('/create-form')}>Create Form</Button>
      </div>
    );
  }

  // Sample Mock Submissions for the active form
  const submissions: Submission[] = [
    {
      id: 'sub_101',
      submittedAt: '2026-07-22 14:32',
      completionTime: '1m 20s',
      answers: {
        'Full Name': 'Alex Rivera',
        'Email Address': 'alex.rivera@example.com',
        'Rating': '5 Stars',
        'Feedback': 'The AI generation was insanely fast! Loved the interactive preview.',
      },
    },
    {
      id: 'sub_102',
      submittedAt: '2026-07-22 12:15',
      completionTime: '2m 05s',
      answers: {
        'Full Name': 'Sarah Chen',
        'Email Address': 'sarah.c@techcorp.io',
        'Rating': '4 Stars',
        'Feedback': 'Great clean UI. Would love to see integration with Slack webhooks.',
      },
    },
    {
      id: 'sub_103',
      submittedAt: '2026-07-21 18:45',
      completionTime: '0m 55s',
      answers: {
        'Full Name': 'Michael Jordan',
        'Email Address': 'mjordan@fly.com',
        'Rating': '5 Stars',
        'Feedback': 'Seamless submission experience.',
      },
    },
  ];

  const filteredSubmissions = submissions.filter((sub) =>
    Object.values(sub.answers).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentForm.title}</h1>
              <Badge variant="emerald">Active</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review individual respondent records and entry data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary">
            <Download className="w-4 h-4 mr-1.5" /> CSV
          </Button>
          <Button size="sm" variant="secondary">
            <Download className="w-4 h-4 mr-1.5" /> JSON
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Entries</p>
            <p className="text-lg font-bold text-white">{submissions.length}</p>
          </div>
        </Card>

        <Card className="p-4 border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Avg Completion Time</p>
            <p className="text-lg font-bold text-white">1m 22s</p>
          </div>
        </Card>

        <Card className="p-4 border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Completion Rate</p>
            <p className="text-lg font-bold text-white">96.4%</p>
          </div>
        </Card>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entries by keyword..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Showing {filteredSubmissions.length} of {submissions.length} submissions</span>
        </div>
      </div>

      {/* Submissions List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Submissions */}
        <div className="lg:col-span-1 space-y-3">
          {filteredSubmissions.map((sub) => {
            const isSelected = selectedSubmission?.id === sub.id;
            const primaryName = sub.answers['Full Name'] || sub.id;

            return (
              <Card
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className={`p-4 border-slate-800 cursor-pointer transition ${
                  isSelected ? 'border-indigo-500 bg-slate-900/90 shadow-md shadow-indigo-500/10' : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-semibold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{primaryName}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {sub.submittedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-600 transition ${isSelected ? 'translate-x-1 text-indigo-400' : ''}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Detailed Inspector */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <Card glow className="p-6 border-indigo-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Submission Detail</h3>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {selectedSubmission.id}</p>
                </div>
                <div className="text-right text-xs text-slate-400 space-y-0.5">
                  <p>Submitted: <span className="text-slate-200">{selectedSubmission.submittedAt}</span></p>
                  <p>Time Spent: <span className="text-indigo-400 font-medium">{selectedSubmission.completionTime}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedSubmission.answers).map(([questionTitle, answerValue], idx) => (
                  <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5">
                    <p className="text-xs font-semibold text-indigo-300">{questionTitle}</p>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono">
                      {String(answerValue)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800 h-full flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600" />
              <p className="text-xs">Select a submission from the list to view detailed answers.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;