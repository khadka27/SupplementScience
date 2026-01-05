import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
          const admin = await prisma.admin.findUnique({
            where: { username: credentials.username as string },
          });

          if (!admin || !admin.isActive) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          );

          if (!isPasswordValid) {
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
          console.error("Auth error:", error);
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
