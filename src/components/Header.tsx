import React, { useState } from 'react';
import { ActivePage } from '../types';
import { Sparkles, Bookmark, Menu, X, Search, Compass, BookOpen, Info, Mail } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage, sectionId?: string) => void;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  onOpenSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  bookmarksCount,
  onOpenBookmarks,
  onOpenSearchFocus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' as ActivePage, icon: Compass },
    { label: 'Articles', page: 'articles' as ActivePage, icon: BookOpen },
    { label: 'About', page: 'about' as ActivePage, icon: Info },
    { label: 'Contact', page: 'contact' as ActivePage, icon: Mail },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            aria-label="AI Future Hub Home"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight shadow-sm group-hover:bg-indigo-600 transition-colors">
              <span className="text-sm font-black tracking-tighter">AI</span>
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                AI Future Hub
              </span>
              <span className="block text-[11px] font-medium tracking-wide uppercase text-slate-500">
                Technology & Society
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Utility Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenSearchFocus}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60"
              aria-label="Search articles"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search articles...</span>
              <kbd className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                /
              </kbd>
            </button>

            <button
              onClick={onOpenBookmarks}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Saved reading list"
              aria-label={`Reading list: ${bookmarksCount} articles saved`}
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 text-slate-600 hover:text-indigo-600 rounded-lg"
              aria-label="Saved articles"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="pt-1 pb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearchFocus();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-500 bg-slate-100 rounded-lg border border-slate-200"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search 10 articles...</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Saved articles: {bookmarksCount}</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookmarks();
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              View Saved Articles
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
