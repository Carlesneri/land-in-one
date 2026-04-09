import { config } from "@/lib/auth"
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  ...config,
}

export default NextAuth(authOptions)
