import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Tab, Note } from '../types';
import { TAB_COLORS } from '../utils/constants';

interface TabsBarProps {
  tabs: Tab[];
  activeTabId: string;
  notes: Note[];
  onSelectTab: (tabId: string) => void;
  onOpenAddTab: () => void;
  onOpenEditTab: (tab: Tab) => void;
  onOpenDeleteTab: (tab: Tab) => void;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  tabs,
  activeTabId,
  notes,
  onSelectTab,
  onOpenAddTab,
  onOpenEditTab,
  onOpenDeleteTab,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          
          {/* List of tabs */}
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const tabNotes = notes.filter((n) => n.tabId === tab.id);
            const total = tabNotes.length;
            const completed = tabNotes.filter((n) => n.isCompleted).length;
            const colorMeta = TAB_COLORS.find((c) => c.id === tab.color) || TAB_COLORS[0];

            return (
              <div
                key={tab.id}
                role="button"
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white border-transparent shadow-md shadow-slate-900/10 dark:shadow-emerald-950/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Accent Color Dot */}
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isActive ? 'bg-emerald-400 ring-2 ring-white/30' : colorMeta.dotClass
                  }`}
                />

                {/* Tab Name */}
                <span className="font-medium text-sm tracking-tight">{tab.name}</span>

                {/* Counter Pill */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : completed > 0 && completed === total
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300'
                  }`}
                  title={`${completed} مكتملة من أصل ${total}`}
                >
                  {total > 0 ? `${completed}/${total}` : '0'}
                </span>

                {/* Action Buttons: Edit and Delete */}
                <div className="flex items-center gap-1 mr-1 transition-opacity opacity-80 hover:opacity-100">
                  {/* Edit Tab Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditTab(tab);
                    }}
                    title="تعديل اسم أو لون التبويب"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Tab Button */}
                  {tabs.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDeleteTab(tab);
                      }}
                      title="حذف هذا التبويب"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'hover:bg-red-500/30 text-rose-200 hover:text-rose-100'
                          : 'hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Tab Button */}
          <button
            type="button"
            onClick={onOpenAddTab}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-dashed border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-500 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة تبويب جديد</span>
          </button>

        </div>
      </div>
    </div>
  );
};
