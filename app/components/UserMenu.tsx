"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Avatar } from "@/app/ui/Avatar"
import { cn } from "@/lib/utils"
import {
  IconChevronDown,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react"

interface UserMenuProps {
  name?: string | null
  email?: string | null
  image?: string | null
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 squircle-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6442D6] focus-visible:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Avatar
          src={image || undefined}
          alt={name || "User"}
          size="md"
          initials={initials}
        />
        <IconChevronDown
          size={16}
          className={cn(
            "text-slate-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-55 cursor-default"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false)
            }}
            aria-label="Close menu"
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-52 bg-white squircle-xl shadow-lg z-60 border border-slate-200 overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {name || "User"}
              </p>
              {email && (
                <p className="text-xs text-slate-500 truncate">{email}</p>
              )}
            </div>

            {/* Nav links */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                router.push("/dashboard")
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-[#111827] hover:bg-[#F5F2FF] hover:text-[#6442D6] transition-colors flex items-center gap-2 border-b border-slate-100"
            >
              <IconLayoutDashboard
                size={16}
                className="text-slate-400"
                aria-hidden="true"
              />
              Dashboard
            </button>

            {/* Sign out */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors flex items-center gap-2"
            >
              <IconLogout size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
