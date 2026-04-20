import { getServerSession } from "next-auth"
import Link from "next/link"
import { SignInButton } from "./SignInButton"
import { UserMenu } from "./UserMenu"
import { Container } from "@/app/ui/Container"
import { Logo } from "@/app/components/Logo"

export async function Header() {
  const session = await getServerSession()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-linear-to-r from-primary/5 via-warning/5 to-success/5 backdrop-blur-3xl">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <Logo height={40} width={40} />
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
