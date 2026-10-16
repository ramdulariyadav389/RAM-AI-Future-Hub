import { SEOData, FaqItem, Article } from '../types';

export const SITE_NAME = 'AI Future Hub';
export const PRODUCTION_DOMAIN = 'https://ram-ai-future-hub-bice.vercel.app';

// Static SEO metadata for primary pages
export const PAGE_SEO_CONFIG: Record<string, SEOData> = {
  home: {
    pageTitle: 'Future of Artificial Intelligence | AI Future Hub',
    metaDescription: 'Explore the future of artificial intelligence in everyday life, education, and business with 10 comprehensive, human-friendly research guides.',
    mainKeyword: 'Future of Artificial Intelligence',
    relatedKeywords: ['Everyday AI Technology', 'AI Educational Guides'],
    canonicalPath: '/',
  },
  articles: {
    pageTitle: 'Artificial Intelligence Blog Articles | AI Future Hub',
    metaDescription: 'Browse in-depth artificial intelligence blog articles covering healthcare, cybersecurity, ethics, and future technology trends for learners.',
    mainKeyword: 'Artificial Intelligence Blog Articles',
    relatedKeywords: ['Machine Learning Guides', 'AI Tech Trends'],
    canonicalPath: '/articles',
  },
  about: {
    pageTitle: 'About AI Future Hub: Responsible AI Literacy Guide',
    metaDescription: 'Learn about AI Future Hub’s mission to promote responsible AI literacy, demystify machine learning, and deliver ethical, evidence-based tech analysis.',
    mainKeyword: 'About AI Future Hub',
    relatedKeywords: ['Responsible AI Literacy', 'AI Editorial Standards'],
    canonicalPath: '/about',
  },
  contact: {
    pageTitle: 'Contact AI Future Hub | Editorial & Reader Inquiries',
    metaDescription: 'Contact the AI Future Hub editorial desk for inquiries, article feedback, topic suggestions, and technology education collaborations.',
    mainKeyword: 'Contact AI Future Hub',
    relatedKeywords: ['AI Editorial Inquiries', 'Technology Writer Feedback'],
    canonicalPath: '/contact',
  },
};

/**
 * Generates valid Schema.org JSON-LD structured data for WebSite, Organization,
 * Articles (BlogPosting), BreadcrumbList, and FAQPage.
 */
export function generatePageSchema(seo: SEOData, faqs?: FaqItem[], article?: Article): object {
  const canonicalUrl = `${PRODUCTION_DOMAIN}${seo.canonicalPath === '/' ? '' : seo.canonicalPath}`;

  const graph: any[] = [
    {
      '@type': 'WebSite',
      '@id': `${PRODUCTION_DOMAIN}/#website`,
      url: `${PRODUCTION_DOMAIN}/`,
      name: SITE_NAME,
      description: 'Understanding AI Today. Preparing for Tomorrow.',
      inLanguage: 'en-US',
      publisher: {
        '@type': 'Organization',
        '@id': `${PRODUCTION_DOMAIN}/#organization`,
        name: SITE_NAME,
        url: `${PRODUCTION_DOMAIN}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${PRODUCTION_DOMAIN}/favicon.svg`,
        },
      },
    },
    {
      '@type': 'Organization',
      '@id': `${PRODUCTION_DOMAIN}/#organization`,
      name: SITE_NAME,
      url: `${PRODUCTION_DOMAIN}/`,
      logo: `${PRODUCTION_DOMAIN}/favicon.svg`,
      description: 'An independent educational publication dedicated to making artificial intelligence clear, practical, and accessible for everyone.',
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: seo.pageTitle,
      description: seo.metaDescription,
      isPartOf: {
        '@id': `${PRODUCTION_DOMAIN}/#website`,
      },
      inLanguage: 'en-US',
    },
  ];

  // If this is an article page, append BlogPosting and BreadcrumbList schemas
  if (article) {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      isPartOf: {
        '@id': `${PRODUCTION_DOMAIN}/#website`,
      },
      headline: article.title,
      description: article.seo.metaDescription,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      datePublished: '2026-10-01T08:00:00+00:00',
      dateModified: '2026-10-14T08:00:00+00:00',
      inLanguage: 'en-US',
      articleSection: article.category,
      wordCount: article.wordCount,
      image: article.coverImage.startsWith('http')
        ? article.coverImage
        : `${PRODUCTION_DOMAIN}${article.coverImage.startsWith('/') ? '' : '/'}${article.coverImage}`,
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
        image: article.author.avatar,
      },
      publisher: {
        '@id': `${PRODUCTION_DOMAIN}/#organization`,
      },
      keywords: [article.seo.mainKeyword, ...article.seo.relatedKeywords].join(', '),
    });

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${PRODUCTION_DOMAIN}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Articles',
          item: `${PRODUCTION_DOMAIN}/articles`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: canonicalUrl,
        },
      ],
    });
  }

  // If FAQ / AEO Q&A items are provided, append FAQPage schema
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/**
 * Client-side DOM metadata updater for dynamic single-page navigation.
 */
export function updatePageMetadata(seo: SEOData, faqs?: FaqItem[], imageUrl?: string, article?: Article) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = seo.pageTitle;

  // 2. Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', seo.metaDescription);

  // 3. Keywords Meta Tag
  const keywordsList = [seo.mainKeyword, ...seo.relatedKeywords].join(', ');
  let kwMeta = document.querySelector('meta[name="keywords"]');
  if (!kwMeta) {
    kwMeta = document.createElement('meta');
    kwMeta.setAttribute('name', 'keywords');
    document.head.appendChild(kwMeta);
  }
  kwMeta.setAttribute('content', keywordsList);

  // 4. Canonical Link
  const fullCanonicalUrl = `${PRODUCTION_DOMAIN}${seo.canonicalPath === '/' ? '' : seo.canonicalPath}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullCanonicalUrl);

  // 5. OpenGraph Tags
  setMetaTag('property', 'og:title', seo.pageTitle);
  setMetaTag('property', 'og:description', seo.metaDescription);
  setMetaTag('property', 'og:url', fullCanonicalUrl);
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:type', article ? 'article' : 'website');
  if (imageUrl) {
    setMetaTag('property', 'og:image', imageUrl);
  }

  // 6. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', seo.pageTitle);
  setMetaTag('name', 'twitter:description', seo.metaDescription);
  if (imageUrl) {
    setMetaTag('name', 'twitter:image', imageUrl);
  }

  // 7. Schema.org JSON-LD Structured Data
  let schemaScript = document.getElementById('seo-structured-data');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'seo-structured-data';
    schemaScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(schemaScript);
  }

  const structuredData = generatePageSchema(seo, faqs, article);
  schemaScript.textContent = JSON.stringify(structuredData, null, 2);
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
