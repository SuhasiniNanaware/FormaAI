import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, CheckCircle2, Clock, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeForm } = useFormContext();

  if (!activeForm) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">No active form selected</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{activeForm.title} - Analytics</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time completion rates and engagement metrics</p>
          </div>
        </div>

        <Button size="sm" variant="secondary">
          <Download className="w-4 h-4 mr-1.5" /> Export Data (CSV)
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Views</p>
              <p className="text-lg font-bold text-white">{activeForm.viewsCount || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Submissions</p>
              <p className="text-lg font-bold text-white">{activeForm.responsesCount || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Completion Rate</p>
              <p className="text-lg font-bold text-white">{activeForm.completionRate || 0}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-600/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Avg Time</p>
              <p className="text-lg font-bold text-white">1m 45s</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Question Performance Breakdown */}
      <Card className="p-6 border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white">Question Field Insights</h2>

        <div className="space-y-4">
          {activeForm.questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  {idx + 1}. {q.title}
                </span>
                <Badge variant="indigo" className="text-[10px] uppercase">
                  {q.type.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Response rate: <span className="text-emerald-400 font-medium">98%</span>
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;