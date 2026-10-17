import fs from "node:fs";
import path from "node:path";

const collection = {
  info: {
    _postman_id: "supplementdecoded-api-collection-v2",
    name: "SupplementDecoded API Collection",
    description: "Complete, production-ready Postman Collection for the SupplementDecoded / SupplementScience platform. Includes Service Token API, Content Management, Clinical Ingredients, Categories, Authors, Subscribers, Search, and Admin Operations.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{service_token}}",
        type: "string"
      }
    ]
  },
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:3000",
      type: "string",
      description: "Base URL of the application. Change to https://www.supplementdecoded.com for live production."
    },
    {
      key: "service_token",
      value: "sd_live_your_token_here",
      type: "string",
      description: "Service token generated in the Admin Console (starts with sd_live_)"
    },
    {
      key: "post_id",
      value: "00f691d6-1c89-42c3-9b03-645d0d305b02",
      type: "string",
      description: "Sample Post UUID or Slug for testing"
    },
    {
      key: "post_slug",
      value: "ashwagandha",
      type: "string",
      description: "Sample Post Slug"
    },
    {
      key: "category_id",
      value: "d5a5f92a-e57b-4319-aba8-a500e09f8e7d",
      type: "string",
      description: "Sample Category UUID"
    },
    {
      key: "category_slug",
      value: "stress-cortisol",
      type: "string",
      description: "Sample Category Slug"
    },
    {
      key: "author_id",
      value: "fc0943f9-08ff-4cb8-a52e-8f7b9c6d02f2",
      type: "string",
      description: "Sample Author UUID"
    },
    {
      key: "tag_id",
      value: "tag_uuid_here",
      type: "string",
      description: "Sample Tag UUID"
    },
    {
      key: "token_id",
      value: "service_token_uuid_here",
      type: "string",
      description: "UUID of a generated service token for management operations"
    },
    {
      key: "subscriber_id",
      value: "subscriber_uuid_here",
      type: "string",
      description: "Sample Subscriber UUID"
    }
  ],
  item: [
    {
      name: "1. Service Tokens & Auth",
      description: "Endpoints for token verification, capability probing, and NextAuth session handling.",
      item: [
        {
          name: "Verify Service Token (GET)",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{service_token}}",
                type: "text"
              }
            ],
            url: {
              raw: "{{baseUrl}}/api/service/verify?token={{service_token}}",
              host: ["{{baseUrl}}"],
              path: ["api", "service", "verify"],
              query: [
                {
                  key: "token",
                  value: "{{service_token}}",
                  description: "Optional query parameter fallback for token"
                }
              ]
            },
            description: "Verifies service token authentication, displays token metadata, days remaining until expiration, and active platform capabilities."
          }
        },
        {
          name: "Verify Service Token (POST)",
          request: {
            method: "POST",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{service_token}}",
                type: "text"
              },
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            url: {
              raw: "{{baseUrl}}/api/service/verify",
              host: ["{{baseUrl}}"],
              path: ["api", "service", "verify"]
            },
            description: "POST ping verification endpoint for automated health checks and webhook pinging."
          }
        },
        {
          name: "List Service Tokens (Admin)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/service-tokens",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "service-tokens"]
            },
            description: "Lists all generated service tokens with their name, token hint, usage dates, active status, and expiration."
          }
        },
        {
          name: "Create Service Token (Admin)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Automated Content Ingestion Agent",
                description: "Used by external publishing scripts to push and update monographs",
                expiresIn: "90d"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/service-tokens",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "service-tokens"]
            },
            description: "Generates a new secure live service token (sd_live_...). The raw token is returned once in the response."
          }
        },
        {
          name: "Toggle / Update Service Token (Admin)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                isActive: false
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/service-tokens/{{token_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "service-tokens", "{{token_id}}"]
            },
            description: "Activates or deactivates an existing service token without deleting it."
          }
        },
        {
          name: "Revoke / Delete Service Token (Admin)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/service-tokens/{{token_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "service-tokens", "{{token_id}}"]
            },
            description: "Permanently revokes and deletes a service token."
          }
        },
        {
          name: "NextAuth Get Session",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/auth/session",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "session"]
            },
            description: "Fetches current NextAuth browser session state."
          }
        },
        {
          name: "NextAuth Get CSRF Token",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/auth/csrf",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "csrf"]
            },
            description: "Fetches CSRF token for NextAuth browser credentials login."
          }
        }
      ]
    },
    {
      name: "2. Posts & Clinical Monographs",
      description: "Primary content management endpoints. Authenticated with Service Token (Bearer) or Admin Session.",
      item: [
        {
          name: "Get All Posts (with Filters)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/blog/posts?status=all&postType=ingredient&category=stress-cortisol",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts"],
              query: [
                {
                  key: "status",
                  value: "all",
                  description: "Status filter: all, published, or draft"
                },
                {
                  key: "postType",
                  value: "ingredient",
                  description: "Content format: blog, ingredient, guide, or review"
                },
                {
                  key: "category",
                  value: "stress-cortisol",
                  description: "Category slug filter"
                },
                {
                  key: "categoryId",
                  value: "{{category_id}}",
                  disabled: true,
                  description: "Category ID filter"
                },
                {
                  key: "search",
                  value: "ashwagandha",
                  disabled: true,
                  description: "Text search filter"
                }
              ]
            },
            description: "Queries posts with optional filters for status, postType, search text, and category."
          }
        },
        {
          name: "Get Single Post by ID or Slug",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/blog/posts/{{post_slug}}",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts", "{{post_slug}}"]
            },
            description: "Fetches full post data including author, category, and tags by UUID or slug."
          }
        },
        {
          name: "Create / Publish Post (POST)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Phosphatidylserine: Clinical Monograph & Cognitive Trials",
                slug: "phosphatidylserine-monograph",
                excerpt: "Evidence-based clinical review of Phosphatidylserine evaluating human RCTs on cognitive decline, working memory, and cortisol regulation.",
                content: "<h2>Executive Summary</h2><p>Phosphatidylserine (PS) is a phospholipid component of human cellular membranes, highly enriched in neural tissue.</p><h3>Key Clinical Outcomes</h3><p>Human randomized controlled trials demonstrate 300 mg/day supports working memory kinetics and blunts acute ACTH/cortisol response to mental stress.</p>",
                status: "PUBLISHED",
                postType: "ingredient",
                metaTitle: "Phosphatidylserine: Clinical Evidence & Dosage Guide",
                metaDescription: "Double-blind clinical monographs analyzing Phosphatidylserine bioactives and human trial outcomes.",
                featuredImageUrl: "/images/placeholders/sample.jpg",
                featuredImageAlt: "Phosphatidylserine phospholipid matrix",
                cardImageUrl: "/images/placeholders/sample.jpg",
                readTimeMinutes: 6,
                categoryId: "{{category_id}}",
                authorId: "{{author_id}}",
                tagIds: [],
                factCheckedBy: "SupplementDecoded Research Editorial Team",
                reviewedBy: "SupplementDecoded Research Editorial Team"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/blog/posts",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts"]
            },
            description: "Creates and optionally publishes a new post or monograph."
          }
        },
        {
          name: "Update Post by Body Identifier (PUT)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                slug: "phosphatidylserine-monograph",
                title: "Phosphatidylserine: Updated Clinical Monograph & New RCTs",
                content: "<h2>Updated Clinical Review</h2><p>Updated content with 2026 meta-analysis findings.</p>",
                status: "PUBLISHED"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/blog/posts",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts"]
            },
            description: "Updates an existing post by identifying it via slug or id in the JSON body."
          }
        },
        {
          name: "Partial Update Post by Body Identifier (PATCH)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                slug: "phosphatidylserine-monograph",
                status: "PUBLISHED"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/blog/posts",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts"]
            },
            description: "Partially updates an existing post by body identifier."
          }
        },
        {
          name: "Update Post by URL Path (PUT)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Ashwagandha (Withania somnifera): Updated 2026 Dossier",
                content: "<p>Updated monograph text with latest randomized controlled trials.</p>"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/blog/posts/{{post_slug}}",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts", "{{post_slug}}"]
            },
            description: "Updates a post directly using its ID or slug in the URL path."
          }
        },
        {
          name: "Delete Post by URL Path (DELETE)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/blog/posts/{{post_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "blog", "posts", "{{post_id}}"]
            },
            description: "Deletes a post by UUID or slug, syncing category counts and revalidating cache."
          }
        }
      ]
    },
    {
      name: "3. Admin Post Operations",
      description: "Direct management endpoints for post status, format type, and administrative editing.",
      item: [
        {
          name: "Admin: Get Post by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/posts/{{post_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "posts", "{{post_id}}"]
            },
            description: "Admin route to fetch post details with relations."
          }
        },
        {
          name: "Admin: Update Post Status (PATCH)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                status: "PUBLISHED"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/posts/{{post_id}}/status",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "posts", "{{post_id}}", "status"]
            },
            description: "Toggles post status between PUBLISHED and DRAFT."
          }
        },
        {
          name: "Admin: Update Post Type (PATCH)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                postType: "ingredient"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/posts/{{post_id}}/type",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "posts", "{{post_id}}", "type"]
            },
            description: "Changes the post format type (blog, review, guide, ingredient)."
          }
        },
        {
          name: "Admin: Delete Post (DELETE)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/posts/{{post_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "posts", "{{post_id}}"]
            },
            description: "Administrative post deletion."
          }
        }
      ]
    },
    {
      name: "4. Categories & Content Hubs",
      description: "Endpoints for category taxonomy, health topics, and pillar hub management.",
      item: [
        {
          name: "List All Categories",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/categories",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "categories"]
            },
            description: "Fetches all categories ordered by creation date."
          }
        },
        {
          name: "Create Category",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Mitochondrial Function",
                slug: "mitochondrial-function",
                description: "Clinical evidence for cellular bioenergetics, NAD+ boosters, and CoQ10 optimization.",
                metaTitle: "Mitochondrial & Cellular Energy Supplements",
                metaDescription: "Evidence-based reviews of mitochondrial enhancers and ATP precursors.",
                imageUrl: "/images/placeholders/sample.jpg",
                isHub: false
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/categories",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "categories"]
            },
            description: "Creates a new category."
          }
        },
        {
          name: "Update Category by ID",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Mitochondrial Health & Longevity",
                slug: "mitochondrial-function",
                description: "Updated clinical category description.",
                metaTitle: "Mitochondrial Health & Longevity",
                metaDescription: "Updated meta description."
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/categories/{{category_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "categories", "{{category_id}}"]
            },
            description: "Updates an existing category."
          }
        },
        {
          name: "Delete Category by ID",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/categories/{{category_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "categories", "{{category_id}}"]
            },
            description: "Deletes a category."
          }
        },
        {
          name: "Sync Category Post Counts",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/categories/sync-counts",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "categories", "sync-counts"]
            },
            description: "Recalculates and persists postCount for all categories based on published posts."
          }
        },
        {
          name: "List Hub Sections",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/sections",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "sections"]
            },
            description: "Fetches all categories designated as content hub sections (isHub: true)."
          }
        },
        {
          name: "Create Hub Section",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Longevity & Anti-Aging Pillar Hub",
                slug: "longevity-hub",
                description: "Comprehensive pillar hub exploring cellular senescence, sirtuin activation, and rapamycin analogs.",
                metaTitle: "Longevity & Healthy Aging Science",
                metaDescription: "Comprehensive scientific pillar hub on longevity science.",
                imageUrl: "/images/placeholders/sample.jpg"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/sections",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "sections"]
            },
            description: "Creates a new content hub section."
          }
        }
      ]
    },
    {
      name: "5. Authors & Editorial Team",
      description: "Manage clinical reviewers, medical authors, and editorial credentials.",
      item: [
        {
          name: "List Authors",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/authors",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "authors"]
            },
            description: "Lists all clinical authors and reviewers."
          }
        },
        {
          name: "Create Author",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Dr. Evelyn Reed, PharmD",
                slug: "dr-evelyn-reed",
                bio: "Clinical pharmacologist specializing in botanical bioactives, drug-nutrient interactions, and bioavailability enhancement.",
                expertise: "Pharmacokinetics & Natural Product Chemistry",
                qualification: "PharmD, Board-Certified Clinical Pharmacist",
                avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
                email: "evelyn.reed@supplementdecoded.com",
                socialLinks: {
                  twitter: "https://x.com/drevelynreed",
                  linkedin: "https://linkedin.com/in/drevelynreed"
                }
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/authors",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "authors"]
            },
            description: "Registers a new medical author/reviewer."
          }
        },
        {
          name: "Update Author by ID",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Dr. Evelyn Reed, PharmD, PhD",
                slug: "dr-evelyn-reed",
                bio: "Updated author biography and research focus."
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/authors/{{author_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "authors", "{{author_id}}"]
            },
            description: "Updates author details by ID."
          }
        },
        {
          name: "Delete Author by ID",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/authors/{{author_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "authors", "{{author_id}}"]
            },
            description: "Deletes an author record."
          }
        }
      ]
    },
    {
      name: "6. Tags & Taxonomies",
      description: "Manage classification tags for ingredients, guides, and reviews.",
      item: [
        {
          name: "List Tags",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/tags",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "tags"]
            },
            description: "Lists all available tags with post counts."
          }
        },
        {
          name: "Create Tag",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "AMPK Activator",
                slug: "ampk-activator",
                description: "Substances that modulate 5' AMP-activated protein kinase."
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/tags",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "tags"]
            },
            description: "Creates a new taxonomy tag."
          }
        },
        {
          name: "Update Tag by ID",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "AMPK Activators & Mimetics",
                slug: "ampk-activator",
                description: "Updated description"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/tags/{{tag_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "tags", "{{tag_id}}"]
            },
            description: "Updates an existing tag."
          }
        },
        {
          name: "Delete Tag by ID",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/tags/{{tag_id}}",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "tags", "{{tag_id}}"]
            },
            description: "Deletes a tag."
          }
        }
      ]
    },
    {
      name: "7. Subscribers & Newsletter",
      description: "Manage email newsletter subscribers and subscriptions.",
      item: [
        {
          name: "Admin: List Subscribers",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/subscribers?status=active",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "subscribers"],
              query: [
                {
                  key: "status",
                  value: "active",
                  description: "Status filter: active or inactive"
                },
                {
                  key: "search",
                  value: "gmail",
                  disabled: true,
                  description: "Search email text"
                }
              ]
            },
            description: "Admin endpoint to list newsletter subscribers."
          }
        },
        {
          name: "Admin: Toggle Subscriber Status",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                id: "{{subscriber_id}}",
                isActive: false
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/subscribers",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "subscribers"]
            },
            description: "Activates or deactivates a subscriber."
          }
        },
        {
          name: "Admin: Delete Subscriber",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                id: "{{subscriber_id}}"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/subscribers",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "subscribers"]
            },
            description: "Deletes a subscriber."
          }
        },
        {
          name: "Public: Subscribe Newsletter",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "clinical.researcher@example.com"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/newsletter/subscribe",
              host: ["{{baseUrl}}"],
              path: ["api", "newsletter", "subscribe"]
            },
            description: "Public newsletter signup."
          }
        },
        {
          name: "Public: Unsubscribe Newsletter",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "clinical.researcher@example.com"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/newsletter/subscribe",
              host: ["{{baseUrl}}"],
              path: ["api", "newsletter", "subscribe"]
            },
            description: "Public unsubscribe endpoint."
          }
        }
      ]
    },
    {
      name: "8. Search, Showcase & Media",
      description: "Live search, public monograph showcase feed, and asset uploads.",
      item: [
        {
          name: "Fuzzy Clinical Search",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/search?q=ashwagandha",
              host: ["{{baseUrl}}"],
              path: ["api", "search"],
              query: [
                {
                  key: "q",
                  value: "ashwagandha",
                  description: "Search keyword"
                }
              ]
            },
            description: "Fuzzy typo-tolerant search across published monographs and articles."
          }
        },
        {
          name: "Monographs Showcase Feed",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/monographs/showcase?category=stress-cortisol",
              host: ["{{baseUrl}}"],
              path: ["api", "monographs", "showcase"],
              query: [
                {
                  key: "category",
                  value: "stress-cortisol",
                  description: "Optional category filter"
                }
              ]
            },
            description: "Returns published ingredient monographs and active categories for public showcase components."
          }
        },
        {
          name: "Upload Image File (Multipart)",
          request: {
            method: "POST",
            header: [],
            body: {
              mode: "formdata",
              formdata: [
                {
                  key: "file",
                  type: "file",
                  src: "",
                  description: "Image file to upload (JPEG, PNG, WebP)"
                }
              ]
            },
            url: {
              raw: "{{baseUrl}}/api/upload",
              host: ["{{baseUrl}}"],
              path: ["api", "upload"]
            },
            description: "Uploads an image asset to /public/images/uploads/ and returns the relative URL."
          }
        }
      ]
    },
    {
      name: "9. Admin Console & Platform Ops",
      description: "System stats, dashboard metrics, and admin account management.",
      item: [
        {
          name: "Get Dashboard Metrics",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/admin/dashboard",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "dashboard"]
            },
            description: "Returns platform statistics: total posts, published counts, drafts, reviews, categories, subscribers, views, and recent activity."
          }
        },
        {
          name: "Update Admin Profile",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Editorial Director",
                email: "editor@supplementdecoded.com"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/update-profile",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "update-profile"]
            },
            description: "Updates current logged-in administrator name and email."
          }
        },
        {
          name: "Change Admin Credentials",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                currentPassword: "old_password",
                newPassword: "new_secure_password",
                newUsername: "superadmin"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/change-credentials",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "change-credentials"]
            },
            description: "Changes administrator password and/or username."
          }
        },
        {
          name: "Initialize Admin User (First-Run)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                username: "admin",
                password: "change_me_immediately",
                name: "Primary Administrator",
                email: "admin@supplementdecoded.com"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/admin/init",
              host: ["{{baseUrl}}"],
              path: ["api", "admin", "init"]
            },
            description: "Initializes the initial admin user if no admin exists."
          }
        }
      ]
    },
    {
      name: "10. Contact & Inquiries",
      description: "Editorial feedback, clinical corrections, and general contact inquiries.",
      item: [
        {
          name: "Submit Contact Inquiry",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Dr. Marcus Vance",
                email: "marcus.vance@clinic.org",
                topic: "clinical_correction",
                subject: "Ashwagandha Monograph Citation Update",
                evidenceLink: "https://pubmed.ncbi.nlm.nih.gov/31517876/",
                message: "Sharing newly published 2026 RCT on withanolide serum levels in healthy adults for inclusion in the monograph.",
                isAnonymous: false
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/contact",
              host: ["{{baseUrl}}"],
              path: ["api", "contact"]
            },
            description: "Submits editorial contact form or clinical correction inquiry."
          }
        }
      ]
    }
  ]
};

