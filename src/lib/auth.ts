import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { compare, hash } from "bcrypt"

// Note: You'll need to install bcrypt: npm install bcrypt @types/bcrypt
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        // --- Bootstrap Superadmin ---
        if (credentials.email === "admin@aiclex.in" && credentials.password === "Aiclex@2026") {
          const hashedPassword = await hash("Aiclex@2026", 10)
          const admin = await prisma.user.upsert({
            where: { email: credentials.email },
            update: { role: "SUPER_ADMIN" },
            create: {
              email: credentials.email,
              name: "Super Admin",
              password: hashedPassword,
              role: "SUPER_ADMIN",
            }
          })
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            agencyId: null,
          }
        }
        // ----------------------------

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { agency: true }
        })

        if (!user || !user.password) {
          throw new Error("User not found")
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // Domain Security Check
        const { headers } = await import("next/headers")
        const headerList = await headers()
        const subdomain = headerList.get("x-agency-subdomain")

        if (subdomain && user.agency?.domain !== subdomain) {
          throw new Error("You do not have access to this portal")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          agencyId: user.agencyId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: (user as any).role,
          agencyId: (user as any).agencyId,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          agencyId: token.agencyId,
        },
      }
    },
  },
}
