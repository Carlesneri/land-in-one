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
                Create beautiful landing pages in less than one minute.
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
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <Link
                href="#"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.561 9.561 0 012.503.36c1.906-1.296 2.742-1.025 2.742-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C17.137 18.195 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
