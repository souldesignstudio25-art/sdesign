import { requireAdminPage } from '@/lib/auth/require-admin'
import { getAdminOverviewData } from '@/lib/cms/queries'
import { AdminDashboardShell } from '@/components/admin/admin-dashboard-shell'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const actor = await requireAdminPage()
  const data = await getAdminOverviewData()

  // Fetch like counts for all projects
  const likeCounts: Record<string, number> = {}
  try {
    const projects = data.projects
    const uniqueSlugs = [...new Set(projects.map((p: any) => p.slug).filter(Boolean))]
    for (const slug of uniqueSlugs) {
      try {
        const res = await fetch(`/api/projects/${slug}/likes`, {
          cache: 'no-store',
        })
        const likeData = await res.json()
        if (res.ok) {
          likeCounts[slug] = likeData.count || 0
        }
      } catch (err) {
        console.warn(`[AdminPage] Failed to fetch like count for ${slug}`, err)
        likeCounts[slug] = 0
      }
    }
  } catch (err) {
    console.error('[AdminPage] Error fetching like counts:', err)
  }

  return <AdminDashboardShell actor={actor} initialData={{ ...data, likeCounts }} />
}

