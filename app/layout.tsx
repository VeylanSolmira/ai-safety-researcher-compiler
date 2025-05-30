// This is the root layout that wraps all pages in your app
// It defines the HTML structure and global styles/fonts
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ViewModeProvider } from '@/contexts/ViewModeContext'
import ViewModeToggle from '@/components/ViewModeToggle'

// Load the Inter font (clean, modern font used by many tech sites)
const inter = Inter({ subsets: ['latin'] })

// Metadata that appears in browser tabs and search results
export const metadata: Metadata = {
  title: 'AI Safety Researcher Compiler',
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
          <header className="fixed top-0 right-0 z-50 p-4">
            <ViewModeToggle />
          </header>
          <main>{children}</main>
        </ViewModeProvider>
      </body>
    </html>
  )
}