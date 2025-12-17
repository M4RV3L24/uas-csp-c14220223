import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Portal</h1>
            <p className="text-gray-600 mt-2">Welcome, {user.email}</p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Announcements</CardTitle>
              <CardDescription>Latest updates and news</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <p className="text-gray-600 mt-1">{announcement.content}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No announcements available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}