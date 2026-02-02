# Database Sync Notes

## ⚠️ Status Column Migration

Your existing database has a `status` column that needs to be converted from a string type to an enum type (`PostStatus`).

### What Happens

The `status` column will be:
- Dropped (old string column)
- Recreated (new enum column)

**This means:**
- ⚠️ All existing status values will be lost
- ✅ New posts will use the enum (DRAFT or PUBLISHED)

### Options

#### Option 1: Accept Data Loss (Development)

If you're okay with losing status data:

```bash
pnpm db:push --accept-data-loss
```

Then manually update existing posts:
```sql
UPDATE posts SET status = 'PUBLISHED' WHERE status = 'published';
UPDATE posts SET status = 'DRAFT' WHERE status = 'draft';
```

#### Option 2: Manual Migration (Preserve Data)

1. **Backup your data first!**

2. **Create a migration script:**

```sql
-- Step 1: Add temporary column
ALTER TABLE posts ADD COLUMN status_temp VARCHAR;

-- Step 2: Copy and convert data
UPDATE posts SET status_temp = 
  CASE 
    WHEN status::text = 'published' THEN 'PUBLISHED'
    WHEN status::text = 'draft' THEN 'DRAFT'
    ELSE 'DRAFT'
  END;

-- Step 3: Drop old column
ALTER TABLE posts DROP COLUMN status;

-- Step 4: Rename temp column
ALTER TABLE posts RENAME COLUMN status_temp TO status;

-- Step 5: Change to enum type
ALTER TABLE posts ALTER COLUMN status TYPE "PostStatus" USING status::"PostStatus";
```

3. **Then run:**
```bash
pnpm db:push
```

---

## 🚀 Quick Sync (Recommended for Fresh Start)

If you don't have important data:

```bash
pnpm db:push --accept-data-loss
pnpm db:generate
pnpm db:seed
```

---

## ✅ After Sync

Your database will have:
- ✅ Proper enum types
- ✅ All unique indexes
- ✅ All foreign keys
- ✅ All constraints

Ready to use! 🎉

