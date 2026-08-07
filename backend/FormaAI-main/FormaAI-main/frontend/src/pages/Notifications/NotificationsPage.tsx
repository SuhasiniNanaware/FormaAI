import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  Info, 
  Clock 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface Notification {
  id: string;
  type: 'submission' | 'ai' | 'system' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'submission',
    title: 'New Response Received',
    message: 'User sara.m@example.com submitted a new entry for "Customer Feedback Survey".',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'ai',
    title: 'AI Form Optimization Complete',
    message: 'Gemini AI improved field completion layout for "Job Application Form".',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'FormaAI platform updated to v2.4 with enhanced schema export capabilities.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'submission',
    title: 'Response Milestone Reached',
    message: 'Your form "Event Registration 2026" reached 100 total submissions!',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'API Rate Limit Warning',
    message: 'Your custom API key is approaching 80% daily quota limit.',
    time: '3 days ago',
    read: true,
  },
];

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'submission':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge variant="indigo" className="text-xs">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay updated on form submissions, AI enhancements, and system alerts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="secondary" onClick={markAllAsRead}>
              <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button size="sm" variant="secondary" onClick={clearAll}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
            filter === 'all'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
            filter === 'unread'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 border-slate-800 transition ${
              !notification.read ? 'bg-slate-900/80 border-indigo-500/30' : 'opacity-80'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" /> {notification.time}
                  </p>
                </div>
              </div>

              {/* Individual Item Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleRead(notification.id)}
                  title={notification.read ? 'Mark as unread' : 'Mark as read'}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <Card className="p-12 text-center border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              No notifications to display.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;