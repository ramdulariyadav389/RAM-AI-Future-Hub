const BOOKMARKS_STORAGE_KEY = 'ai_future_hub_bookmarks';

export function getBookmarkedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkId(id: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getBookmarkedIds();
    const updated = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
