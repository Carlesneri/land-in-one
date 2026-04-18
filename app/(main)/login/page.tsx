import { Container } from "@/app/ui/Container"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/Card"
import { SignInButton } from "@/app/components/SignInButton"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

export default async function LoginPage() {
  const session = await getServerSession()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <Container size="sm">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
            <p className="text-center text-slate-600 mt-2">
              Sign in to access your landing pages
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-slate-600 text-center">
                Use your Google account to sign in
              </p>
              <SignInButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
