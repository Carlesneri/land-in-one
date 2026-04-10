"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      type="button"
      className="px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors mb-0"
    >
      Sign Out
    </button>
  )
}
