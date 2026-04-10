import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-12 py-6 text-center text-gray-600">
      &copy; {new Date().getFullYear()} Land In One. All rights reserved.
      <Link
        href="mailto:contact@landinone.online"
        className="ml-4 text-blue-500 hover:underline"
      >
        contact@landinone.online
      </Link>
    </footer>
  )
}
