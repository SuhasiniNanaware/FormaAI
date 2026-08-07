import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users, Eye, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { forms, setActiveForm } = useFormContext();

  const totalViews = forms.reduce((acc, f) => acc + (f.viewsCount || 0), 0);
  const totalResponses = forms.reduce((acc, f) => acc + (f.responsesCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your AI-crafted forms and monitor analytics in real-time.</p>
        </div>
        <Button onClick={() => navigate('/create-form')} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Create New Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Forms</p>
            <p className="text-xl font-bold text-white mt-0.5">{forms.length}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Views</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalViews}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Responses</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalResponses}</p>
          </div>
        </Card>
      </div>

      {/* Forms List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Your Active Forms</h2>
        </div>

        {forms.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800">
            <p className="text-sm">No forms created yet.</p>
            <Button size="sm" variant="secondary" className="mt-4" onClick={() => navigate('/create-form')}>
              Generate Your First Form
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <Card key={form.id} className="p-5 border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-base line-clamp-1">{form.title}</h3>
                    <Badge variant={form.status === 'published' ? 'emerald' : 'slate'} className="capitalize shrink-0">
                      {form.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{form.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
                  <span>{form.questions.length} questions</span>
                  <span>{form.responsesCount} responses</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setActiveForm(form);
                        navigate('/form-builder');
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveForm(form);
                        navigate('/analytics');
                      }}
                    >
                      <BarChart3 className="w-3.5 h-3.5 mr-1" /> Analytics
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;