/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Tab, Note, NoteFilter, PriorityFilter, TabColor, ChecklistItem, Priority } from './types';
import {
  loadTabs,
  saveTabs,
  loadNotes,
  saveNotes,
  loadActiveTabId,
  saveActiveTabId,
} from './utils/storage';
import { INITIAL_TABS, INITIAL_NOTES } from './utils/constants';
import { Header } from './components/Header';
import { TabsBar } from './components/TabsBar';
import { TabStatsBar } from './components/TabStatsBar';
import { NoteCard } from './components/NoteCard';
import { TabModal } from './components/TabModal';
import { DeleteTabModal } from './components/DeleteTabModal';
import { NoteModal } from './components/NoteModal';
import { EmptyState } from './components/EmptyState';
import { ToastContainer, ToastMessage } from './components/Toast';
import { CheckCircle2, Sparkles, Layers, Search } from 'lucide-react';

export default function App() {
  // --- Persistent States ---
  const [tabs, setTabs] = useState<Tab[]>(() => loadTabs());
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [activeTabId, setActiveTabId] = useState<string>(() => loadActiveTabId(tabs));
  
  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tabbed_notes_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // --- Filtering & Searching ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<NoteFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [searchInAllTabs, setSearchInAllTabs] = useState(false);

  // --- Modals State ---
  const [isTabModalOpen, setIsTabModalOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<Tab | null>(null);

  const [isDeleteTabModalOpen, setIsDeleteTabModalOpen] = useState(false);
  const [deletingTab, setDeletingTab] = useState<Tab | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // --- Toast Messages ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success',
    onUndo?: () => void
  ) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type, onUndo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Sync with localStorage ---
  useEffect(() => {
    saveTabs(tabs);
  }, [tabs]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (activeTabId) {
      saveActiveTabId(activeTabId);
    }
  }, [activeTabId]);

  // Sync theme with <html> class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('tabbed_notes_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('tabbed_notes_theme', 'light');
    }
  }, [isDarkMode]);

  // Ensure active tab exists
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  // --- Tab Actions ---
  const handleOpenAddTab = () => {
    setEditingTab(null);
    setIsTabModalOpen(true);
  };

  const handleOpenEditTab = (tab: Tab) => {
    setEditingTab(tab);
    setIsTabModalOpen(true);
  };

  const handleOpenDeleteTab = (tab: Tab) => {
    setDeletingTab(tab);
    setIsDeleteTabModalOpen(true);
  };

  const handleSaveTab = (data: { name: string; color: TabColor }) => {
    if (editingTab) {
      // Update existing tab
      setTabs((prev) =>
        prev.map((t) =>
          t.id === editingTab.id
            ? { ...t, name: data.name, color: data.color }
            : t
        )
      );
      addToast('تم تحديث التبويب', `تم حفظ التعديلات على "${data.name}" بنجاح`);
    } else {
      // Create new tab
      const newTab: Tab = {
        id: 'tab_' + Date.now(),
        name: data.name,
        color: data.color,
        createdAt: Date.now(),
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
      addToast('تم إنشاء تبويب جديد', `تمت إضافة تبويب "${data.name}" بنجاح`);
    }
  };

  const handleConfirmDeleteTab = (tabId: string) => {
    const tabToDelete = tabs.find((t) => t.id === tabId);
    if (!tabToDelete) return;

    const remainingTabs = tabs.filter((t) => t.id !== tabId);
    if (remainingTabs.length === 0) {
      addToast('تنبيه', 'يجب أن يتبقى تبويب واحد على الأقل', 'warning');
      return;
    }

    const removedNotes = notes.filter((n) => n.tabId === tabId);

    // Perform deletion
    setTabs(remainingTabs);
    setNotes((prev) => prev.filter((n) => n.tabId !== tabId));
    setActiveTabId(remainingTabs[0].id);

    // Provide Undo toast
    addToast(
      'تم حذف التبويب',
      `تم حذف "${tabToDelete.name}" وملاحظاته`,
      'info',
      () => {
        setTabs((prev) => [...prev, tabToDelete]);
        setNotes((prev) => [...prev, ...removedNotes]);
        setActiveTabId(tabToDelete.id);
      }
    );
  };

  // --- Note Actions ---
  const handleOpenAddNote = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (data: {
    title: string;
    content: string;
    tabId: string;
    priority: Priority;
    isCompleted: boolean;
  }) => {
    if (editingNote) {
      // Edit existing note
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                title: data.title,
                content: data.content,
                tabId: data.tabId,
                priority: data.priority,
                updatedAt: Date.now(),
              }
            : n
        )
      );
      addToast('تم تحديث الملاحظة', `تم حفظ التعديلات على "${data.title}"`);
    } else {
      // Add new note
      const newNote: Note = {
        id: 'note_' + Date.now() + Math.random().toString(36).substring(2, 6),
        tabId: data.tabId || activeTabId,
        title: data.title,
        content: data.content,
        priority: data.priority,
        isCompleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
      addToast('تمت إضافة الملاحظة بنجاح', data.title);
    }
  };

  // The primary feature required by user:
  // "كذلك خيار عندما أضغط عليه يصبح لون الملاحظة خضراء دلالة على أنه تم الانتهاء من هذه الملاحظة"
  const handleToggleComplete = (noteId: string) => {
    let nowCompleted = false;
    let noteTitle = '';

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          nowCompleted = !n.isCompleted;
          noteTitle = n.title;
          return {
            ...n,
            isCompleted: nowCompleted,
            completedAt: nowCompleted ? Date.now() : undefined,
            updatedAt: Date.now(),
          };
        }
        return n;
      })
    );

    if (nowCompleted) {
      addToast(
        'أحسنت! تم إنجاز الملاحظة 🌟',
        'أصبح لون الملاحظة الآن أخضر دلالة على الانتهاء منها',
        'success'
      );
    } else {
      addToast(
        'تم استئناف الملاحظة',
        'عادت الملاحظة للونها الطبيعي كقيد التنفيذ',
        'info'
      );
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find((n) => n.id === noteId);
    if (!noteToDelete) return;

    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    addToast(
      'تم حذف الملاحظة',
      `تم حذف "${noteToDelete.title}"`,
      'info',
      () => {
        setNotes((prev) => [noteToDelete, ...prev]);
      }
    );
  };

  const handleTogglePin = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // --- Reset & Backup ---
  const handleResetData = () => {
    if (window.confirm('هل تريد بالتأكيد إعادة تعيين التطبيق للبيانات النموذجية الافتراضية؟')) {
      setTabs(INITIAL_TABS);
      setNotes(INITIAL_NOTES);
      setActiveTabId(INITIAL_TABS[0].id);
      addToast('تمت إعادة التعيين', 'تم استرجاع التبويبات والملاحظات الافتراضية');
    }
  };

  const handleExportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tabs,
      notes,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('تم تصدير البيانات', 'تم تنزيل ملف النسخة الاحتياطية بنجاح');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json.tabs) && Array.isArray(json.notes)) {
          setTabs(json.tabs);
          setNotes(json.notes);
          if (json.tabs[0]) {
            setActiveTabId(json.tabs[0].id);
          }
          addToast('تم استيراد البيانات', 'تم استعادة التبويبات والملاحظات بنجاح');
        } else {
          addToast('خطأ في الملف', 'الملف المحدد لا يحتوي على بيانات صالحة', 'error');
        }
      } catch (err) {
        addToast('خطأ في الاستيراد', 'تعذر قراءة ملف JSON', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Current active tab object
  const currentTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0] || {
      id: 'default',
      name: 'ملاحظاتي',
      color: 'indigo' as TabColor,
      createdAt: Date.now(),
    };
  }, [tabs, activeTabId]);

  // Notes belonging to current tab (for stats and counts)
  const tabNotes = useMemo(() => {
    return notes.filter((n) => n.tabId === currentTab.id);
  }, [notes, currentTab.id]);

  // Notes filtered and sorted for display
  const displayedNotes = useMemo(() => {
    // 1. Filter by Tab or Global Search
    let list = searchInAllTabs && searchQuery.trim()
      ? notes
      : notes.filter((n) => n.tabId === currentTab.id);

    // 2. Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((n) => {
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchChecklist = n.checklists?.some((c) =>
          c.text.toLowerCase().includes(q)
        );
        return matchTitle || matchContent || matchChecklist;
      });
    }

    // 3. Filter by completion status
    if (filter === 'active') {
      list = list.filter((n) => !n.isCompleted);
    } else if (filter === 'completed') {
      list = list.filter((n) => n.isCompleted);
    }

    // 4. Filter by priority (Urgent & important / Medium / Low)
    if (priorityFilter !== 'all') {
      list = list.filter((n) => n.priority === priorityFilter);
    }

    // 5. Natural sorting: pinned notes first, then newest
    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    });
  }, [notes, currentTab.id, searchQuery, filter, priorityFilter, searchInAllTabs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* App Header */}
      <Header
        tabs={tabs}
        notes={notes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Tabs Bar */}
      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        notes={notes}
        onSelectTab={(id) => {
          setActiveTabId(id);
          setSearchInAllTabs(false);
        }}
        onOpenAddTab={handleOpenAddTab}
        onOpenEditTab={handleOpenEditTab}
        onOpenDeleteTab={handleOpenDeleteTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Search Notice if searching globally */}
        {searchQuery.trim() && (
          <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                عرض نتائج البحث عن: <strong>"{searchQuery}"</strong> ({displayedNotes.length} ملاحظة)
              </span>
            </div>
            <button
              onClick={() => setSearchInAllTabs(!searchInAllTabs)}
              className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 font-semibold border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100/50 transition-colors cursor-pointer"
            >
              {searchInAllTabs ? 'البحث فقط في التبويب الحالي' : 'البحث في جميع التبويبات'}
            </button>
          </div>
        )}

        {/* Tab Header & Quick Stats Bar */}
        <TabStatsBar
          currentTab={currentTab}
          tabNotes={tabNotes}
          currentFilter={filter}
          onFilterChange={setFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          onOpenAddNote={handleOpenAddNote}
          onOpenEditTab={handleOpenEditTab}
          onOpenDeleteTab={handleOpenDeleteTab}
          canDeleteTab={tabs.length > 1}
        />

        {/* Notes Grid Display */}
        {displayedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEditNote}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type={
              searchQuery.trim()
                ? 'no-search'
                : priorityFilter !== 'all'
                ? 'no-priority'
                : filter !== 'all'
                ? 'no-filter'
                : 'no-notes'
            }
            filter={filter}
            priorityFilter={priorityFilter}
            searchQuery={searchQuery}
            onOpenAddNote={handleOpenAddNote}
            onClearSearch={() => setSearchQuery('')}
            onResetFilter={() => setFilter('all')}
            onResetPriority={() => setPriorityFilter('all')}
          />
        )}

      </main>

      {/* Floating Action Button for mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenAddNote}
          className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
          aria-label="إضافة ملاحظة جديدة"
        >
          <span className="text-2xl font-bold">+</span>
        </button>
      </div>

      {/* Modals */}
      <TabModal
        isOpen={isTabModalOpen}
        onClose={() => setIsTabModalOpen(false)}
        onSave={handleSaveTab}
        onDelete={handleOpenDeleteTab}
        editingTab={editingTab}
      />

      <DeleteTabModal
        isOpen={isDeleteTabModalOpen}
        onClose={() => setIsDeleteTabModalOpen(false)}
        onConfirmDelete={handleConfirmDeleteTab}
        tab={deletingTab}
        notes={notes}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        tabs={tabs}
        activeTabId={activeTabId}
        editingNote={editingNote}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
