# Database Setup Guide

Complete guide for setting up and managing the database for your supplement review site.

---

## 📋 Prerequisites

- PostgreSQL database (local or remote)
- Node.js and pnpm installed
- Environment variables configured

---

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/supplementscience?schema=public"

# NextAuth Configuration
AUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Site Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Create Database

**Using PostgreSQL CLI:**
```bash
createdb supplementscience
```

**Or using psql:**
```sql
CREATE DATABASE supplementscience;
```

### 4. Run Database Setup

This command will:
- Push the schema to the database
- Generate Prisma Client
- Seed initial data

```bash
pnpm db:setup
```

**Or step by step:**
```bash
# Push schema to database
pnpm db:push

# Generate Prisma Client
pnpm db:generate

# Seed initial data
pnpm db:seed
```

---

## 📊 Database Schema

### Models

- **Author** - Blog post authors
- **Category** - Content categories (e.g., joint-pain, arthritis)
- **Tag** - Content tags for organization
- **Post** - Blog posts, reviews, guides, and ingredient pages
- **PostTag** - Many-to-many relationship between posts and tags
- **Subscriber** - Newsletter subscribers
- **Admin** - Admin users for the admin panel

### Key Relationships

```
Post
├── author (Author) - Optional
├── category (Category) - Optional (required for reviews/guides)
└── tags (Tag[]) - Many-to-many via PostTag
```

---

## 🔧 Database Commands

### Development

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema changes (development)
pnpm db:push

# Create and apply migration
pnpm db:migrate

# Open Prisma Studio (database GUI)
pnpm db:studio

# Seed database
pnpm db:seed
```

### Production

```bash
# Deploy migrations (production)
pnpm db:migrate:deploy

# Generate Prisma Client
pnpm db:generate
```

### Reset Database

⚠️ **Warning:** This will delete all data!

```bash
# Reset database and re-seed
pnpm db:migrate:reset
```

---

## 🌱 Seeding

The seed script (`prisma/seed.ts`) creates:

1. **Default Admin**
   - Username: `admin`
   - Password: `admin123`
   - ⚠️ **Change these immediately after first login!**

2. **Sample Categories**
   - Joint Pain (`joint-pain`)
   - Arthritis (`arthritis`)
   - Bone Health (`bone-health`)

3. **Sample Tags**
   - Glucosamine, Chondroitin, Turmeric, Collagen, MSM
   - Vitamin D, Calcium, Omega-3
   - Joint Health, Bone Health

4. **Default Author**
   - Supplement Science Team

### Custom Seeding

Edit `prisma/seed.ts` to add your own seed data.

---

## 🔄 Migrations

### Creating a Migration

When you modify `prisma/schema.prisma`:

```bash
# Create and apply migration
pnpm db:migrate

# Give it a name
# Example: "add_post_type_field"
```

This will:
1. Create a migration file in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate Prisma Client

### Migration Files

Migrations are stored in `prisma/migrations/` and should be committed to version control.

### Applying Migrations

**Development:**
```bash
pnpm db:migrate
```

**Production:**
```bash
pnpm db:migrate:deploy
```

---

## 🗄️ Database Providers

### PostgreSQL (Recommended)

The schema is configured for PostgreSQL. Connection string format:

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

### Local PostgreSQL

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/supplementscience?schema=public"
```

### Remote PostgreSQL (Supabase, Railway, etc.)

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&sslmode=require"
```

---

## 🔍 Prisma Studio

Visual database browser:

```bash
pnpm db:studio
```

Opens at `http://localhost:5555`

Useful for:
- Viewing data
- Manual edits
- Debugging
- Testing queries

---

## 📝 Common Tasks

### Add a New Category

```typescript
await prisma.category.create({
  data: {
    name: "Muscle Recovery",
    slug: "muscle-recovery",
    description: "Supplements for muscle recovery and performance",
  },
});
```

### Add a New Tag

```typescript
await prisma.tag.create({
  data: {
    name: "Creatine",
    slug: "creatine",
  },
});
```

### Create a Review Post

```typescript
await prisma.post.create({
  data: {
    title: "Flexitrinol Review: Complete Analysis",
    slug: "flexitrinol-review",
    content: "<h2>What Is Flexitrinol?</h2>...",
    excerpt: "Complete review of Flexitrinol...",
    status: "PUBLISHED",
    publishedAt: new Date(),
    categoryId: "category-id-here",
    authorId: "author-id-here",
    tags: {
      create: [
        { tagId: "tag-id-1" },
        { tagId: "tag-id-2" },
      ],
    },
  },
});
```

---

## 🚨 Troubleshooting

### "DATABASE_URL is not defined"

- Check `.env.local` exists
- Verify `DATABASE_URL` is set
- Restart your dev server

### "Relation does not exist"

- Run `pnpm db:push` or `pnpm db:migrate`
- Check database connection

### "Prisma Client not generated"

- Run `pnpm db:generate`
- Restart TypeScript server

### Migration conflicts

- Check migration history: `prisma/migrations/`
- Reset if needed: `pnpm db:migrate:reset`
- Recreate migrations: `pnpm db:migrate`

### Connection timeout

- Check database is running
- Verify connection string
- Check firewall/network settings

---

## 🔒 Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **Use strong passwords**
   - Generate secure AUTH_SECRET
   - Use strong database passwords

3. **Limit database access**
   - Use connection pooling
   - Restrict network access in production

4. **Change default admin**
   - Immediately after first login
   - Use strong password

5. **Regular backups**
   - Set up automated backups
   - Test restore procedures

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Verification

After setup, verify:

1. ✅ Database connection works
2. ✅ Prisma Client generated
3. ✅ Tables created
4. ✅ Seed data loaded
5. ✅ Admin login works
6. ✅ Can create posts

Check with:
```bash
pnpm db:studio
```

---

## 🎉 You're All Set!

Your database is configured and ready. Start creating content through the admin panel!

