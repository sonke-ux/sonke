import React from 'react';
import { X, Inbox, CheckCircle2, AlertTriangle, Sparkles, Tag, Bell } from 'lucide-react';
import { InboxMessage } from '../types';

interface MunicipalInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: InboxMessage[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export const MunicipalInboxModal: React.FC<MunicipalInboxModalProps> = ({
  isOpen,
  onClose,
  messages,
  onMarkAllAsRead,
  onMarkAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Official Municipal Inbox</h3>
              <p className="text-xs text-slate-400">Ugu District Revenue & Water Communications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Messages ({messages.length})
            </span>
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notifications or notices in your inbox.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onMarkAsRead(msg.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  !msg.read
                    ? 'bg-slate-800/80 border-sky-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        msg.tag === 'Relief Incentive'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : msg.tag === 'Notice'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {msg.tag}
                    </span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                </div>

                <h4 className="font-bold text-white text-sm mb-1">{msg.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{msg.body}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-center flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close Inbox
          </button>
        </div>
      </div>
    </div>
  );
};
