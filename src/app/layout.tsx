import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-hanken',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CarbonGero — The Carbon Almanac',
  description: 'Smart for Business, Great for Planet. Track, measure and reward real climate action.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${hanken.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
