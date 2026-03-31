'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { wallpapers } from '@/data/wallpapers'
import WallpaperCard from '@/components/WallpaperCard'
import {
  ArrowLeft,
  Heart,
  Download,
  Monitor,
  Tag,
  FolderOpen,
  TrendingDown,
  Eye,
} from 'lucide-react'

export default function WallpaperDetails() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id)

  const [likedIds, setLikedIds] = useState([])
  const [relatedLikedIds, setRelatedLikedIds] = useState([])
  const [imgLoaded, setImgLoaded] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const heroRef = useRef(null)
  const infoRef = useRef(null)

  const wallpaper = wallpapers.find((w) => w.id === id)

  // Related = same category, excluding current (up to 8)
  const related = wallpaper
    ? wallpapers.filter((w) => w.category === wallpaper.category && w.id !== id).slice(0, 8)
    : []

  // Load liked IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('likedWallpapers')
    if (stored) {
      const ids = JSON.parse(stored)
      setLikedIds(ids)
      setRelatedLikedIds(ids)
    }
  }, [])

  // Page entrance animation
  useEffect(() => {
    if (!heroRef.current || !infoRef.current) return
    gsap.fromTo(heroRef.current, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' })
    gsap.fromTo(
      infoRef.current.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.3 }
    )
  }, [wallpaper])

  const toggleLike = useCallback((likeId) => {
    setLikedIds((prev) => {
      const next = prev.includes(likeId) ? prev.filter((i) => i !== likeId) : [...prev, likeId]
      localStorage.setItem('likedWallpapers', JSON.stringify(next))
      setRelatedLikedIds(next)
      return next
    })
  }, [])

  const handleDownload = async () => {
    if (!wallpaper || downloading) return
    setDownloading(true)
    try {
      const res = await fetch(wallpaper.fullImage)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${wallpaper.title.replace(/\s+/g, '_')}_4KWallX.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(wallpaper.fullImage, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  if (!wallpaper) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-500 pt-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-xl font-semibold text-zinc-300 mb-2">Wallpaper not found</p>
        <Link href="/" className="text-violet-400 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    )
  }

  const isLiked = likedIds.includes(wallpaper.id)

  return (
    <div className="min-h-screen pt-20 pb-16">

      {/* ── Back button ── */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* ── Full-screen image ── */}
      <div
        ref={heroRef}
        className="max-w-7xl mx-auto px-4 mb-8"
      >
        <div className="relative rounded-2xl overflow-hidden bg-[#161616] shadow-2xl shadow-black/50">
          {!imgLoaded && (
            <div className="skeleton w-full" style={{ height: 480 }} />
          )}
          <img
            src={wallpaper.fullImage}
            alt={wallpaper.title}
            className={`w-full max-h-[70vh] object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Category badge on image */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-violet-300 text-xs font-medium rounded-full border border-violet-500/30">
              {wallpaper.category}
            </span>
          </div>
        </div>
      </div>

      {/* ── Info + Actions ── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: metadata ── */}
          <div ref={infoRef} className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{wallpaper.title}</h1>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Monitor, label: 'Resolution', value: wallpaper.resolution },
                { icon: FolderOpen, label: 'Category', value: wallpaper.category },
                { icon: Heart, label: 'Likes', value: wallpaper.likes.toLocaleString() },
                { icon: TrendingDown, label: 'Downloads', value: wallpaper.downloads.toLocaleString() },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#161616] border border-white/5 rounded-xl text-sm"
                >
                  <Icon size={15} className="text-violet-400" />
                  <span className="text-zinc-500">{label}:</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-2">
                <Tag size={12} />
                TAGS
              </div>
              <div className="flex flex-wrap gap-2">
                {wallpaper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/[0.05] border border-white/8 rounded-full text-zinc-400 text-xs hover:text-white hover:border-white/20 transition-colors duration-200 cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: CTA buttons ── */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
            >
              <Download size={18} />
              {downloading ? 'Downloading…' : 'Download'}
            </button>

            <button
              onClick={() => toggleLike(wallpaper.id)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-200 border ${
                isLiked
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                  : 'bg-white/[0.05] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
          </div>
        </div>

        {/* ── Related wallpapers ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <Eye size={18} className="text-violet-400" />
              <h2 className="text-xl font-semibold text-white">More in {wallpaper.category}</h2>
            </div>
            {/* Responsive grid for related cards */}
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3">
              {related.map((w) => (
                <div key={w.id} className="break-inside-avoid mb-3">
                  <WallpaperCard
                    wallpaper={w}
                    isLiked={relatedLikedIds.includes(w.id)}
                    onLike={toggleLike}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
