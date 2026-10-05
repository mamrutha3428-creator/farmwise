import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { markNotificationAsRead } from '../services/dataService';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onRefresh: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    onRefresh();
  };

  const handleMarkAll = async () => {
    for (const n of notifications) {
      if (!n.isRead) {
        await markNotificationAsRead(n.id);
      }
    }
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">{t('navNotifications')}</h3>
              <span className="text-[11px] text-stone-500">
                {notifications.filter((n) => !n.isRead).length} unread updates
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAll}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 hover:bg-emerald-50 rounded-lg"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <div
                key={`${notif.id}-${idx}`}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-stone-50/60 border-stone-200 text-stone-600'
                    : 'bg-emerald-50/40 border-emerald-200 text-stone-900 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold leading-tight">{notif.title}</h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2">
                  <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize">{notif.type} alert</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
