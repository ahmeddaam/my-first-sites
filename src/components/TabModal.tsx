import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Trash2 } from 'lucide-react';
import { Tab, TabColor } from '../types';
import { TAB_COLORS } from '../utils/constants';

interface TabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; color: TabColor }) => void;
  onDelete?: (tab: Tab) => void;
  editingTab?: Tab | null;
}

export const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingTab,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState<TabColor>('indigo');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTab) {
      setName(editingTab.name);
      setColor(editingTab.color);
    } else {
      setName('');
      setColor('indigo');
    }
    setError('');
  }, [editingTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('يرجى كتابة اسم للتبويب');
      return;
    }
    onSave({
      name: trimmed,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTab ? 'تعديل التبويب' : 'إضافة تبويب جديد'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tab Name Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              اسم التبويب <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: مهام الأسبوع، مشاريع خاصة..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all"
            />
            {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2.5">
              لون التمييز
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {TAB_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                    color === c.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${c.dotClass} shadow-xs`} />
                  <span className="text-[10px] mt-1 text-slate-600 dark:text-slate-400 font-medium truncate max-w-full">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>



          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {editingTab && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(editingTab);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف التبويب</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingTab ? 'حفظ التعديلات' : 'إنشاء التبويب'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
