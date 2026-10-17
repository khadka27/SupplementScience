# 📮 SupplementDecoded API - Postman Collection & Guide

This directory contains the official **Postman Collection (v2.1)** and **Postman Environment** covering all **47 endpoints** across the SupplementDecoded / SupplementScience platform.

---

## 📁 Files Included

1. **Collection JSON**: [`SupplementDecoded_API.postman_collection.json`](file:///home/khadka27/Desktop/SupplementScience/SupplementDecoded_API.postman_collection.json) (also mirrored at [`docs/SupplementDecoded_API.postman_collection.json`](file:///home/khadka27/Desktop/SupplementScience/docs/SupplementDecoded_API.postman_collection.json))
2. **Environment JSON**: [`SupplementDecoded.postman_environment.json`](file:///home/khadka27/Desktop/SupplementScience/SupplementDecoded.postman_environment.json) (also mirrored at [`docs/SupplementDecoded.postman_environment.json`](file:///home/khadka27/Desktop/SupplementScience/docs/SupplementDecoded.postman_environment.json))
3. **Generator Script**: [`scripts/generate_postman_collection.ts`](file:///home/khadka27/Desktop/SupplementScience/scripts/generate_postman_collection.ts) (Run via `npm run postman:generate`)

---

## 🚀 How to Import into Postman

1. Open **Postman**.
2. Click **Import** in the top left corner (or press `Ctrl+O` / `Cmd+O`).
3. Select or drag & drop:
   - `SupplementDecoded_API.postman_collection.json`
   - `SupplementDecoded.postman_environment.json`
4. In the top right environment dropdown, select **SupplementDecoded (Local)**.
5. Set your `service_token` variable:
   - Open the environment editor in Postman or edit the collection variables.
   - Paste your generated Service Token (e.g., `sd_live_...`).
   - All requests will automatically inherit the token via `Bearer {{service_token}}`.

---

## 🗂️ Collection Structure (10 Categories, 47 Requests)

### 1. Service Tokens & Auth (8 Requests)
- `GET /api/service/verify?token={{service_token}}` - Check token validity, remaining days, and capabilities.
- `POST /api/service/verify` - POST ping verification for webhook/script health checks.
- `GET /api/admin/service-tokens` - List all generated tokens with usage metadata.
- `POST /api/admin/service-tokens` - Create a new live token with custom expiration.
- `PATCH /api/admin/service-tokens/:id` - Toggle active/inactive state of a token.
- `DELETE /api/admin/service-tokens/:id` - Permanently revoke and delete a token.
- `GET /api/auth/session` - Fetch current NextAuth session state.
- `GET /api/auth/csrf` - Fetch CSRF token for browser authentication.

### 2. Posts & Clinical Monographs (7 Requests)
- `GET /api/blog/posts` - List posts with query filters (`status`, `postType`, `category`, `search`).
- `GET /api/blog/posts/:id` - Fetch single post by UUID or slug with full relation data.
- `POST /api/blog/posts` - Create and publish a new monograph or article.
- `PUT /api/blog/posts` - Update an existing post by passing `slug` or `id` in the JSON body.
- `PATCH /api/blog/posts` - Partial update an existing post by body identifier.
- `PUT /api/blog/posts/:id` - Update a post directly using the URL path (`:id` or `:slug`).
- `DELETE /api/blog/posts/:id` - Delete a post by URL path, syncing category counts.

### 3. Admin Post Operations (4 Requests)
- `GET /api/admin/posts/:id` - Admin get post by ID.
- `PATCH /api/admin/posts/:id/status` - Quick-toggle status between `PUBLISHED` and `DRAFT`.
- `PATCH /api/admin/posts/:id/type` - Change format type (`blog`, `ingredient`, `guide`, `review`).
- `DELETE /api/admin/posts/:id` - Administrative post deletion.

### 4. Categories & Content Hubs (7 Requests)
- `GET /api/admin/categories` - List all categories with post counts.
- `POST /api/admin/categories` - Create a new category.
- `PUT /api/admin/categories/:id` - Update category metadata, SEO, and slug.
- `DELETE /api/admin/categories/:id` - Delete category.
- `POST /api/admin/categories/sync-counts` - Recalculate published post counts for all categories.
- `GET /api/admin/sections` - List content hub pillar sections (`isHub: true`).
- `POST /api/admin/sections` - Create a new content hub section.

### 5. Authors & Editorial Team (4 Requests)
- `GET /api/admin/authors` - List medical authors and reviewers.
- `POST /api/admin/authors` - Register an author with credentials, expertise, and social links.
- `PUT /api/admin/authors/:id` - Update author profile and bio.
- `DELETE /api/admin/authors/:id` - Remove an author.

### 6. Tags & Taxonomies (4 Requests)
- `GET /api/admin/tags` - List all taxonomy tags.
- `POST /api/admin/tags` - Create a new topic tag.
- `PUT /api/admin/tags/:id` - Update tag name or slug.
- `DELETE /api/admin/tags/:id` - Delete a tag.

### 7. Subscribers & Newsletter (5 Requests)
- `GET /api/admin/subscribers` - List email subscribers with status filter (`active`/`inactive`).
- `PATCH /api/admin/subscribers` - Toggle subscriber active status.
- `DELETE /api/admin/subscribers` - Delete a subscriber.
- `POST /api/newsletter/subscribe` - Public newsletter subscription.
- `DELETE /api/newsletter/subscribe` - Public newsletter unsubscribe.

### 8. Search, Showcase & Media (3 Requests)
- `GET /api/search?q=ashwagandha` - Fuzzy typo-tolerant search across monographs and articles.
- `GET /api/monographs/showcase?category=stress-cortisol` - Showcase feed with published monographs.
- `POST /api/upload` - Upload image asset (multipart/form-data) to `/public/images/uploads/`.

### 9. Admin Console & Platform Ops (4 Requests)
- `GET /api/admin/dashboard` - Global platform statistics, live counts, views, and activity.
- `PUT /api/admin/update-profile` - Update admin user name and email.
- `PUT /api/admin/change-credentials` - Change admin password or username.
- `POST /api/admin/init` - First-time admin setup if database has no administrator.

### 10. Contact & Inquiries (1 Request)
- `POST /api/contact` - Submit clinical correction or editorial contact inquiry.

---

## 🔄 Updating or Re-generating Collection

Whenever new endpoints are added:
```bash
npm run postman:generate
```
This updates both [`SupplementDecoded_API.postman_collection.json`](file:///home/khadka27/Desktop/SupplementScience/SupplementDecoded_API.postman_collection.json) and [`SupplementDecoded.postman_environment.json`](file:///home/khadka27/Desktop/SupplementScience/SupplementDecoded.postman_environment.json) automatically.
