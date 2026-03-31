'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import {
  Eye, EyeOff, Mail, Lock, Layers, ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/* ── Wallpaper collage shown on the left panel ── */
const COLLAGE = [
  { id: '1506905925346-21bda4d32df4', tall: true  },
  { id: '1462332420958-a05d1e002413', tall: false },
  { id: '1462275646964-a0e3386b89ae', tall: true  },
  { id: '1518895949257-6b925b96a492', tall: false },
  { id: '1502113791800-4bdf1d702a96', tall: true  },
  { id: '1445510861639-5651173bc5d5', tall: false },
]

/* ── Static particle positions (avoids hydration mismatch) ── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top:  `${(i * 53 + 7)  % 100}%`,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  delay: (i * 0.31) % 4,
  dur:   4 + (i * 0.17) % 4,
}))

export default function SignInPage() {
  const router   = useRouter()
  const { signIn } = useAuth()

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  /* refs for GSAP targets */
  const wrapRef    = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const formRef    = useRef(null)
  const orb1Ref    = useRef(null)
  const orb2Ref    = useRef(null)
  const orb3Ref    = useRef(null)
  const imgRefs    = useRef([])
  const partRefs   = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── 1. Page reveal ── */
      gsap.fromTo(wrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )

      /* ── 2. Ambient orbs – continuous loop ── */
      gsap.to(orb1Ref.current, { x: 70, y: -50, duration: 8,  ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to(orb2Ref.current, { x: -60, y: 70, duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.2 })
      gsap.to(orb3Ref.current, { x: 45, y: 40,  duration: 7,  ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.5 })

      /* ── 3. Floating particles ── */
      partRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          y: -30 - (i % 5) * 12,
          opacity: 0,
          duration: PARTICLES[i].dur,
          delay: PARTICLES[i].delay,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 0.5,
          yoyo: false,
        })
      })

      /* ── 4. Collage images stagger in ── */
      gsap.fromTo(imgRefs.current,
        { opacity: 0, y: 50, scale: 0.88, rotateX: 8 },
        {
          opacity: 1, y: 0, scale: 1, rotateX: 0,
          duration: 0.85, stagger: 0.11, ease: 'power3.out', delay: 0.35,
        }
      )

      /* ── 5. Left panel brand text ── */
      gsap.fromTo('.si-brand > *',
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', delay: 0.25 }
      )

      /* ── 6. Right panel slide in ── */
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 42 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.18 }
      )

      /* ── 7. Form fields stagger pop-in ── */
      gsap.fromTo('.si-field',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out', delay: 0.45 }
      )
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  /* Submit handler */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in all fields.')
      gsap.fromTo('.si-error', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      gsap.fromTo('.si-error', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' })
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 900)) // simulate network

    signIn(email, password)

    /* exit animation before navigation */
    gsap.to(formRef.current, {
      opacity: 0, y: -18, duration: 0.38, ease: 'power2.in',
      onComplete: () => router.push('/'),
    })
  }

  return (
    <div ref={wrapRef} className="min-h-screen flex bg-[#080808] overflow-hidden">

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div
        ref={leftRef}
        className="hidden lg:flex flex-col relative w-[52%] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c0c12 0%, #080810 100%)' }}
      >
        {/* Ambient orbs */}
        <div ref={orb1Ref} className="absolute top-[20%] left-[20%] w-96 h-96 rounded-full bg-violet-600/18 blur-[110px] pointer-events-none" />
        <div ref={orb2Ref} className="absolute bottom-[15%] right-[10%] w-72 h-72 rounded-full bg-indigo-500/18 blur-[90px]  pointer-events-none" />
        <div ref={orb3Ref} className="absolute top-[55%] left-[50%] w-56 h-56 rounded-full bg-fuchsia-600/12 blur-[80px]  pointer-events-none" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={p.id}
            ref={el => partRefs.current[i] = el}
            className="absolute rounded-full bg-violet-400/30 pointer-events-none"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          />
        ))}

        {/* Wallpaper collage */}
        <div className="absolute inset-0 flex items-center justify-center px-14">
          <div
            className="grid grid-cols-3 gap-2.5 w-full max-w-[380px]"
            style={{ perspective: '900px', transform: 'rotateY(-7deg) rotateX(3deg)' }}
          >
            {COLLAGE.map((img, i) => (
              <div
                key={i}
                ref={el => imgRefs.current[i] = el}
                className={`overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ${img.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'} ${i % 2 === 0 ? 'mt-5' : '-mt-5'}`}
                style={{ opacity: 0 }}
              >
                <img
                  src={`https://images.unsplash.com/photo-${img.id}?auto=format&fit=crop&w=280&q=72`}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Inset gradients – depth effect */}
        <div className="absolute inset-0 bg-gradient-to-t  from-[#080810] via-[#080810]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/70 to-transparent pointer-events-none" />

        {/* Brand */}
        <div className="si-brand absolute bottom-12 left-12 max-w-[300px] z-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-700 shadow-lg shadow-violet-500/40">
              <Layers size={17} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">
              4K<span className="text-violet-400">WallX</span>
            </span>
          </div>

          <h2 className="text-[2rem] font-black text-white mb-3 leading-tight tracking-tight">
            Stunning wallpapers<br />
            <span className="gradient-text">for every screen</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Join thousands of enthusiasts discovering premium 4K wallpapers daily.
          </p>

          <div className="flex items-center gap-6 mt-7">
            <StatPill value="50K+" label="Wallpapers" />
            <div className="w-px h-9 bg-white/10" />
            <StatPill value="12K+" label="Users" />
            <div className="w-px h-9 bg-white/10" />
            <StatPill value="8"    label="Categories" />
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div
        ref={rightRef}
        className="flex-1 flex items-center justify-center px-6 py-16 relative"
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-700/8 blur-[100px] rounded-full pointer-events-none" />

        <div ref={formRef} className="w-full max-w-[360px] relative">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-9 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-700">
              <Layers size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              4K<span className="text-violet-400">WallX</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="si-field text-3xl font-black text-white mb-1 tracking-tight">Welcome back</h1>
          <p  className="si-field text-sm text-zinc-500 mb-8">Sign in to your account to continue</p>

          {/* ── Social buttons ── */}
          <div className="si-field flex gap-3 mb-7">
            <SocialBtn icon={<GoogleIcon />} label="Google" />
            <SocialBtn icon={<GithubIcon />} label="GitHub" />
          </div>

          {/* Divider */}
          <div className="si-field flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.18em]">or continue with email</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Error banner */}
          {error && (
            <div className="si-error mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="si-field">
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-[0.12em]">
                Email address
              </label>
              <div className="relative group">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 focus:bg-white/[0.06] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="si-field">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.12em]">
                  Password
                </label>
                <Link href="#" className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 focus:bg-white/[0.06] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="si-field flex items-center gap-3 py-0.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 shrink-0 ${
                  rememberMe
                    ? 'bg-violet-600 border-violet-600 shadow-sm shadow-violet-500/40'
                    : 'border-white/20 bg-transparent'
                }`}
                aria-label="Remember me"
              >
                {rememberMe && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className="text-xs text-zinc-500">Remember me for 30 days</span>
            </div>

            {/* Submit */}
            <div className="si-field pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full relative flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/45 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <>Sign In <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" /></>
                )}
              </button>
            </div>
          </form>

          <p className="si-field mt-7 text-center text-sm text-zinc-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function StatPill({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-xl font-black text-white tracking-tight">{value}</div>
      <div className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function SocialBtn({ icon, label }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.15] text-sm text-zinc-300 font-medium transition-all duration-200 hover:-translate-y-0.5"
    >
      {icon}
      {label}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}
