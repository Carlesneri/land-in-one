"use client"

import { useEffect, useState } from "react"

export function useIsStandalone() {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)
  }, [])

  return isStandalone
}
