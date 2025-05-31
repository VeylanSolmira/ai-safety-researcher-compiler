// This is the root layout that wraps all pages in your app
// It defines the HTML structure and global styles/fonts
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ViewModeProvider } from '@/contexts/ViewModeContext'
import Footer from '@/components/Footer'

// Load the Inter font (clean, modern font used by many tech sites)
const inter = Inter({ subsets: ['latin'] })

// Metadata that appears in browser tabs and search results
export const metadata: Metadata = {
  title: 'AI Safety Researcher Compiler | Veylan Solmira',
  description: 'A comprehensive, interactive curriculum for systematically developing AI safety research capabilities',
}

// RootLayout wraps every page in your app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ViewModeProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ViewModeProvider>
      </body>
    </html>
  )
}