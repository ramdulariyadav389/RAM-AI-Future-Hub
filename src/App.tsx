/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Article } from './types';
import { ARTICLES } from './data/articles';
import { getBookmarkedIds, toggleBookmarkId } from './utils/storage';
import { updatePageMetadata, PAGE_SEO_CONFIG } from './utils/seo';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedArticles } from './components/FeaturedArticles';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleDetail } from './components/ArticleDetail';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookmarksModal } from './components/BookmarksModal';

interface AppProps {
  initialPath?: string;
  initialArticle?: Article;
}

export default function App({ initialPath, initialArticle }: AppProps = {}) {
  // Compute initial states from initial props (supports both SSG pre-rendering and SSR)
  const computeInitialState = (): { page: ActivePage; article: Article | null } => {
    if (initialArticle) {
      return { page: 'article-detail', article: initialArticle };
    }
    if (initialPath) {
      if (initialPath.startsWith('/articles/')) {
        const slug = initialPath.replace('/articles/', '').replace(/\/$/, '');
        const matched = ARTICLES.find((a) => a.slug === slug);
        if (matched) return { page: 'article-detail', article: matched };
      }
      if (initialPath === '/articles') return { page: 'articles', article: null };
      if (initialPath === '/about') return { page: 'about', article: null };
      if (initialPath === '/contact') return { page: 'contact', article: null };
    }
    return { page: 'home', article: null };
  };

  const initial = computeInitialState();
  const [activePage, setActivePage] = useState<ActivePage>(initial.page);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(initial.article);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarksModalOpen, setBookmarksModalOpen] = useState(false);

  // Initialize bookmarks from localStorage on client
  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
  }, []);

  // Parse path or hash to resolve active route on client
  const resolveRouteFromLocation = () => {
    if (typeof window === 'undefined') return;

    // Check pathname first (HTML5 clean URL), fallback to hash
    const pathname = window.location.pathname;
    const hash = window.location.hash.replace('#', '');

    // Check article route: /articles/:slug or #article-:slug
    let articleSlug = '';
    if (pathname.startsWith('/articles/')) {
      articleSlug = pathname.replace('/articles/', '').replace(/\/$/, '');
    } else if (hash.startsWith('article-')) {
      articleSlug = hash.replace('article-', '');
    }

    if (articleSlug) {
      const matched = ARTICLES.find((a) => a.slug === articleSlug);
      if (matched) {
        setSelectedArticle(matched);
        setActivePage('article-detail');
        updatePageMetadata(matched.seo, matched.faqAeo, matched.coverImage, matched);
        return;
      }
    }

    // Check /articles or #articles
    if (pathname === '/articles' || hash === 'articles') {
      setSelectedArticle(null);
      setActivePage('articles');
      updatePageMetadata(PAGE_SEO_CONFIG.articles);
      return;
    }

    // Check /about or #about
    if (pathname === '/about' || hash === 'about') {
      setSelectedArticle(null);
      setActivePage('about');
      updatePageMetadata(PAGE_SEO_CONFIG.about);
      return;
    }

    // Check /contact or #contact
    if (pathname === '/contact' || hash === 'contact') {
      setSelectedArticle(null);
      setActivePage('contact');
      updatePageMetadata(PAGE_SEO_CONFIG.contact);
      return;
    }

    // Default: Home
    setSelectedArticle(null);
    setActivePage('home');
    updatePageMetadata(PAGE_SEO_CONFIG.home);
  };

  // Listen to popstate (browser back/forward) and hashchange
  useEffect(() => {
    resolveRouteFromLocation();

    const handlePopState = () => {
      resolveRouteFromLocation();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
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

  // Good URL routing handler: updates history.pushState with clean URL & syncs metadata
  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setSelectedArticle(null);

    let path = '/';
    if (page === 'articles') path = '/articles';
    else if (page === 'about') path = '/about';
    else if (page === 'contact') path = '/contact';

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    if (PAGE_SEO_CONFIG[page]) {
      updatePageMetadata(PAGE_SEO_CONFIG[page]);
    }

    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'articles') {
      setTimeout(() => {
        const el = document.getElementById('articles-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (page === 'about') {
      setTimeout(() => {
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (page === 'contact') {
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Navigate to individual article with unique URL: /articles/:slug
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setActivePage('article-detail');

    const path = article.seo.canonicalPath;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    updatePageMetadata(article.seo, article.faqAeo, article.coverImage, article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedArticle(null);
    setActivePage('articles');
    window.history.pushState(null, '', '/articles');
    updatePageMetadata(PAGE_SEO_CONFIG.articles);
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
    window.history.pushState(null, '', '/articles');
    updatePageMetadata(PAGE_SEO_CONFIG.articles);
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
          /* Individual Full Article View (Unique URL: /articles/:slug) */
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
                if (q.trim()) {
                  const el = document.getElementById('articles-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              totalArticles={ARTICLES.length}
            />

            {/* Featured Section: Explore the Future of AI */}
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
            <AboutSection onExploreArticles={() => handleNavigate('articles')} />

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
