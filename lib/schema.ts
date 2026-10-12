import { Post } from "./types";
import { getPostHref } from "./utils";

/**
 * 1. Organization Schema (every page, in <head>)
 * Link: #organization
 */
export function generateOrganizationSchema(
  baseUrl: string = "https://www.supplementdecoded.com",
) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${cleanBaseUrl}/#organization`,
    name: "SupplementDecoded",
    url: `${cleanBaseUrl}/`,
    logo: `${cleanBaseUrl}/logo.png`,
    description:
      "Independent, evidence-based supplement information. No affiliate links, no sponsored content, no manufacturer compensation.",
    publishingPrinciples: `${cleanBaseUrl}/editorial-policy`,
    correctionsPolicy: `${cleanBaseUrl}/editorial-policy`,
    ethicsPolicy: `${cleanBaseUrl}/editorial-independence`,
    knowsAbout: [
      "Dietary Supplements",
      "Clinical Trial Evidence",
      "Supplement Safety & Bioavailability",
      "Pharmacology & Nutrient Interactions",
      "Evidence-Based Nutritional Science",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial research inquiries",
      url: `${cleanBaseUrl}/contact`,
    },
  };
}

/**
 * 2. Editorial Team Entity Schema (every article, review, and guide page)
 * Link: #editorial-team
 */
export function generateEditorialTeamSchema(
  baseUrl: string = "https://www.supplementdecoded.com",
) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${cleanBaseUrl}/#editorial-team`,
    name: "SupplementDecoded Research Editorial Team",
    url: `${cleanBaseUrl}/about`,
    parentOrganization: {
      "@id": `${cleanBaseUrl}/#organization`,
    },
    description:
      "Editorial team that checks supplement marketing claims against published research and regulator guidance from the FDA, NIH, NCCIH, CDC, and peer-reviewed journals.",
    publishingPrinciples: `${cleanBaseUrl}/editorial-policy`,
    knowsAbout: [
      "Systematic Reviews & Meta-Analyses",
      "Randomized Controlled Trial (RCT) Evaluation",
      "Supplement Claim Verification",
      "Regulatory Guidance (FDA, FTC, EFSA)",
    ],
  };
}

/**
 * 3. WebSite Schema (homepage only)
 * Link: #website
 */
export function generateWebsiteSchema(
  baseUrl: string = "https://www.supplementdecoded.com",
) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${cleanBaseUrl}/#website`,
    name: "SupplementDecoded",
    url: `${cleanBaseUrl}/`,
    publisher: {
      "@id": `${cleanBaseUrl}/#organization`,
    },
  };
}

/**
 * 4. BlogPosting Schema (every article, review, and guide page)
 */
export function generateBlogPostSchema(
  post: Post,
  baseUrl: string = "https://www.supplementdecoded.com",
) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const canonicalPath = getPostHref(post);
  const articleUrl = `${cleanBaseUrl}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;

  let imageUrl: string;
  if (post.featuredImageUrl) {
    imageUrl =
      post.featuredImageUrl.startsWith("http://") ||
      post.featuredImageUrl.startsWith("https://")
        ? post.featuredImageUrl
        : `${cleanBaseUrl}${post.featuredImageUrl.startsWith("/") ? "" : "/"}${post.featuredImageUrl}`;
  } else {
    imageUrl = `${cleanBaseUrl}/og-default.jpg`;
  }

  const datePublished = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : "2026-10-12T00:00:00Z";
  const dateModified = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    image: [imageUrl],
    datePublished,
    dateModified,
    author: {
      "@id": `${cleanBaseUrl}/#editorial-team`,
    },
    publisher: {
      "@id": `${cleanBaseUrl}/#organization`,
    },
    isPartOf: {
      "@id": `${cleanBaseUrl}/#website`,
    },
    inLanguage: "en-US",
    mainEntityOfPage: articleUrl,
    ...(post.category?.name && {
      articleSection: post.category.name,
    }),
  };
}

/**
 * 5. BreadcrumbList Schema (every article, review, and guide page)
 * Enforces absolute URLs across all items.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  baseUrl: string = "https://www.supplementdecoded.com",
) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      let itemUrl = item.url;
      if (!itemUrl.startsWith("http://") && !itemUrl.startsWith("https://")) {
        itemUrl = `${cleanBaseUrl}${itemUrl.startsWith("/") ? "" : "/"}${itemUrl}`;
      }
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: itemUrl,
      };
    }),
  };
}

export interface ClaimReviewItem {
  claimReviewed: string;
  ratingValue: 1 | 2 | 3 | 4 | 5;
  alternateName:
    | "False"
    | "Mostly false"
    | "Unproven"
    | "Misleading"
    | "Mostly true"
    | "True";
  productName: string;
  datePublished?: string | Date;
}

/**
 * 6. ClaimReview Schema (teardown articles only)
 * Follows strict anti-spam guidelines: Never includes seller landing-page URLs.
 */
export function generateClaimReviewSchema(
  claims: ClaimReviewItem[],
  articleUrl: string,
  baseUrl: string = "https://www.supplementdecoded.com",
) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return claims.map((claim) => ({
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: articleUrl,
    claimReviewed: claim.claimReviewed,
    reviewRating: {
      "@type": "Rating",
      ratingValue: claim.ratingValue,
      bestRating: 5,
      worstRating: 1,
      alternateName: claim.alternateName,
    },
    author: {
      "@id": `${cleanBaseUrl}/#editorial-team`,
    },
    datePublished: claim.datePublished
      ? new Date(claim.datePublished).toISOString()
      : new Date().toISOString(),
    itemReviewed: {
      "@type": "Claim",
      author: {
        "@type": "Organization",
        name: `${claim.productName} product landing page`,
      },
    },
  }));
}

/**
 * Backward compatibility stubs
 */
export function generateAuthorSchema(author: any, baseUrl: string) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${cleanBaseUrl}/author/${author.slug}`,
    description: author.bio,
    image: author.avatarUrl,
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
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