const collectionJson = JSON.stringify(collection, null, 2);

fs.writeFileSync("SupplementDecoded_API.postman_collection.json", collectionJson);
fs.writeFileSync("docs/SupplementDecoded_API.postman_collection.json", collectionJson);
console.log("Successfully generated SupplementDecoded_API.postman_collection.json!");

// Generate environment file
const environment = {
  id: "supplementdecoded-local-env",
  name: "SupplementDecoded (Local)",
  values: [
    {
      key: "baseUrl",
      value: "http://localhost:3000",
      type: "default",
      enabled: true
    },
    {
      key: "service_token",
      value: "sd_live_your_token_here",
      type: "secret",
      enabled: true
    },
    {
      key: "post_id",
      value: "00f691d6-1c89-42c3-9b03-645d0d305b02",
      type: "default",
      enabled: true
    },
    {
      key: "post_slug",
      value: "ashwagandha",
      type: "default",
      enabled: true
    },
    {
      key: "category_id",
      value: "d5a5f92a-e57b-4319-aba8-a500e09f8e7d",
      type: "default",
      enabled: true
    },
    {
      key: "category_slug",
      value: "stress-cortisol",
      type: "default",
      enabled: true
    },
    {
      key: "author_id",
      value: "fc0943f9-08ff-4cb8-a52e-8f7b9c6d02f2",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

const envJson = JSON.stringify(environment, null, 2);
fs.writeFileSync("SupplementDecoded.postman_environment.json", envJson);
fs.writeFileSync("docs/SupplementDecoded.postman_environment.json", envJson);
console.log("Successfully generated SupplementDecoded.postman_environment.json!");
