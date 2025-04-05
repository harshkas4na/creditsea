import type { ReactNode } from "react"

interface StatsCardProps {
  icon: ReactNode
  value: string | number
  label: string
  className?: string
}

export default function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`bg-white p-4 rounded shadow flex ${className}`}>
      <div className="mr-4 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-500 uppercase">{label}</div>
      </div>
    </div>
  )
}

