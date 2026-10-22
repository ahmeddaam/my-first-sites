import React from 'react';
import { Plus, StickyNote, SearchX, CheckCircle2 } from 'lucide-react';
import { NoteFilter, PriorityFilter } from '../types';

interface EmptyStateProps {
  type: 'no-notes' | 'no-search' | 'no-filter' | 'no-priority';
  filter?: NoteFilter;
  priorityFilter?: PriorityFilter;
  searchQuery?: string;
  onOpenAddNote: () => void;
  onClearSearch?: () => void;
  onResetFilter?: () => void;
  onResetPriority?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  filter,
  priorityFilter,
  searchQuery,
  onOpenAddNote,
  onClearSearch,
  onResetFilter,
  onResetPriority,
}) => {
  if (type === 'no-search') {
    return (
      <div className="bg-white/50 dark:bg-slate-900/40 rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4 my-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <SearchX className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            لا توجد نتائج مطابقة لبحثك
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            لم نجد أي ملاحظات تتضمن: "{searchQuery}"
          </p>
        </div>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            مسح كلمة البحث
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-filter') {
    return (
      <div className="bg-white/50 dark:bg-slate-900/40 rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4 my-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {filter === 'completed'
              ? 'لا توجد ملاحظات منجزة (خضراء) حتى الآن'
              : 'لا توجد ملاحظات قيد التنفيذ'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {filter === 'completed'
              ? 'اضغط على زر "تعليم كـ منتهية" في أي ملاحظة لتتحول إلى اللون الأخضر وتظهر هنا.'
              : 'جميع الملاحظات الحالية في هذا التبويب مكتملة!'}
          </p>
        </div>
        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            عرض جميع الملاحظات
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-priority') {
    const priorityLabels: Record<string, string> = {
      high: 'العاجلة والمهمة',
      medium: 'متوسطة الأهمية',
      low: 'منخفضة الأهمية',
    };
    const label = (priorityFilter && priorityLabels[priorityFilter]) || '';

    return (
      <div className="bg-white/50 dark:bg-slate-900/40 rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4 my-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <StickyNote className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            لا توجد ملاحظات ذات أولوية {label}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            يمكنك إضافة ملاحظة جديدة بهذه الأولوية أو عرض جميع الأولويات.
          </p>
        </div>
        {onResetPriority && (
          <button
            onClick={onResetPriority}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            عرض جميع الأولويات
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-4 my-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
        <StickyNote className="w-8 h-8" />
      </div>
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          لا توجد ملاحظات في هذا التبويب بعد
        </h3>
      </div>
      <button
        onClick={onOpenAddNote}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة أول ملاحظة الآن</span>
      </button>
    </div>
  );
};
