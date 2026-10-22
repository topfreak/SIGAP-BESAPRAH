import React from 'react'
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

export function TrafficLightBadge({ status, size = 'md', showSubtitle = false }) {
  const configs = {
    merah: {
      label: 'Perlu Perbaikan',
      subtitle: 'Ada berkas fisik yang kurang',
      bg: 'bg-rose-50 border-rose-200 text-rose-700',
      dot: 'bg-rose-500',
      icon: AlertCircle,
      lightColor: '🔴',
    },
    kuning: {
      label: 'Sedang Diproses',
      subtitle: 'Sedang diperiksa petugas',
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      dot: 'bg-amber-500 animate-pulse',
      icon: Clock,
      lightColor: '🟡',
    },
    hijau: {
      label: 'Sudah Selesai',
      subtitle: 'SP2D terbit & beres',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      lightColor: '🟢',
    },
  }

  const item = configs[status] || configs.kuning
  const Icon = item.icon

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-semibold',
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border font-medium shadow-2xs transition-all ${
        item.bg
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className="relative flex items-center justify-center">
        {status === 'kuning' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full w-2.5 h-2.5 ${item.dot}`} />
      </span>

      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-semibold">{item.label}</span>

      {showSubtitle && (
        <span className="text-xs opacity-75 hidden sm:inline font-normal">
          • {item.subtitle}
        </span>
      )}
    </div>
  )
}

export default TrafficLightBadge
