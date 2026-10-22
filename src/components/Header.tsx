import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  ListTodo,
  Sun,
  Moon,
  RotateCcw,
  Download,
  Upload,
  Search,
} from 'lucide-react';
import { Tab, Note } from '../types';

interface HeaderProps {
  tabs: Tab[];
  notes: Note[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  tabs,
  notes,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const completedCount = notes.filter((n) => n.isCompleted).length;
  const totalNotes = notes.length;
  const completionPercentage = totalNotes > 0 ? Math.round((completedCount / totalNotes) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  ملاحظاتي
                </h1>
              </div>
            </div>

            {/* Mobile dark mode & actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onToggleDarkMode}
                aria-label="تبديل المظهر"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث في كافة الملاحظات والمهام..."
              className="w-full pl-4 pr-10 py-2 rounded-xl text-sm bg-slate-100/90 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Overall Stats Pills */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-xl text-xs border border-slate-200/60 dark:border-slate-800">
              <span className="flex items-center gap-1 px-2 py-1 text-slate-600 dark:text-slate-300">
                <ListTodo className="w-3.5 h-3.5 text-indigo-500" />
                <span>{totalNotes} ملاحظة</span>
              </span>
              <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <span className="flex items-center gap-1 px-2 py-1 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{completedCount} مكتملة ({completionPercentage}%)</span>
              </span>
            </div>

            {/* Actions: Export / Import / Reset / Theme */}
            <div className="flex items-center gap-1">
              <button
                onClick={onExportData}
                title="تصدير نسخة احتياطية (JSON)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <label
                title="استيراد نسخة احتياطية"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>

              <button
                onClick={onResetData}
                title="إعادة التعيين إلى البيانات الافتراضية"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleDarkMode}
                aria-label="تبديل المظهر"
                title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الليلي'}
                className="hidden md:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
