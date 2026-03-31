'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { wallpapers as allWallpapers } from '@/data/wallpapers'
import { useSearch } from '@/context/SearchContext'
import MasonryGrid from '@/components/MasonryGrid'
import CategoryFilter from '@/components/CategoryFilter'
import { Sparkles, TrendingUp, Clock, ChevronDown, ImageIcon } from 'lucide-react'

const PAGE_SIZE = 12

// Trending tags to show under the hero
const TRENDING = ['Mountains', 'Neon', 'Space', 'Anime', 'Minimal', 'Wildlife', 'Tokyo', 'Aurora']

export default function Home() {
  const { query } = useSearch()
  const [category, setCategory] = useState('All')
  const [likedIds, setLikedIds] = useState([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const heroRef = useRef(null)
  const glowRef = useRef(null)

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
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1, delay: 0.3 }
    )
    // Subtle floating glow pulse
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.7,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
  }, [])

  // Reset visible count when filter changes
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [query, category])

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

  // Quick search by trending tag
  const { setQuery } = useSearch()

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-28 pb-14 px-4 overflow-hidden">

        {/* Multi-layer ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            ref={glowRef}
            className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)' }}
          />
          <div className="absolute top-32 right-[10%] w-56 h-56 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-[5%] w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
        </div>

        <div ref={heroRef} className="relative max-w-7xl mx-auto text-center space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold tracking-wide">
            <Sparkles size={11} className="animate-pulse" />
            {allWallpapers.length}+ Premium Wallpapers · Free Forever
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Perfect{' '}
            <span className="gradient-text">Wallpaper</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-zinc-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Curated 4K wallpapers across Nature, Space, Anime, Cars & more.
            Download instantly — no signup needed.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 pt-1">
            {[
              { icon: TrendingUp, label: 'Downloads', value: '120K+' },
              { icon: ImageIcon,  label: 'Wallpapers', value: `${allWallpapers.length}+` },
              { icon: Clock,      label: 'Updated',   value: 'Daily' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-white font-bold text-xl">
                  <Icon size={16} className="text-violet-400" />
                  {value}
                </div>
                <div className="text-zinc-600 text-xs mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* Trending tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            <span className="text-zinc-600 text-xs">Trending:</span>
            {TRENDING.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.07] text-zinc-400 hover:text-violet-300 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Filter Bar ─────────────────────────────── */}
      <section className="sticky top-16 z-40 bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.05] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <CategoryFilter selected={category} onChange={setCategory} />
          {filtered.length > 0 && (
            <span className="hidden sm:block shrink-0 text-zinc-600 text-xs whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </section>

      {/* ── Wallpaper Grid ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">

        {/* Result summary */}
        {query && (
          <p className="text-zinc-500 text-sm mb-5">
            {filtered.length === 0 ? 'No results for ' : `${filtered.length} results for `}
            "<span className="text-violet-300 font-medium">{query}</span>"
          </p>
        )}

        <MasonryGrid wallpapers={visible} likedIds={likedIds} onLike={toggleLike} />

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-14">
            <button
              onClick={loadMore}
              className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/45 hover:scale-[1.03] active:scale-100"
            >
              <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform duration-200" />
              Load More
              <span className="text-violet-300 font-normal text-sm">({filtered.length - visibleCount} left)</span>
            </button>
          </div>
        )}

        {/* End of results */}
        {!hasMore && filtered.length > 0 && (
          <p className="text-center text-zinc-700 text-sm mt-14 tracking-widest uppercase text-xs">
            ∗ &nbsp; All caught up &nbsp; ∗
          </p>
        )}
      </section>
    </div>
  )
}
