'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Heart, Download, Eye } from 'lucide-react'

// Format large numbers: 12450 → "12.4K"
function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export default function WallpaperCard({ wallpaper, isLiked, onLike }) {
  const [loaded, setLoaded] = useState(false)
  const [dlFlash, setDlFlash] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Fallback: pick a reliable Unsplash placeholder keyed to the category
  const CATEGORY_FALLBACKS = {
    Nature:       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    Space:        'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=800&q=80',
    Cars:         'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
    Abstract:     'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    Minimal:      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    Architecture: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    Animals:      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    Anime:        'https://images.unsplash.com/photo-1540959733-676dc65f6d6d?auto=format&fit=crop&w=800&q=80',
    Cyberpunk:    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    Ocean:        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    Fantasy:      'https://images.unsplash.com/photo-1485841890310-6a055c88698a?auto=format&fit=crop&w=800&q=80',
    Gaming:       'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    Dark:         'https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&w=800&q=80',
  }
  const fallbackSrc = CATEGORY_FALLBACKS[wallpaper.category] || CATEGORY_FALLBACKS.Nature

  // Download: fetch blob → trigger anchor, fallback to new tab
  const handleDownload = useCallback(
    async (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDlFlash(true)
      setTimeout(() => setDlFlash(false), 1200)
      try {
        const res = await fetch(wallpaper.thumbnail)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${wallpaper.title.replace(/\s+/g, '_')}.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch {
        window.open(wallpaper.thumbnail, '_blank')
      }
    },
    [wallpaper]
  )

  const handleLike = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      onLike(wallpaper.id)
    },
    [wallpaper.id, onLike]
  )

  return (
    <div className="masonry-item group relative overflow-hidden rounded-xl bg-[#111111] cursor-pointer select-none ring-1 ring-white/5 hover:ring-violet-500/40 transition-all duration-300 shadow-md hover:shadow-violet-900/30 hover:shadow-xl">
      <Link href={`/wallpaper/${wallpaper.id}`} className="block">

        {/* Skeleton while image loads */}
        {!loaded && (
          <div className="skeleton w-full rounded-xl" style={{ minHeight: 220, height: 220 }} />
        )}

        {/* Wallpaper image — zoom on hover */}
        <img
          src={imgError ? fallbackSrc : wallpaper.thumbnail}
          alt={wallpaper.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => { setImgError(true); setLoaded(true) }}
          className={`w-full block transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08] ${
            loaded ? 'opacity-100' : 'absolute inset-0 opacity-0'
          }`}
        />

        {/* Dark gradient overlay — slides up on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-xl" />

        {/* Top-left: category badge (always visible, subtle) */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-violet-300 border border-violet-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {wallpaper.category}
          </span>
        </div>

        {/* Top-right: action buttons — slide in from right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          {/* Like button */}
          <button
            onClick={handleLike}
            aria-label="Like wallpaper"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transition-all duration-200 active:scale-90 ${
              isLiked
                ? 'bg-red-500 text-white shadow-red-500/40'
                : 'bg-black/60 text-zinc-200 hover:bg-red-500 hover:text-white hover:shadow-red-500/40'
            }`}
          >
            <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            aria-label="Download wallpaper"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transition-all duration-200 active:scale-90 ${
              dlFlash
                ? 'bg-green-500 text-white shadow-green-500/40'
                : 'bg-black/60 text-zinc-200 hover:bg-violet-600 hover:text-white hover:shadow-violet-500/40'
            }`}
          >
            <Download size={13} />
          </button>
        </div>

        {/* Bottom info panel — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          {/* Title */}
          <p className="text-white font-semibold text-sm leading-snug line-clamp-1 mb-2 drop-shadow">
            {wallpaper.title}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-zinc-300">
              <Heart size={10} fill="currentColor" className="text-red-400" />
              {fmt(wallpaper.likes)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-300">
              <Download size={10} className="text-violet-400" />
              {fmt(wallpaper.downloads)}
            </span>
            <span className="ml-auto text-[10px] text-zinc-500 font-mono">{wallpaper.resolution}</span>
          </div>
        </div>

        {/* Subtle "view" hint in center on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="flex items-center gap-1.5 text-xs font-medium text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={11} /> View
          </span>
        </div>
      </Link>
    </div>
  )
}
