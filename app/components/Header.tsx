import { getServerSession } from "next-auth"
import Link from "next/link"
import { SignInButton } from "./SignInButton"
import { UserMenu } from "./UserMenu"
import { Container } from "@/app/ui/Container"
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
              <UserMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
              />
            ) : (
              <SignInButton />
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}
