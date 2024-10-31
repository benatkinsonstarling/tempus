import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Your dynamic weather application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen`}>
        {children}
        <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
