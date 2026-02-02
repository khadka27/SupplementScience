# Quick Start: Database Setup

Get your database up and running in minutes!

---

## ⚡ Quick Setup (3 Steps)

### 1. Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and set:
# - DATABASE_URL (your PostgreSQL connection string)
# - AUTH_SECRET (generate with: openssl rand -base64 32)
```

### 2. Create Database

```bash
# Using PostgreSQL CLI
createdb supplementscience

# Or using psql
psql -U postgres -c "CREATE DATABASE supplementscience;"
```

### 3. Run Setup

```bash
# One command setup (recommended)
pnpm db:setup

# Or manually:
pnpm db:push      # Push schema
pnpm db:generate  # Generate client
pnpm db:seed      # Seed data
```

---

## 🎯 What Gets Created

### Database Tables
- ✅ `authors` - Blog authors
- ✅ `categories` - Content categories
- ✅ `tags` - Content tags
- ✅ `posts` - Blog posts, reviews, guides
- ✅ `post_tags` - Post-tag relationships
- ✅ `subscribers` - Newsletter subscribers
- ✅ `admins` - Admin users

### Seed Data
- ✅ Default admin (username: `admin`, password: `admin123`)
- ✅ Sample categories (Joint Pain, Arthritis, Bone Health)
- ✅ Sample tags (Glucosamine, Turmeric, etc.)
- ✅ Default author

---

## 🚀 Next Steps

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Login to admin:**
   - Go to: http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `admin123`
   - ⚠️ **Change password immediately!**

3. **Create your first content:**
   - Navigate to "New Review", "New Guide", or "New Ingredient"
   - Use the auto-slug generation features
   - Start creating content!

---

## 🔧 Available Commands

```bash
# Database operations
pnpm db:push          # Push schema changes (dev)
pnpm db:migrate       # Create migration
pnpm db:migrate:deploy # Deploy migrations (prod)
pnpm db:generate      # Generate Prisma Client
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio (GUI)
pnpm db:setup         # Full setup (push + generate + seed)
```

---

## 🐛 Troubleshooting

**"DATABASE_URL is not defined"**
- Check `.env.local` exists and has `DATABASE_URL` set

**"Connection refused"**
- Make sure PostgreSQL is running
- Check connection string is correct

**"Relation does not exist"**
- Run `pnpm db:push` to create tables

**Need to reset?**
```bash
pnpm db:migrate:reset  # ⚠️ Deletes all data!
```

---

## 📚 Full Documentation

See `docs/DATABASE_SETUP.md` for complete documentation.

---

## ✅ Verification

Check everything works:

```bash
# Open Prisma Studio
pnpm db:studio

# Should open at http://localhost:5555
# You should see all tables with seed data
```

---

**That's it! You're ready to go! 🎉**

