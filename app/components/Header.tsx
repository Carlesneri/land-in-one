import { getServerSession } from "next-auth"
import Link from "next/link"
import { SignInButton } from "./SignInButton"
import { SignOutButton } from "./SignOutButton"
import { Container } from "@/app/ui/Container"
import { Avatar } from "@/app/ui/Avatar"
import { Logo } from "@/app/components/Logo"

export async function Header() {
  const session = await getServerSession()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo height={40} width={80} />
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-700 hover:text-indigo-600 font-medium text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Avatar
                    src={session.user.image || undefined}
                    alt={session.user.name || "User"}
                    size="md"
                    initials={
                      session.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"
                    }
                  />
                  <span className="text-slate-700 font-medium line-clamp-1 max-w-24 hidden xs:inline text-sm">
                    {session.user.name || session.user.email}
                  </span>
                </Link>
                <SignOutButton />
              </>
            ) : (
              <SignInButton />
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}
