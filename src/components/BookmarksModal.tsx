import React from 'react';
import { Article } from '../types';
import { X, Bookmark, ArrowRight, Trash2, BookOpen } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  bookmarkedIds: string[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  articles,
  bookmarkedIds,
  onSelectArticle,
  onToggleBookmark,
}) => {
  if (!isOpen) return null;

  const savedArticles = articles.filter((a) => bookmarkedIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Reading List</h3>
              <p className="text-xs text-slate-500">
                {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close saved articles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
          {savedArticles.length > 0 ? (
            savedArticles.map((art) => (
              <div
                key={art.id}
                className="pt-3.5 first:pt-0 flex items-start justify-between gap-4 group"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-1">
                    <span className="text-indigo-600 font-semibold uppercase">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold"
                    title="Read now"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleBookmark(art.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No saved articles yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the bookmark icon on any article card or reading view to save it to your reading list.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
