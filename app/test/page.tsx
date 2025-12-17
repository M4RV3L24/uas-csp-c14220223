import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

async function TestContent() {
  try {
    const supabase = await createClient()
    
    // Test connection
    const { data, error } = await supabase.auth.getUser()
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <div className="space-y-4">
          <div>
            <strong>Environment Variables:</strong>
            <ul className="ml-4">
              <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
              <li>SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</li>
            </ul>
          </div>
          <div>
            <strong>Auth Status:</strong>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify({ user: data.user?.email || 'Not logged in', error: error?.message || 'None' }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <pre className="bg-red-100 p-4 rounded">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    )
  }
}

function LoadingTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export default function TestPage() {
  return (
    <Suspense fallback={<LoadingTest />}>
      <TestContent />
    </Suspense>
  )
}