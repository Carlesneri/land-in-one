import Link from "next/link"
import { Container } from "@/app/ui/Container"
import { Separator } from "@/app/ui/Separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <Container>
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Land In One</h3>
              <p className="text-sm text-slate-600">
                Create your landing page in less than one minute.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
              <Link
                href="mailto:contact@landinone.online"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                contact@landinone.online
              </Link>
            </div>
          </div>

          <Separator />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-slate-600">
              &copy; {currentYear} Land In One. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
