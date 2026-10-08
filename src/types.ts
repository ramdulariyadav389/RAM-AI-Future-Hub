export interface ArticleSection {
  heading: string;
  subheading?: string;
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

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string; // e.g. "March 18, 2026"
  readTime: string; // e.g. "6 min read"
  wordCount: number;
  featured?: boolean;
  coverImage: string;
  summary: string;
  introduction: string[];
  sections: ArticleSection[];
  conclusion: string[];
  keyTakeaways: string[];
  tags: string[];
}

export type ActivePage = 'home' | 'articles' | 'about' | 'contact' | 'article-detail';
