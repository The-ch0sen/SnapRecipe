import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'], // ✅ 只能用 'latin' 或 'latin-ext'
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'], // ✅
});

export const metadata: Metadata = {
  title: 'SnapRecipe',
  description: 'Get personalized recipe suggestions based on your ingredients.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
