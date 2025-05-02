// File: app/page.tsx
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Never Lose Creator Income Again
      </h1>
      <p className="text-lg md:text-xl max-w-xl mb-8 text-gray-700 dark:text-gray-300">
        SubSaver monitors your donation links and income sources (like Ko-fi and Patreon) so you never miss silent income drops again.
      </p>
      <Link
        href="/login"
        className="bg-black text-white px-6 py-3 rounded text-lg hover:bg-gray-800"
      >
        Get Started Free →
      </Link>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-600">
        No credit card required. Just your email.
      </p>
    </main>
  )
}
