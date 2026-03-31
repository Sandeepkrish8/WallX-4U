'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WallpaperCard from './WallpaperCard'

/**
 * MasonryGrid — CSS-columns masonry layout with GSAP ScrollTrigger
 * entrance animations (fade-up + stagger per viewport batch).
 */
export default function MasonryGrid({ wallpapers, likedIds, onLike }) {
  const gridRef = useRef(null)

  // Re-run scroll animations whenever the wallpaper list changes
  useEffect(() => {
    if (!gridRef.current || wallpapers.length === 0) return

    gsap.registerPlugin(ScrollTrigger)

    // Wait one tick for DOM to paint new items
    const timer = setTimeout(() => {
      const items = gridRef.current.querySelectorAll('.masonry-item')

      items.forEach((item) => {
        // Skip items already animated (avoids duplicate triggers on load-more)
        if (item.dataset.animated) return
        item.dataset.animated = 'true'

        gsap.fromTo(
          item,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom-=80',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, 60)

    return () => {
      clearTimeout(timer)
    }
  }, [wallpapers])

  // Kill all ScrollTriggers on unmount
  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg font-medium">No wallpapers found</p>
        <p className="text-sm mt-1">Try a different search or category</p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      // CSS columns masonry — no external library needed
      className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3"
    >
      {wallpapers.map((w) => (
        <div key={w.id} className="break-inside-avoid mb-3">
          <WallpaperCard
            wallpaper={w}
            isLiked={likedIds.includes(w.id)}
            onLike={onLike}
          />
        </div>
      ))}
    </div>
  )
}
