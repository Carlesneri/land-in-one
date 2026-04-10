import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getUserLandings } from "../actions/pages"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const userLandings = await getUserLandings(session.user.email)

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {userLandings?.pages?.map((landing) => (
          <li key={landing.id}>
            <Link href={`/builder/${landing.id}`}>{landing.slug}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
