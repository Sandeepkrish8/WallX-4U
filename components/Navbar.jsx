'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layers, Menu, X, Search } from 'lucide-react'
import gsap from 'gsap'
import { useSearch } from '@/context/SearchContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const pathname = usePathname()
  const { query, setQuery } = useSearch()

  // Detect scroll to trigger glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP: animate navbar background on scroll
  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.92)' : 'rgba(10, 10, 10, 0)',
      borderBottomColor: scrolled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0)',
      duration: 0.35,
      ease: 'power2.out',
    })
  }, [scrolled])

  // GSAP: entrance animation on mount
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/upload', label: 'Upload' },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent backdrop-blur-md"
      style={{ backgroundColor: 'rgba(10,10,10,0)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300">
              <Layers size={15} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              4K<span className="text-violet-400">WallX</span>
            </span>
          </Link>

          {/* ── Search bar (desktop) ── */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          {/* ── Nav links ── */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? 'text-violet-400 bg-violet-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden ml-auto p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile search ── */}
        <div className="md:hidden pb-3">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  pathname === href ? 'text-violet-400 bg-violet-500/10' : 'text-zinc-400 hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

/* ── Reusable search input ── */
function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search wallpapers, categories, tags…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-200"
      />
    </div>
  )
}
