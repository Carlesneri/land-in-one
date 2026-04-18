import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getUserLandings } from "@/app/actions/pages"
import { Dashboard } from "@/app/components/Dashboard"
import { Container } from "@/app/ui/Container"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const userLandings = await getUserLandings(session.user.email)

  return (
    <Container>
      <Dashboard pages={userLandings.pages || []} />
    </Container>
  )
}
