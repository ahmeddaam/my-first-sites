import React from 'react';
import {
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Pin,
  Clock,
  Check,
  Copy,
} from 'lucide-react';
import { Note, Priority } from '../types';

interface NoteCardProps {
  note: Note;
  onToggleComplete: (noteId: string) => void;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin?: (noteId: string) => void;
}

const PRIORITY_META: Record<Priority, { label: string; class: string }> = {
  high: {
    label: 'أولوية عاجلة',
    class: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  },
  medium: {
    label: 'أولوية متوسطة',
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  },
  low: {
    label: 'أولوية منخفضة',
    class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  },
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onToggleComplete,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = note.content ? `${note.title}\n\n${note.content}` : note.title;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Intl.DateTimeFormat('ar-EG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(note.updatedAt || note.createdAt));



  return (
    <div
      className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
        /* THE GREEN THEME FOR COMPLETED NOTES */
        note.isCompleted
          ? 'bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-teal-50/60 dark:from-emerald-950/50 dark:via-emerald-950/30 dark:to-teal-950/20 border-2 border-emerald-500 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/20 hover:border-emerald-600'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          
          {/* Priority / Completed Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs shadow-emerald-600/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>تم الإنجاز بنجاح</span>
              </span>
            ) : (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  PRIORITY_META[note.priority]?.class || PRIORITY_META.medium.class
                }`}
              >
                {PRIORITY_META[note.priority]?.label || 'أولوية عادية'}
              </span>
            )}

            {note.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
                <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>مثبتة</span>
              </span>
            )}
          </div>

          {/* Card Top Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {onTogglePin && (
              <button
                type="button"
                onClick={() => onTogglePin(note.id)}
                title={note.isPinned ? 'إلغاء التثبيت' : 'تثبيت الملاحظة'}
                className={`p-1.5 rounded-xl transition-colors ${
                  note.isPinned
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              title="نسخ الملاحظة"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onEdit(note)}
              title="تعديل الملاحظة"
              className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(note.id)}
              title="حذف الملاحظة"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Note Title */}
        <h3
          className={`text-base sm:text-lg font-bold tracking-tight mb-2 transition-all ${
            note.isCompleted
              ? 'text-emerald-950 dark:text-emerald-100'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {note.title}
        </h3>

        {/* Note Content */}
        {note.content && (
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap break-words mb-4 ${
              note.isCompleted
                ? 'text-emerald-900/80 dark:text-emerald-200/80'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {note.content}
          </p>
        )}


      </div>

      {/* Footer: Date & The Main Toggle Completion Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>

        {/* PRIMARY TOGGLE BUTTON FOR GREEN STATUS (AS SPECIFIED BY USER) */}
        <button
          type="button"
          onClick={() => onToggleComplete(note.id)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
            note.isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/30'
              : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60'
          }`}
        >
          {note.isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 fill-white text-emerald-700 dark:text-emerald-900" />
              <span>مكتملة باللون الأخضر (انقر للإلغاء)</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 stroke-[2.2]" />
              <span>تعليم كـ منتهية (تلوين بالأخضر)</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
