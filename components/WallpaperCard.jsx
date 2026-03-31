'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Heart, Download } from 'lucide-react'

export default function WallpaperCard({ wallpaper, isLiked, onLike }) {
  const [loaded, setLoaded] = useState(false)

  // Download: fetch blob and trigger anchor download
  const handleDownload = useCallback(
    async (e) => {
      e.preventDefault()
      e.stopPropagation()
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
        // Fallback: open in new tab
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
    <div className="masonry-item group relative overflow-hidden rounded-2xl bg-[#161616] cursor-pointer select-none">
      <Link href={`/wallpaper/${wallpaper.id}`} className="block">

        {/* ── Skeleton shown while image loads ── */}
        {!loaded && (
          <div
            className="skeleton w-full rounded-2xl"
            style={{ minHeight: 200, height: 200 }}
          />
        )}

        {/* ── Wallpaper image ── */}
        <img
          src={wallpaper.thumbnail}
          alt={wallpaper.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full block transition-transform duration-500 ease-out group-hover:scale-[1.06] ${
            loaded ? 'opacity-100' : 'absolute top-0 left-0 opacity-0'
          }`}
        />

        {/* ── Gradient overlay (visible on hover) ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* ── Bottom info ── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-1">
            {wallpaper.title}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full font-medium">
              {wallpaper.category}
            </span>
            <span className="text-[11px] text-zinc-400 ml-auto">{wallpaper.resolution}</span>
          </div>
        </div>

        {/* ── Action buttons (top-right) ── */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          {/* Like */}
          <button
            onClick={handleLike}
            aria-label="Like"
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
              isLiked
                ? 'bg-red-500 text-white scale-110'
                : 'bg-black/50 text-white hover:bg-red-500 hover:scale-110'
            }`}
          >
            <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            aria-label="Download"
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-violet-600 hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <Download size={15} />
          </button>
        </div>
      </Link>
    </div>
  )
}
