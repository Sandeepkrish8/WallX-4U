'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, Menu, X, Search, Compass, Upload as UploadIcon, Home as HomeIcon, LogIn, UserPlus, LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { useSearch } from '@/context/SearchContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navRef      = useRef(null)
  const userMenuRef = useRef(null)
  const pathname    = usePathname()
  const router      = useRouter()
  const { query, setQuery } = useSearch()
  const { user, signOut }   = useAuth()

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  // Don't render navbar on full-page auth routes
  if (pathname === '/signin' || pathname === '/signup') return null

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

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mx-2" />

            {user ? (
              /* ── User avatar + dropdown ── */
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.14] transition-all duration-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover bg-zinc-800"
                  />
                  <span className="text-sm text-zinc-200 font-medium max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-zinc-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors">
                        <UserIcon size={13} className="text-zinc-500" />
                        Profile
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors">
                        <Settings size={13} className="text-zinc-500" />
                        Settings
                      </button>
                    </div>
                    <div className="py-1.5 border-t border-white/[0.06]">
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); router.push('/') }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                      >
                        <LogOut size={13} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Auth buttons ── */
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <LogIn size={14} />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all duration-200 shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5"
                >
                  <UserPlus size={14} />
                  Sign Up
                </Link>
              </div>
            )}
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

            {/* Mobile auth */}
            <div className="pt-2 border-t border-white/[0.06] mt-2 space-y-0.5">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg bg-zinc-800" />
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); router.push('/') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <LogIn size={15} />
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-violet-300 bg-violet-500/10 hover:bg-violet-500/20"
                  >
                    <UserPlus size={15} />
                    Create Account
                  </Link>
                </>
              )}
            </div>
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
