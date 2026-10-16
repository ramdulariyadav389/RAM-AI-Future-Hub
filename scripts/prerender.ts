import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App.tsx';
import { ARTICLES } from '../src/data/articles.ts';
import { PAGE_SEO_CONFIG, generatePageSchema, PRODUCTION_DOMAIN, SITE_NAME } from '../src/utils/seo.ts';
import { SEOData, FaqItem, Article } from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

interface RouteConfig {
  path: string;
  outputPath: string;
  seo: SEOData;
  faqs?: FaqItem[];
  article?: Article;
  imageUrl?: string;
}

async function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`ERROR: Template file not found at ${templatePath}. Did you run "vite build" first?`);
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Build the list of all routes
  const routes: RouteConfig[] = [
    {
      path: '/',
      outputPath: path.join(distDir, 'index.html'),
      seo: PAGE_SEO_CONFIG.home,
    },
    {
      path: '/articles',
      outputPath: path.join(distDir, 'articles/index.html'),
      seo: PAGE_SEO_CONFIG.articles,
    },
    {
      path: '/about',
      outputPath: path.join(distDir, 'about/index.html'),
      seo: PAGE_SEO_CONFIG.about,
    },
    {
      path: '/contact',
      outputPath: path.join(distDir, 'contact/index.html'),
      seo: PAGE_SEO_CONFIG.contact,
    },
  ];

  // Add all 10 articles
  for (const article of ARTICLES) {
    routes.push({
      path: article.seo.canonicalPath,
      outputPath: path.join(distDir, `articles/${article.slug}/index.html`),
      seo: article.seo,
      faqs: article.faqAeo,
      article,
      imageUrl: article.coverImage,
    });
  }

  console.log(`Starting static pre-rendering (SSG) for ${routes.length} pages...`);

  for (const route of routes) {
    const canonicalUrl = `${PRODUCTION_DOMAIN}${route.seo.canonicalPath === '/' ? '/' : route.seo.canonicalPath}`;
    const keywordsString = [route.seo.mainKeyword, ...route.seo.relatedKeywords].join(', ');
    const schemaObj = generatePageSchema(route.seo, route.faqs, route.article);
    const schemaJson = JSON.stringify(schemaObj, null, 2);

    // Render component markup
    const appHtml = renderToString(
      React.createElement(App as React.ComponentType<{ initialPath?: string; initialArticle?: Article }>, {
        initialPath: route.path,
        initialArticle: route.article,
      })
    );

    // Inject metadata and pre-rendered body into the template
    let pageHtml = rawTemplate;

    // 1. Replace Title
    pageHtml = pageHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(route.seo.pageTitle)}</title>`
    );

    // 2. Replace Meta Description
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(route.seo.metaDescription)}" />`
    );

    // 3. Replace Meta Keywords
    if (pageHtml.includes('name="keywords"')) {
      pageHtml = pageHtml.replace(
        /<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="keywords" content="${escapeHtml(keywordsString)}" />`
      );
    } else {
      pageHtml = pageHtml.replace(
        '</head>',
        `  <meta name="keywords" content="${escapeHtml(keywordsString)}" />\n  </head>`
      );
    }

    // 4. Replace Canonical URL
    if (pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(
        /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
    } else {
      pageHtml = pageHtml.replace(
        '</head>',
        `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
      );
    }

    // 5. Replace OpenGraph Tags
    pageHtml = updateOrCreateMeta(pageHtml, 'property', 'og:title', route.seo.pageTitle);
    pageHtml = updateOrCreateMeta(pageHtml, 'property', 'og:description', route.seo.metaDescription);
    pageHtml = updateOrCreateMeta(pageHtml, 'property', 'og:url', canonicalUrl);
    pageHtml = updateOrCreateMeta(pageHtml, 'property', 'og:site_name', SITE_NAME);
    pageHtml = updateOrCreateMeta(pageHtml, 'property', 'og:type', route.article ? 'article' : 'website');
    const absoluteImageUrl = route.imageUrl
      ? (route.imageUrl.startsWith('http') ? route.imageUrl : `${PRODUCTION_DOMAIN}${route.imageUrl.startsWith('/') ? '' : '/'}${route.imageUrl}`)
      : undefined;
    if (absoluteImageUrl) {
      pageHtml = updateOrCreateMeta(pageHtml, 'property', 'og:image', absoluteImageUrl);
    }

    // 6. Replace Twitter Card Tags
    pageHtml = updateOrCreateMeta(pageHtml, 'name', 'twitter:card', 'summary_large_image');
    pageHtml = updateOrCreateMeta(pageHtml, 'name', 'twitter:title', route.seo.pageTitle);
    pageHtml = updateOrCreateMeta(pageHtml, 'name', 'twitter:description', route.seo.metaDescription);
    if (absoluteImageUrl) {
      pageHtml = updateOrCreateMeta(pageHtml, 'name', 'twitter:image', absoluteImageUrl);
    }

    // 7. Inject Schema.org JSON-LD
    const schemaTag = `<script id="seo-structured-data" type="application/ld+json">\n${schemaJson}\n    </script>`;
    if (pageHtml.includes('id="seo-structured-data"')) {
      pageHtml = pageHtml.replace(/<script\s+id=["']seo-structured-data["'].*?<\/script>/is, schemaTag);
    } else {
      pageHtml = pageHtml.replace('</head>', `  ${schemaTag}\n  </head>`);
    }

    // 8. Inject Server-Rendered HTML into root container
    pageHtml = pageHtml.replace(
      /<div\s+id=["']root["']>.*?<\/div>/s,
      `<div id="root">${appHtml}</div>`
    );

    // Ensure output directory exists and write pre-rendered HTML file
    const targetDir = path.dirname(route.outputPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(route.outputPath, pageHtml, 'utf-8');
    console.log(`  ✓ Pre-rendered: ${route.path} -> ${path.relative(distDir, route.outputPath)}`);
  }

  console.log(`Successfully generated static pre-rendered HTML for all ${routes.length} pages.`);
}

function updateOrCreateMeta(html: string, attrName: 'name' | 'property', attrValue: string, content: string): string {
  const regex = new RegExp(`<meta\\s+${attrName}=["']${attrValue}["']\\s+content=["'].*?["']\\s*\\/?>`, 'i');
  const newTag = `<meta ${attrName}="${attrValue}" content="${escapeHtml(content)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace('</head>', `    ${newTag}\n  </head>`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
