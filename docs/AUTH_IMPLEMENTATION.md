# 🔐 Authentication System Implementation

## Overview

Complete authentication system using NextAuth v5 with username/password credentials and session management.

---

## ✅ Features Implemented

### 1. **NextAuth v5 Integration**

- Credentials provider (username/password)
- JWT-based sessions (30-day expiry)
- Secure password hashing with bcryptjs
- Protected admin routes with middleware

### 2. **Admin User Management**

- Prisma Admin model with fields:
  - `username` (unique)
  - `password` (hashed)
  - `name`, `email` (optional)
  - `role` (default: "admin")
  - `isActive` (boolean)
  - `lastLogin` (DateTime)
- Default admin: `admin` / `admin123`

### 3. **Protected Routes**

- `/admin/*` routes require authentication
- Automatic redirect to `/admin/login` if not authenticated
- Redirect to dashboard if already logged in

### 4. **Admin Features**

- ✅ Login page with error handling
- ✅ Logout functionality
- ✅ Profile update (name, email)
- ✅ Change username anytime
- ✅ Change password anytime
- ✅ Session management
- ✅ Last login tracking

---

## 📁 Files Created

### Authentication Core

```
lib/auth.ts                              # NextAuth configuration
components/AuthProvider.tsx              # Session provider wrapper
middleware.ts                            # Route protection + proxy
```

### Pages

```
app/admin/login/page.tsx                 # Login page
app/admin/settings/page.tsx              # Admin settings
app/admin/setup/page.tsx                 # Setup instructions
```

### API Routes

```
app/api/auth/[...nextauth]/route.ts      # NextAuth handlers
app/api/admin/init/route.ts              # Initialize default admin
app/api/admin/update-profile/route.ts    # Update name/email
app/api/admin/change-credentials/route.ts # Change username/password
```

### Database

```
prisma/schema.prisma                     # Added Admin model
```

---

## 🚀 Setup Instructions

### 1. Add Environment Variables

Create `.env.local` and add:

```env
# Database (existing)
DATABASE_URL="postgresql://user:password@localhost:5432/supplementsciencedb"

# NextAuth
AUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure AUTH_SECRET:

```bash
openssl rand -base64 32
```

### 2. Run Database Migration

```bash
pnpm prisma db push
pnpm prisma generate
```

### 3. Initialize Default Admin

Visit: `http://localhost:3000/admin/setup`

Or call the API directly:

```bash
curl -X POST http://localhost:3000/api/admin/init
```

This creates:

- Username: `admin`
- Password: `admin123`

### 4. First Login

1. Go to `/admin/login`
2. Login with `admin` / `admin123`
3. **Immediately go to Settings and change credentials!**

---

