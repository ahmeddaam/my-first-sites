import React from 'react';
import {
  Plus,
  CheckCircle2,
  Filter,
  AlertTriangle,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Tab, Note, NoteFilter, PriorityFilter } from '../types';
import { TAB_COLORS } from '../utils/constants';

interface TabStatsBarProps {
  currentTab: Tab;
  tabNotes: Note[];
  currentFilter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (priority: PriorityFilter) => void;
  onOpenAddNote: () => void;
  onOpenEditTab?: (tab: Tab) => void;
  onOpenDeleteTab?: (tab: Tab) => void;
  canDeleteTab?: boolean;
}

export const TabStatsBar: React.FC<TabStatsBarProps> = ({
  currentTab,
  tabNotes,
  currentFilter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onOpenAddNote,
  onOpenEditTab,
  onOpenDeleteTab,
  canDeleteTab = true,
}) => {
  const total = tabNotes.length;
  const completed = tabNotes.filter((n) => n.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const colorMeta = TAB_COLORS.find((c) => c.id === currentTab.color) || TAB_COLORS[0];

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6 space-y-4">
      {/* Top Row: Active Tab Title + Progress Bar + Tab Controls + Add Note Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title and Progress details (No Tab Icon) */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2.5">
            <span className={`w-3.5 h-3.5 rounded-full ${colorMeta.dotClass} shrink-0 ring-4 ring-slate-100 dark:ring-slate-800`} />
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentTab.name}
              </h2>

              {/* Quick Tab Edit Button */}
              {onOpenEditTab && (
                <button
                  type="button"
                  onClick={() => onOpenEditTab(currentTab)}
                  title="تعديل اسم أو لون هذا التبويب"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pr-6">
            {total === 0
              ? 'لا توجد ملاحظات بعد في هذا التبويب'
              : completed === total
              ? 'رائع! لقد أتممت جميع ملاحظات هذا التبويب بالكامل 🌟'
              : `أنجزت ${completed} من إجمالي ${total} ملاحظة (${percentage}%)`}
          </p>

          {/* Progress Bar */}
          {total > 0 && (
            <div className="w-full max-w-md pt-1 pr-6">
              <div className="h-2.5 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Delete Tab & Add Note */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* EXPLICIT TAB DELETE BUTTON */}
          {onOpenDeleteTab && canDeleteTab && (
            <button
              type="button"
              onClick={() => onOpenDeleteTab(currentTab)}
              title="حذف هذا التبويب وملاحظاته"
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-bold text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:border-rose-400 transition-all cursor-pointer whitespace-nowrap shadow-2xs active:scale-95"
            >
              <Trash2 className="w-4 h-4 stroke-[2.2]" />
              <span>حذف التبويب</span>
            </button>
          )}

          {/* Add Note Button */}
          <button
            type="button"
            onClick={onOpenAddNote}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 shadow-md shadow-emerald-600/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>إضافة ملاحظة جديدة</span>
          </button>
        </div>

      </div>

      {/* Bottom Row: Filters (Completion Status & Priority Filter) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        
        {/* Status Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-slate-400 dark:text-slate-500 ml-1 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            الحالة:
          </span>

          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              currentFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الكل ({total})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              currentFilter === 'active'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            قيد التنفيذ ({total - completed})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              currentFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>المنجزة (بالأخضر) ({completed})</span>
          </button>
        </div>

        {/* Priority Filter (Replacing the previous sorting dropdown as requested) */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            تصفية الأولوية:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as PriorityFilter)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <option value="all">جميع الأولويات</option>
            <option value="high">🚨 عاجلة ومهمة</option>
            <option value="medium">⚡ متوسطة الأهمية</option>
            <option value="low">🌱 منخفضة الأهمية</option>
          </select>
        </div>

      </div>
    </div>
  );
};
