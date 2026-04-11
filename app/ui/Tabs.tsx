import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, defaultTab, className }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

    return (
      <div ref={ref} className={className}>
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200",
                "border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {tabs.map(
            (tab) =>
              activeTab === tab.id && (
                <div key={tab.id} className="animate-in fade-in duration-200">
                  {tab.content}
                </div>
              ),
          )}
        </div>
      </div>
    )
  },
)
Tabs.displayName = "Tabs"

export { Tabs }
