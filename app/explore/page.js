'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { wallpapers, categories } from '@/data/wallpapers'
import MasonryGrid from '@/components/MasonryGrid'
import CategoryFilter from '@/components/CategoryFilter'
import { Compass } from 'lucide-react'

// Show all wallpapers on Explore, sorted by most-liked
const sorted = [...wallpapers].sort((a, b) => b.likes - a.likes)

export default function ExplorePage() {
  const [category, setCategory] = useState('All')
  const [likedIds, setLikedIds] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('likedWallpapers')
    if (stored) setLikedIds(JSON.parse(stored))
  }, [])

  const filtered = useMemo(() => {
    if (category === 'All') return sorted
    return sorted.filter((w) => w.category === category)
  }, [category])

  const toggleLike = useCallback((id) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('likedWallpapers', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-4">
            <Compass size={12} />
            Explore All
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Browse <span className="gradient-text">Everything</span>
          </h1>
          <p className="text-zinc-500 text-sm">All wallpapers sorted by popularity</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        <MasonryGrid wallpapers={filtered} likedIds={likedIds} onLike={toggleLike} />
      </div>
    </div>
  )
}
