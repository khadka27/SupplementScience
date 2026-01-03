import { Post } from './supabase';

export function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Site Name',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/yourpage',
      'https://twitter.com/yourpage',
      'https://instagram.com/yourpage'
    ]
  };
}

export function generateWebsiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Your Site Name',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateBlogPostSchema(post: Post, baseUrl: string) {
  const imageUrl = post.featured_image_url || `${baseUrl}/og-default.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || '',
    image: [imageUrl],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      url: `${baseUrl}/author/${post.author.slug}`,
      ...(post.author.avatar_url && { image: post.author.avatar_url })
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Your Site Name',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`
    },
    ...(post.category && {
      articleSection: post.category.name
    }),
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.map(tag => tag.name).join(', ')
    }),
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    timeRequired: `PT${post.read_time_minutes}M`
  };
}

export function generateAuthorSchema(author: any, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${baseUrl}/author/${author.slug}`,
    description: author.bio,
    image: author.avatar_url,
    sameAs: author.social_links ? Object.values(author.social_links).filter(Boolean) : []
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
