import { Tab, Note } from '../types';
import { INITIAL_TABS, INITIAL_NOTES } from './constants';

const STORAGE_KEYS = {
  TABS: 'tabbed_notes_tabs_v1',
  NOTES: 'tabbed_notes_notes_v1',
  ACTIVE_TAB: 'tabbed_notes_active_tab_v1',
  THEME: 'tabbed_notes_theme_v1',
};

export const loadTabs = (): Tab[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TABS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load tabs from localStorage:', e);
  }
  return INITIAL_TABS;
};

export const saveTabs = (tabs: Tab[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
  } catch (e) {
    console.error('Failed to save tabs:', e);
  }
};

export const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load notes from localStorage:', e);
  }
  return INITIAL_NOTES;
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
};

export const loadActiveTabId = (tabs: Tab[]): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (saved && tabs.some(t => t.id === saved)) {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load active tab ID:', e);
  }
  return tabs[0]?.id || '';
};

export const saveActiveTabId = (tabId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
  } catch (e) {
    console.error('Failed to save active tab ID:', e);
  }
};
