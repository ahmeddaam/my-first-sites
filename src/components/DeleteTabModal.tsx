import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Tab, Note } from '../types';

interface DeleteTabModalProps {
  isOpen: boolean;
  tab: Tab | null;
  notes: Note[];
  onClose: () => void;
  onConfirmDelete: (tabId: string) => void;
}

export const DeleteTabModal: React.FC<DeleteTabModalProps> = ({
  isOpen,
  tab,
  notes,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !tab) return null;

  const tabNotesCount = notes.filter((n) => n.tabId === tab.id).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              تأكيد حذف التبويب
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              هل أنت متأكد من رغبتك في حذف تبويب <strong className="text-slate-900 dark:text-white">"{tab.name}"</strong>؟
            </p>
            {tabNotesCount > 0 ? (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 font-medium">
                تنبيه: يحتوي هذا التبويب على {tabNotesCount} ملاحظة ستُحذف نهائياً معه.
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                هذا التبويب فارغ ولا يحتوي على أي ملاحظات.
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDelete(tab.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>نعم، احذف التبويب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
