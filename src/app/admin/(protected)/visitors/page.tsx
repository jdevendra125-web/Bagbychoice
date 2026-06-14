import { cookies } from 'next/headers'
import VisitorRegistry from './VisitorRegistry'

export const revalidate = 0

export default function VisitorsPage() {
  const cookieStore = cookies()
  const adminKey = cookieStore.get('admin_auth')?.value || ''
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Visitor Registry</h1>
        <p className="text-gray-500 text-sm mt-1">Log walk-in visitors and send them a WhatsApp thank-you message</p>
      </div>
      <VisitorRegistry adminKey={adminKey} />
    </div>
  )
}
