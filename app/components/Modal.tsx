"use client"

import type { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}
