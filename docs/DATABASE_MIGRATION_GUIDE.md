# Database Migration Guide

This guide will help you set up your database using the existing Prisma schema.

---

## 🚀 Quick Setup

### Step 1: Configure Environment

Make sure you have `.env.local` with your database connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/supplementscience?schema=public"
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Step 2: Create Initial Migration

Since you're using an existing schema, create the initial migration:

```bash
# Create initial migration
pnpm db:migrate

# Name it: "init"
```

This will:
- Create `prisma/migrations/` folder
- Generate SQL migration files
- Apply the migration to your database

### Step 3: Generate Prisma Client

```bash
pnpm db:generate
```

### Step 4: Seed Database

```bash
pnpm db:seed
```

---

## 📊 Schema Overview

Your schema includes:

### Models
- **Author** - Blog post authors
- **Category** - Content categories (for dynamic routing)
- **Tag** - Content tags
- **Post** - All content (reviews, guides, ingredients, blog posts)
- **PostTag** - Many-to-many relationship
- **Subscriber** - Newsletter subscribers
- **Admin** - Admin users

### Key Features
- ✅ UUID primary keys
- ✅ Timestamps (created_at, updated_at)
- ✅ Soft deletes support
- ✅ JSON fields for flexible data (sources, FAQs, references)
- ✅ Proper relationships and constraints

---

## 🔄 Migration Commands

### Development

```bash
# Create new migration (after schema changes)
pnpm db:migrate

# Push schema directly (quick dev, no migration file)
pnpm db:push

# Generate Prisma Client
pnpm db:generate
```

### Production

```bash
# Deploy migrations
pnpm db:migrate:deploy

# Generate Prisma Client
pnpm db:generate
```

### Reset (⚠️ Deletes all data)

```bash
pnpm db:migrate:reset
```

---

## 📝 Creating Migrations

When you modify `prisma/schema.prisma`:

1. **Make your changes** to the schema
2. **Create migration:**
   ```bash
   pnpm db:migrate
   ```
3. **Name the migration** (e.g., "add_post_type_field")
4. **Migration is created** in `prisma/migrations/`
5. **Applied automatically** to your database

---

## ✅ Verification

After setup, verify everything works:

```bash
# Open Prisma Studio
pnpm db:studio

# Should show all tables:
# - authors
# - categories
# - tags
# - posts
# - post_tags
# - subscribers
# - admins
```

---

## 🎯 Next Steps

1. ✅ Database schema is ready
2. ✅ Run initial migration
3. ✅ Seed with sample data
4. ✅ Start creating content through admin panel

---

## 🔧 Troubleshooting

**"Migration already applied"**
- Your database is up to date
- No action needed

**"Database schema drift"**
- Run `pnpm db:push` to sync
- Or create a migration to fix differences

**"Prisma Client out of sync"**
- Run `pnpm db:generate`

---

Your schema is ready to use! 🎉

