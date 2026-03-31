'use client'

import { createContext, useContext, useState } from 'react'

// Context holds the global search query
const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('')

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider')
  return ctx
}
