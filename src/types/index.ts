export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  tabId: string;
  title: string;
  content: string;
  isCompleted: boolean;
  completedAt?: number;
  priority: Priority;
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
  checklists?: ChecklistItem[];
}

export interface Tab {
  id: string;
  name: string;
  color: TabColor;
  createdAt: number;
}

export type TabColor = 
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'orange';

export interface TabColorConfig {
  id: TabColor;
  label: string;
  bgLight: string;
  borderLight: string;
  textLight: string;
  activeBg: string;
  badgeBg: string;
  badgeText: string;
}

export type NoteFilter = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';
