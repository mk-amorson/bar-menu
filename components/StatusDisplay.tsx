'use client'

import { useUser } from '@/lib/user-context'

export default function StatusDisplay() {
  const { error } = useUser()

  if (!error) return null

  return (
    <div className="fixed top-20 right-4 z-50">
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