## 🔒 How It Works

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Visits /admin/*                     │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  Middleware   │
                │  Checks Auth  │
                └───────┬───────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌──────────────┐        ┌─────────────┐
    │ Authenticated│        │     Not     │
    │   (Session)  │        │ Authenticated│
    └───────┬──────┘        └──────┬──────┘
            │                      │
            ▼                      ▼
    ┌──────────────┐        ┌─────────────┐
    │  Allow Access│        │  Redirect to│
    │   to Admin   │        │    Login    │
    └──────────────┘        └─────────────┘
```

### Login Process

1. User enters username/password
2. NextAuth calls `authorize()` function
3. Fetch admin from database
4. Verify password with bcrypt
5. Update lastLogin timestamp
6. Create JWT token with user data
7. Store in session (httpOnly cookie)
8. Redirect to admin dashboard

### Session Management

- **Strategy**: JWT (stateless)
- **Storage**: httpOnly cookies (secure)
- **Expiry**: 30 days
- **Refresh**: Automatic on each request
- **Logout**: Clears session and redirects

---

## 🛡️ Security Features

### 1. **Password Security**

- Passwords hashed with bcryptjs (10 rounds)
- Never stored in plain text
- Minimum 6 characters enforced

### 2. **Session Security**

- JWT tokens signed with AUTH_SECRET
- httpOnly cookies (XSS protection)
- Secure flag in production (HTTPS)
- SameSite cookie policy

### 3. **Route Protection**

- Middleware checks authentication
- Server-side session validation
- API routes protected with `auth()` helper

### 4. **Username Uniqueness**

- Database constraint on username
- API validates before update
- Prevents duplicate accounts

---

## 📖 Usage Examples

### Protect a Page (Server Component)

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return <div>Welcome {session.user?.name}!</div>;
}
```

### Protect an API Route

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protected logic here
}
```

### Client-Side Session Access

```typescript
"use client";

import { useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return <div>Hello {session.user?.name}!</div>;
}
```

### Logout Button

```typescript
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return <Button onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>;
}
```

---

## 🔧 Customization

### Change Default Credentials

Edit `app/api/admin/init/route.ts`:

```typescript
const admin = await prisma.admin.create({
  data: {
    username: "your-username",
    password: await bcrypt.hash("your-password", 10),
    name: "Your Name",
    email: "your@email.com",
  },
});
```

### Change Session Expiry

Edit `lib/auth.ts`:

```typescript
session: {
  strategy: "jwt",
  maxAge: 7 * 24 * 60 * 60, // 7 days
}
```

### Add More User Fields

1. Update `prisma/schema.prisma`:

```prisma
model Admin {
  // ... existing fields
  phone       String?
  avatarUrl   String?
  permissions Json?   @default("{}")
}
```

2. Run migration:

```bash
pnpm prisma db push
pnpm prisma generate
```

3. Update auth callback in `lib/auth.ts`

---

## 🎯 Admin Settings Page

### Features

- Update profile (name, email)
- Change username
- Change password
- Requires current password verification
- Auto-logout after credential change

### Usage

1. Login as admin
2. Click profile dropdown → Settings
3. Update profile information
4. Or change login credentials
5. Submit and confirm

---

## 🔐 API Endpoints

### Initialize Admin

```http
POST /api/admin/init
```

Creates default admin if none exists.

### Update Profile

```http
PUT /api/admin/update-profile
Content-Type: application/json

{
  "name": "New Name",
  "email": "new@email.com"
}
```

### Change Credentials

```http
PUT /api/admin/change-credentials
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newUsername": "newadmin",
  "newPassword": "newsecurepassword"
}
```

---

## 🚨 Troubleshooting

### "Cannot find module 'next-auth'"

```bash
pnpm add next-auth@beta
```

### "Prisma Client does not have Admin model"

```bash
pnpm prisma generate
```

### "AUTH_SECRET is not defined"

Add to `.env.local`:

```env
AUTH_SECRET="your-secret-key"
```

### "Session is null in client component"

Wrap layout with `<AuthProvider>` in `app/layout.tsx`

### "Redirect loop on /admin pages"

Clear cookies and restart dev server:

```bash
pnpm dev
```

---

## 📊 Database Schema

### Admin Model

```prisma
model Admin {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // Hashed with bcryptjs
  name      String?
  email     String?
  role      String   @default("admin")
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("admins")
}
```

---

## ✅ Testing Checklist

- [ ] Can initialize default admin
- [ ] Can login with admin/admin123
- [ ] Redirects to /admin/login when not authenticated
- [ ] Redirects to dashboard when already logged in
- [ ] Can access admin pages when authenticated
- [ ] Can update profile name and email
- [ ] Can change username
- [ ] Can change password
- [ ] Logout works correctly
- [ ] Cannot reuse existing username
- [ ] Password validation works
- [ ] Session persists across page reloads
- [ ] Session expires after 30 days
- [ ] Navbar shows user menu when logged in
- [ ] Mobile menu shows logout button

---

## 🎉 Summary

Your blog now has complete authentication:

- ✅ Secure login system
- ✅ Protected admin routes
- ✅ Change credentials anytime
- ✅ Session management
- ✅ User-friendly UI
- ✅ Mobile responsive
- ✅ Production-ready

**Default Login:** `admin` / `admin123`

**Next Steps:**

1. Initialize admin account
2. Login and change password
3. Start creating blog posts!
