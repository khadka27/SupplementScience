import { Post } from "./types";

export function generateOrganizationSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SupplementDecoded",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://facebook.com/yourpage",
      "https://twitter.com/yourpage",
      "https://instagram.com/yourpage",
    ],
  };
}

export function generateWebsiteSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SupplementDecoded",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBlogPostSchema(post: Post, baseUrl: string) {
  const imageUrl = post.featuredImageUrl || `${baseUrl}/og-default.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    image: [imageUrl],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          url: `${baseUrl}/author/${post.author.slug}`,
          ...(post.author.avatarUrl && { image: post.author.avatarUrl }),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "SupplementDecoded",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    ...(post.category && {
      articleSection: post.category.name,
    }),
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags.map((tag: any) => tag.name).join(", "),
      }),
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    timeRequired: `PT${post.readTimeMinutes}M`,
  };
}

export function generateAuthorSchema(author: any, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${baseUrl}/author/${author.slug}`,
    description: author.bio,
    image: author.avatarUrl,
    sameAs: author.socialLinks
      ? (Object.values(author.socialLinks).filter(Boolean) as string[])
      : [],
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
