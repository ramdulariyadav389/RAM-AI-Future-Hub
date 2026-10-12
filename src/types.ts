export interface ArticleSection {
  heading: string; // Formatted as an AEO Question (e.g., "How Does AI Transform Smartphones?")
  subheading?: string;
  directAnswer?: string; // Concise 1-2 sentence direct answer for Answer Engine snippet capture
  paragraphs: string[];
  callout?: {
    title: string;
    text: string;
  };
  exampleBox?: {
    title: string;
    description: string;
    points: string[];
  };
}

export interface SEOData {
  pageTitle: string; // 50-60 chars, front-loaded keyword + brand
  metaDescription: string; // 140-160 chars, includes main keyword & CTA
  mainKeyword: string;
  relatedKeywords: [string, string];
  canonicalPath: string; // e.g. "/articles/how-artificial-intelligence-is-changing-everyday-life"
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  seo: SEOData;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  wordCount: number;
  featured?: boolean;
  coverImage: string;
  imageAlt: string; // Descriptive, keyword-rich alt text
  summary: string;
  introduction: string[];
  sections: ArticleSection[];
  conclusion: string[];
  keyTakeaways: string[];
  faqAeo?: FaqItem[];
  tags: string[];
}

export type ActivePage = 'home' | 'articles' | 'about' | 'contact' | 'article-detail';
