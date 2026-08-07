import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, BarChart3, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

export const MyFormsPage: React.FC = () => {
  const navigate = useNavigate();
  const { forms, setActiveForm } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Forms</h1>
          <p className="text-xs text-slate-400 mt-1">All forms created under your account.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/create-form')}>
          <Plus className="w-4 h-4 mr-1.5" /> New Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800">
          <p className="text-sm">No forms found.</p>
          <Button size="sm" variant="secondary" className="mt-4" onClick={() => navigate('/create-form')}>
            Create your first form
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="p-5 border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={form.status === 'published' ? 'emerald' : 'slate'}>
                    {form.status}
                  </Badge>
                  <span className="text-[10px] text-slate-500">{form.questions.length} fields</span>
                </div>
                <h3 className="font-semibold text-white text-sm line-clamp-1">{form.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{form.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setActiveForm(form);
                    navigate('/form-builder');
                  }}
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveForm(form);
                    navigate('/preview');
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveForm(form);
                    navigate('/analytics');
                  }}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFormsPage;