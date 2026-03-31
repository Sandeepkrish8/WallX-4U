'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { categories } from '@/data/wallpapers'
import {
  LayoutGrid, Leaf, Rocket, Car, Sparkles, Minus,
  Building2, PawPrint, Tv2,
} from 'lucide-react'

// Per-category icon map
const ICONS = {
  All:          LayoutGrid,
  Nature:       Leaf,
  Space:        Rocket,
  Cars:         Car,
  Abstract:     Sparkles,
  Minimal:      Minus,
  Architecture: Building2,
  Animals:      PawPrint,
  Anime:        Tv2,
}

export default function CategoryFilter({ selected, onChange }) {
  const containerRef = useRef(null)

  // Stagger-animate pills on mount
  useEffect(() => {
    if (!containerRef.current) return
    const pills = containerRef.current.querySelectorAll('.category-pill')
    gsap.fromTo(
      pills,
      { opacity: 0, y: 14, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
        stagger: 0.05,
        delay: 0.15,
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
        const Icon = ICONS[cat] ?? LayoutGrid
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`category-pill flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              active
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40 scale-[1.04]'
                : 'bg-white/[0.05] text-zinc-400 hover:bg-white/[0.09] hover:text-zinc-100 border border-white/[0.08]'
            }`}
          >
            <Icon size={13} strokeWidth={active ? 2.5 : 1.8} />
            {cat}
          </button>
        )
      })}
    </div>
  )
}
