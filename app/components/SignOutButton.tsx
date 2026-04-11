"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/app/ui/Button"

export function SignOutButton() {
  return (
    <Button onClick={() => signOut()} type="button" variant="ghost" size="md">
      Sign Out
    </Button>
  )
}
