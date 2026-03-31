import './globals.css'
import { Inter } from 'next/font/google'
import { SearchProvider } from '@/context/SearchContext'
import { AuthProvider }   from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: '4KWallX — Premium Wallpapers',
  description: 'Discover and download stunning 4K wallpapers for every screen.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen antialiased`}>
        {/*
          SearchProvider is a client component that wraps the whole app
          so both Navbar (search input) and Home page (filter logic) share
          the same query state without prop drilling.
        */}
        <AuthProvider>
          <SearchProvider>
            <Navbar />
            <main>{children}</main>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
