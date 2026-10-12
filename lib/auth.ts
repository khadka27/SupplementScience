import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const rawUsername = (credentials.username as string).trim();
          const admin = await prisma.admin.findFirst({
            where: {
              username: {
                equals: rawUsername,
                mode: "insensitive",
              },
            },
          });

          if (!admin) {
            console.warn(
              `[auth] Sign-in failed: No admin account found matching "${rawUsername}". If this is a fresh setup, visit /admin/setup or call POST /api/admin/init`,
            );
            return null;
          }

          if (!admin.isActive) {
            console.warn(
              `[auth] Sign-in failed: Admin account "${rawUsername}" is deactivated.`,
            );
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.password,
          );

          if (!isPasswordValid) {
            console.warn(
              `[auth] Sign-in failed: Password mismatch for admin "${rawUsername}".`,
            );
            return null;
          }

          // Update last login
          await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
          });

          return {
            id: admin.id,
            name: admin.name || admin.username,
            email: admin.email,
            role: admin.role,
          };
        } catch (error) {
          console.error("[auth] Error during admin authorization:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.AUTH_SECRET || "your-secret-key-change-this-in-production",
});
