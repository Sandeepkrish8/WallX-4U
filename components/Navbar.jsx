'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layers, Menu, X, Search, Compass, Upload as UploadIcon, Home as HomeIcon } from 'lucide-react'
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

  // GSAP: transition navbar background on scroll
  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? 'rgba(8, 8, 8, 0.94)' : 'rgba(8, 8, 8, 0)',
      borderBottomColor: scrolled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [scrolled])

  // GSAP: entrance animation on mount
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -56, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/upload', label: 'Upload', icon: UploadIcon },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(8,8,8,0)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 bg-gradient-to-br from-violet-500 to-indigo-700">
              <Layers size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              4K<span className="text-violet-400">WallX</span>
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-0.5 ml-auto">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-violet-600/20 text-violet-300'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] py-3 space-y-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === href
                    ? 'text-violet-300 bg-violet-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

/* Reusable search input */
function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search wallpapers, tags, categories…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
