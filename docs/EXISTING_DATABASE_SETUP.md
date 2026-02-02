# Setting Up with Existing Database

Since you already have a database with tables, here's how to sync it with your Prisma schema.

---

## 🔄 Option 1: Sync Schema (Recommended for Development)

This will update your existing database to match the schema without losing data:

```bash
# Sync schema (adds missing constraints, indexes, etc.)
pnpm db:push

# Generate Prisma Client
pnpm db:generate

# Seed initial data (if needed)
pnpm db:seed
```

**What this does:**
- ✅ Adds missing unique indexes
- ✅ Adds missing foreign keys
- ✅ Adds missing constraints
- ✅ Preserves all existing data
- ⚠️ Does NOT create migration files

---

## 📝 Option 2: Create Baseline Migration

If you want proper migration history:

### Step 1: Mark database as baseline

```bash
# Create migration folder structure
mkdir -p prisma/migrations

# Create baseline migration (empty, just marks current state)
pnpm prisma migrate dev --create-only --name baseline
```

### Step 2: Mark as applied

Edit the migration file to be empty or just mark it as applied:

```bash
# This tells Prisma the database is already at this state
pnpm prisma migrate resolve --applied baseline
```

### Step 3: Future migrations

Now you can create new migrations normally:

```bash
pnpm db:migrate
```

---

## ✅ Quick Setup (Recommended)

For development with existing database:

```bash
# 1. Sync schema
pnpm db:push

# 2. Generate client
pnpm db:generate

# 3. Seed data (optional)
pnpm db:seed
```

This is the fastest way to get started!

---

## 🔍 What Will Be Added

Your existing tables will get:

- ✅ Unique indexes on `slug` fields (authors, categories, tags, posts)
- ✅ Unique index on `username` (admins)
- ✅ Unique index on `email` (subscribers)
- ✅ Foreign keys for relationships
- ✅ Proper constraints

**No data will be lost!**

---

## 🎯 Next Steps

After syncing:

1. ✅ Verify with Prisma Studio: `pnpm db:studio`
2. ✅ Test admin login
3. ✅ Start creating content

---

## ⚠️ Important Notes

- **`db:push`** is for development - it doesn't create migration files
- **`db:migrate`** creates migration files - use for production
- If you have production data, use migrations instead of push

---

Your database is ready! 🎉

