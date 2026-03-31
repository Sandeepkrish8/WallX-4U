'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { wallpapers as allWallpapers } from '@/data/wallpapers'
import { useSearch } from '@/context/SearchContext'
import MasonryGrid from '@/components/MasonryGrid'
import CategoryFilter from '@/components/CategoryFilter'
import { Sparkles, TrendingUp, Clock } from 'lucide-react'

const PAGE_SIZE = 12 // Wallpapers loaded per batch

export default function Home() {
  const { query } = useSearch()
  const [category, setCategory] = useState('All')
  const [likedIds, setLikedIds] = useState([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const heroRef = useRef(null)

  // Load liked IDs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('likedWallpapers')
    if (stored) setLikedIds(JSON.parse(stored))
  }, [])

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return
    gsap.fromTo(
      heroRef.current.children,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 0.4 }
    )
  }, [])

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query, category])

  // Real-time client-side filtering (search + category)
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return allWallpapers.filter((w) => {
      const matchCat = category === 'All' || w.category === category
      const matchSearch =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [query, category])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length

  // Toggle like and persist to localStorage
  const toggleLike = useCallback((id) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('likedWallpapers', JSON.stringify(next))
      return next
    })
  }, [])

  const loadMore = () => setVisibleCount((c) => c + PAGE_SIZE)

  return (
    <div className="min-h-screen">
      {/* ── Hero / Header ── */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full" />
        </div>

        <div ref={heroRef} className="relative max-w-7xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
            <Sparkles size={12} />
            Over {allWallpapers.length}+ premium wallpapers
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Discover Stunning{' '}
            <span className="gradient-text">Wallpapers</span>
          </h1>

          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Browse thousands of high-resolution wallpapers for every screen. Free to download.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 pt-2">
            {[
              { icon: TrendingUp, label: 'Downloads', value: '120K+' },
              { icon: Sparkles, label: 'Wallpapers', value: `${allWallpapers.length}+` },
              { icon: Clock, label: 'Updated', value: 'Daily' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-lg">
                  <Icon size={16} className="text-violet-400" />
                  {value}
                </div>
                <div className="text-zinc-600 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="sticky top-16 z-40 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>
      </section>

      {/* ── Wallpaper Grid ── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Result count */}
        <p className="text-zinc-600 text-sm mb-5">
          Showing <span className="text-zinc-400 font-medium">{visible.length}</span> of{' '}
          <span className="text-zinc-400 font-medium">{filtered.length}</span> wallpapers
          {query && (
            <span>
              {' '}for "<span className="text-violet-400">{query}</span>"
            </span>
          )}
        </p>

        <MasonryGrid wallpapers={visible} likedIds={likedIds} onLike={toggleLike} />

        {/* ── Load More button ── */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105 active:scale-100"
            >
              Load More
            </button>
          </div>
        )}

        {/* All loaded indicator */}
        {!hasMore && filtered.length > 0 && (
          <p className="text-center text-zinc-700 text-sm mt-12">
            — You&apos;ve reached the end —
          </p>
        )}
      </section>
    </div>
  )
}
