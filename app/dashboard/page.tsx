import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Suspense } from 'react'

async function DashboardContent() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Fetch announcements data
  const { data: announcements, error: announcementsError } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (announcementsError) {
    console.error('Error fetching announcements:', announcementsError)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Employee Portal</h1>
            <p className="text-muted-foreground mt-2">Welcome, <span className="text-blue-600 dark:text-blue-400 font-medium">{user.email}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <form action={logout}>
              <Button type="submit" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                Logout
              </Button>
            </form>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                User Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 mt-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <span className="text-green-700 dark:text-green-300 font-medium">Email:</span>
                  <span className="text-green-800 dark:text-green-200">{user.email}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">User ID:</span>
                  <span className="text-purple-800 dark:text-purple-200 font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <span className="text-orange-700 dark:text-orange-300 font-medium">Last Sign In:</span>
                  <span className="text-orange-800 dark:text-orange-200">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Company Announcements
              </CardTitle>
              <CardDescription>Latest updates and news</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => {
                    const colors = [
                      'border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
                      'border-l-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
                      'border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                    ]
                    return (
                      <div key={announcement.id} className={`border-l-4 pl-4 py-3 rounded-r-lg ${colors[index % 3]} hover:shadow-md transition-shadow`}>
                        <h3 className="font-semibold text-lg text-foreground">{announcement.title}</h3>
                        <p className="text-muted-foreground mt-1">{announcement.content}</p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground/70">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No announcements available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid gap-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <DashboardContent />
    </Suspense>
  )
}