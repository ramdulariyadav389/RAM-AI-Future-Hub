import { SEOData, FaqItem } from '../types';

export const SITE_NAME = 'AI Future Hub';

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

export function updatePageMetadata(seo: SEOData, faqs?: FaqItem[], imageUrl?: string) {
  if (typeof document === 'undefined') return;

  // 1. Page Title (Title rule: 50-60 characters, front-loaded keyword)
  document.title = seo.pageTitle;

  // 2. Meta Description (Description rule: 140-160 characters, contains main keyword)
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', seo.metaDescription);

  // 3. Keywords Meta Tag (Main keyword + 2 related keywords)
  const keywordsList = [seo.mainKeyword, ...seo.relatedKeywords].join(', ');
  let kwMeta = document.querySelector('meta[name="keywords"]');
  if (!kwMeta) {
    kwMeta = document.createElement('meta');
    kwMeta.setAttribute('name', 'keywords');
    document.head.appendChild(kwMeta);
  }
  kwMeta.setAttribute('content', keywordsList);

  // 4. Canonical Link
  const fullCanonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${seo.canonicalPath}`
    : seo.canonicalPath;

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
  if (imageUrl) {
    setMetaTag('property', 'og:image', imageUrl);
  }

  // 6. Twitter Card Tags
  setMetaTag('name', 'twitter:title', seo.pageTitle);
  setMetaTag('name', 'twitter:description', seo.metaDescription);
  if (imageUrl) {
    setMetaTag('name', 'twitter:image', imageUrl);
  }

  // 7. Schema.org JSON-LD Structured Data (including FAQPage for AEO)
  let schemaScript = document.getElementById('seo-structured-data');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'seo-structured-data';
    schemaScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(schemaScript);
  }

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${window.location.origin}/#website`,
        'url': window.location.origin,
        'name': SITE_NAME,
        'description': 'Understanding AI Today. Preparing for Tomorrow.',
      },
      {
        '@type': 'WebPage',
        '@id': `${fullCanonicalUrl}#webpage`,
        'url': fullCanonicalUrl,
        'name': seo.pageTitle,
        'description': seo.metaDescription,
        'keywords': keywordsList,
      }
    ]
  };

  // If FAQs are provided, add FAQPage entity for Answer Engine Optimization (AEO)
  if (faqs && faqs.length > 0) {
    structuredData['@graph'].push({
      '@type': 'FAQPage',
      'mainEntity': faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    });
  }

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
