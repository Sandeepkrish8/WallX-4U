'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { categories } from '@/data/wallpapers'

/**
 * CategoryFilter — animated pill-button row for filtering by category.
 * Slides in from the left on mount with GSAP stagger.
 */
export default function CategoryFilter({ selected, onChange }) {
  const containerRef = useRef(null)

  // Stagger-animate pills on mount
  useEffect(() => {
    if (!containerRef.current) return
    const pills = containerRef.current.querySelectorAll('.category-pill')
    gsap.fromTo(
      pills,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.2,
      }
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const active = selected === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`category-pill px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              active
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                : 'bg-white/[0.06] text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
