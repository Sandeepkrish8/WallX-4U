'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { categories } from '@/data/wallpapers'
import { Upload, X, CheckCircle, ImagePlus, Tag, FolderOpen, Loader2 } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const dropRef = useRef(null)
  const formRef = useRef(null)
  const pageRef = useRef(null)

  // Page entrance animation
  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const processFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File size must be under 20 MB.')
      return
    }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  // ── Drag & Drop handlers ──
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files[0])
  }
  const onFileInput = (e) => processFile(e.target.files[0])

  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  // ── Simulated upload ──
  const handleUpload = () => {
    if (!file) { setError('Please select an image first.'); return }
    if (!title.trim()) { setError('Please enter a title.'); return }
    if (!category) { setError('Please select a category.'); return }

    setError('')
    setUploading(true)

    // Simulate network delay (2 s)
    setTimeout(() => {
      setUploading(false)
      setSuccess(true)
      // Animate success card
      gsap.fromTo(
        '.success-card',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }, 2000)
  }

  const resetAll = () => {
    clearFile()
    setTitle('')
    setCategory('')
    setTagsInput('')
    setSuccess(false)
    setError('')
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── Page heading ── */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Upload a <span className="gradient-text">Wallpaper</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            Share your art with the world. Supported formats: JPG, PNG, WebP.
          </p>
        </div>

        {success ? (
          /* ── Success state ── */
          <div className="success-card bg-[#161616] border border-green-500/30 rounded-2xl p-10 text-center">
            <CheckCircle size={52} className="mx-auto text-green-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-1">Upload Successful!</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Your wallpaper &ldquo;{title}&rdquo; has been submitted.
            </p>
            <button
              onClick={resetAll}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Upload Another
            </button>
          </div>
        ) : (
          <div ref={formRef} className="space-y-6">

            {/* ── Drop Zone ── */}
            <div
              ref={dropRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                isDragging
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 bg-[#161616] hover:border-white/20'
              }`}
              style={{ minHeight: preview ? 'auto' : 240 }}
            >
              {preview ? (
                /* Image preview */
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-72 object-cover rounded-2xl"
                  />
                  {/* Remove button */}
                  <button
                    onClick={clearFile}
                    className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors duration-200"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-zinc-300">
                    {file?.name}
                  </div>
                </div>
              ) : (
                /* Drop prompt */
                <label className="flex flex-col items-center justify-center h-full py-16 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileInput}
                  />
                  <ImagePlus
                    size={40}
                    className={`mb-4 transition-colors duration-200 ${
                      isDragging ? 'text-violet-400' : 'text-zinc-600'
                    }`}
                  />
                  <p className="text-zinc-300 font-medium mb-1">
                    {isDragging ? 'Drop it here!' : 'Drag & drop your image'}
                  </p>
                  <p className="text-zinc-600 text-sm">or click to browse files</p>
                </label>
              )}
            </div>

            {/* ── Form fields ── */}
            <div className="bg-[#161616] rounded-2xl border border-white/5 p-6 space-y-5">

              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                  <FolderOpen size={15} className="text-violet-400" />
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Misty Mountain Peaks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 transition-colors duration-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                  <Upload size={15} className="text-violet-400" />
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a category…</option>
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                  <Tag size={15} className="text-violet-400" />
                  Tags
                  <span className="text-zinc-600 text-xs font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. mountain, snow, nature"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 transition-colors duration-200"
                />
                {/* Tag preview pills */}
                {tagsInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-violet-500/15 text-violet-300 rounded-full border border-violet-500/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Error message ── */}
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                {error}
              </p>
            )}

            {/* ── Upload button ── */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Wallpaper
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
