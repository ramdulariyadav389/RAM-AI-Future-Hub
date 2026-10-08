/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ActivePage, Article } from './types';
import { ARTICLES } from './data/articles';
import { getBookmarkedIds, toggleBookmarkId } from './utils/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedArticles } from './components/FeaturedArticles';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleDetail } from './components/ArticleDetail';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookmarksModal } from './components/BookmarksModal';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarksModalOpen, setBookmarksModalOpen] = useState(false);

  // Initialize bookmarks from localStorage
  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
  }, []);

  // Handle URL hash changes for deep linking and back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setSelectedArticle(null);
        setActivePage('home');
        return;
      }

      if (hash.startsWith('article-')) {
        const slug = hash.replace('article-', '');
        const matched = ARTICLES.find((a) => a.slug === slug);
        if (matched) {
          setSelectedArticle(matched);
          setActivePage('article-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (hash === 'articles') {
        setSelectedArticle(null);
        setActivePage('articles');
        const el = document.getElementById('articles-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (hash === 'about') {
        setSelectedArticle(null);
        setActivePage('about');
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (hash === 'contact') {
        setSelectedArticle(null);
        setActivePage('contact');
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    };

    // Check hash on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleOpenSearchFocus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleBookmark = (articleId: string) => {
    const updated = toggleBookmarkId(articleId);
    setBookmarkedIds(updated);
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setSelectedArticle(null);

    if (page === 'home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'articles') {
      window.location.hash = 'articles';
      setTimeout(() => {
        const el = document.getElementById('articles-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (page === 'about') {
      window.location.hash = 'about';
      setTimeout(() => {
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (page === 'contact') {
      window.location.hash = 'contact';
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setActivePage('article-detail');
    window.location.hash = `article-${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedArticle(null);
    setActivePage('articles');
    window.location.hash = 'articles';
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenSearchFocus = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    }
    setActivePage('articles');
    window.location.hash = 'articles';
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  };

  // Get related articles (excluding the current one)
  const relatedArticles = selectedArticle
    ? ARTICLES.filter((a) => a.id !== selectedArticle.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        bookmarksCount={bookmarkedIds.length}
        onOpenBookmarks={() => setBookmarksModalOpen(true)}
        onOpenSearchFocus={handleOpenSearchFocus}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedArticle ? (
          /* Individual Full Article View */
          <ArticleDetail
            article={selectedArticle}
            onBack={handleBackFromDetail}
            onSelectArticle={handleSelectArticle}
            relatedArticles={relatedArticles}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          /* Homepage with all sections */
          <>
            {/* Hero Section */}
            <Hero
              onExploreClick={() => handleNavigate('articles')}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                // If user starts typing in hero search, scroll to articles section
                if (q.trim()) {
                  const el = document.getElementById('articles-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              totalArticles={ARTICLES.length}
            />

            {/* Featured Section */}
            <FeaturedArticles
              articles={ARTICLES}
              onReadArticle={handleSelectArticle}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* All Articles Section */}
            <ArticlesSection
              articles={ARTICLES}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onReadArticle={handleSelectArticle}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* About Section */}
            <AboutSection />

            {/* Contact Section */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigate('articles');
        }}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={bookmarksModalOpen}
        onClose={() => setBookmarksModalOpen(false)}
        articles={ARTICLES}
        bookmarkedIds={bookmarkedIds}
        onSelectArticle={handleSelectArticle}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}
