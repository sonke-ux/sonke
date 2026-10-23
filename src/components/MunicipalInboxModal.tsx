import React, { useState, useEffect } from 'react';
import {
  X,
  Inbox,
  CheckCircle2,
  CheckCheck,
  Eye,
  Trash2,
  Bell,
  Sparkles,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { InboxMessage } from '../types';

interface MunicipalInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: InboxMessage[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearReadMessages?: () => void;
  onViewAndClearMessage?: (id: string) => void;
  onMarkAllReadyAndClear?: () => void;
  onRestoreMessages?: () => void;
}

export const MunicipalInboxModal: React.FC<MunicipalInboxModalProps> = ({
  isOpen,
  onClose,
  messages,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearReadMessages,
  onViewAndClearMessage,
  onMarkAllReadyAndClear,
  onRestoreMessages,
}) => {
  const [autoClearOnView, setAutoClearOnView] = useState<boolean>(true);
  const [viewingMessage, setViewingMessage] = useState<InboxMessage | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string>('');

  const unreadMessages = messages.filter((m) => !m.read);
  const readMessages = messages.filter((m) => m.read);

  // Clear viewing message when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setViewingMessage(null);
      setFeedbackToast('');
    }
  }, [isOpen]);

  const showToast = (text: string) => {
    setFeedbackToast(text);
    setTimeout(() => {
      setFeedbackToast('');
    }, 2800);
  };

  if (!isOpen) return null;

  // Handle viewing a message: marks as ready and clears inbox if auto-clear is enabled
  const handleSelectMessage = (msg: InboxMessage) => {
    onMarkAsRead(msg.id);
    setViewingMessage({
      ...msg,
      read: true,
      ready: true,
      viewedAt: 'Just now',
    });

    if (autoClearOnView) {
      if (onViewAndClearMessage) {
        onViewAndClearMessage(msg.id);
      } else if (onClearReadMessages) {
        onClearReadMessages();
      }
      showToast(`✓ Message "${msg.title.slice(0, 28)}..." marked as ready and cleared from inbox.`);
    } else {
      showToast('✓ Message marked as ready and viewed.');
    }
  };

  const handleManualClearViewing = () => {
    if (viewingMessage) {
      if (onViewAndClearMessage) {
        onViewAndClearMessage(viewingMessage.id);
      } else if (onClearReadMessages) {
        onClearReadMessages();
      }
      showToast('✓ Message marked as ready and cleared from inbox.');
      setViewingMessage(null);
    }
  };

  const handleMarkAllAndClear = () => {
    if (onMarkAllReadyAndClear) {
      onMarkAllReadyAndClear();
    } else {
      onMarkAllAsRead();
      if (onClearReadMessages) onClearReadMessages();
    }
    setViewingMessage(null);
    showToast('✓ All messages marked as ready and inbox cleared.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-lg">Official Municipal Inbox</h3>
                {messages.length === 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Inbox Cleared • Pin Removed
                  </span>
                ) : unreadMessages.length === 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> All Messages Ready • Pin Cleared
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                    {unreadMessages.length} Unread Notice{unreadMessages.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">City of uMhlathuze Revenue & Ratepayer Communications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2 flex-shrink-0">
          {/* Auto-Clear on View Switch */}
          <button
            onClick={() => {
              const nextState = !autoClearOnView;
              setAutoClearOnView(nextState);
              showToast(nextState ? 'Auto-clear on view enabled' : 'Auto-clear on view paused');
            }}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer"
            title="Automatically mark message as ready and clear from inbox once viewed"
          >
            {autoClearOnView ? (
              <ToggleRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-500" />
            )}
            <span className="text-[11px] font-medium">
              Auto-Clear on View: <strong className={autoClearOnView ? 'text-emerald-400' : 'text-slate-400'}>{autoClearOnView ? 'ON' : 'OFF'}</strong>
            </span>
          </button>

          {/* Quick Mark All Ready & Clear button */}
          {messages.length > 0 && (
            <button
              onClick={handleMarkAllAndClear}
              className="text-xs text-emerald-300 hover:text-white font-semibold cursor-pointer flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition shadow-sm"
              title="Mark all messages as ready and clear inbox immediately"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All as Ready & Clear</span>
            </button>
          )}
        </div>

        {/* Transient feedback toast */}
        {feedbackToast && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 text-xs px-6 py-2 flex items-center gap-2 animate-fadeIn flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{feedbackToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {/* Detailed Message Viewer if a message is opened */}
          {viewingMessage && (
            <div className="mb-4 p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-sky-500/40 shadow-xl space-y-3 relative animate-fadeIn">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Marked as Ready & Viewed
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {viewingMessage.tag}
                  </span>
                </div>
                <button
                  onClick={() => setViewingMessage(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Close message detail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-sm mb-1">{viewingMessage.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{viewingMessage.body}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Date: {viewingMessage.date} • Status: Ready</span>
                <button
                  onClick={handleManualClearViewing}
                  className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                  title="Remove this message from the inbox"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear from Inbox</span>
                </button>
              </div>
            </div>
          )}

          {/* Messages List or Empty State */}
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-base">Inbox Cleared & Up to Date</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  All messages have been viewed, marked as ready, and cleared from the active inbox. The unread notification pin has been removed.
                </p>
              </div>

              {onRestoreMessages && (
                <button
                  onClick={onRestoreMessages}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-sky-400 hover:text-sky-300 border border-slate-700 font-semibold text-xs transition cursor-pointer flex items-center gap-2"
                  title="Restore sample demo notices to test inbox again"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Demo Messages</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
                <span>Click any message to view, mark as ready, and clear:</span>
                <span>{messages.length} remaining</span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative group ${
                    !msg.read
                      ? 'bg-slate-800/90 border-sky-500/40 shadow-md ring-1 ring-sky-500/20 hover:bg-slate-800'
                      : 'bg-slate-900/50 border-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
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

                      {/* Read / Ready indicator */}
                      {msg.ready || msg.read ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Marked as Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                          Unread
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1 group-hover:text-sky-300 transition-colors">
                    {msg.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{msg.body}</p>

                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-sky-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <Eye className="w-3.5 h-3.5" /> Click to view and mark as ready
                    </span>
                    <span className="underline font-bold text-xs group-hover:text-sky-300">
                      {autoClearOnView ? 'View & Clear' : 'View Message'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center gap-3 flex-shrink-0">
          {messages.length > 0 && (
            <button
              onClick={handleMarkAllAndClear}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark as Ready & Clear Inbox</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
