import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { SignInButton } from "./SignInButton"
import { SignOutButton } from "./SignOutButton"

export async function Header() {
  const session = await getServerSession()

  return (
    <header>
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Land In One
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-gray-700 font-medium line-clamp-1 max-w-24">
                      {session.user.name || session.user.email}
                    </span>
                  )}
                </Link>
              </div>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  )
}
