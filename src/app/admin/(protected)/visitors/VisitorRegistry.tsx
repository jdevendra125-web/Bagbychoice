'use client'
import { useState, useEffect, useCallback } from 'react'
import { UserPlus, MessageCircle, Phone, Clock, Search, CheckCircle, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface Visitor {
  id: string
  name: string
  phone: string
  notes: string
  whatsapp_sent: boolean
  visited_at: string
}

const WA_MESSAGE = (name: string) =>
  `Hi ${name}! 🌸\n\nThank you so much for visiting *Bag By Choice* today! We truly appreciate your visit and hope you loved our collection. 💫\n\nPlease save our number to be the first to know about:\n✨ New arrivals\n🎁 Exclusive offers & discounts\n💼 Latest trending bags\n\nWe look forward to serving you again! 🛍️\n\n— Team Bag By Choice\n📞 8850417119\n📸 @BAGBY CHOICE`

function buildWhatsAppUrl(phone: string, name: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const withCode = cleaned.startsWith('91') ? cleaned : `91${cleaned}`
  return `https://wa.me/${withCode}?text=${encodeURIComponent(WA_MESSAGE(name))}`
}

export default function VisitorRegistry({ adminKey }: { adminKey: string }) {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', notes: '' })

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors', { headers: { 'x-admin-key': adminKey } })
      const data = await res.json()
      setVisitors(data.visitors || [])
    } catch {
      toast.error('Could not load visitors')
    } finally {
      setLoading(false)
    }
  }, [adminKey])

  useEffect(() => { fetchVisitors() }, [fetchVisitors])

  const handleSaveAndWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSaving(true)
    try {
      // Save to database
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ ...form, whatsapp_sent: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setVisitors(v => [data.visitor, ...v])
      toast.success(`${form.name} added! Opening WhatsApp...`)

      // Open WhatsApp with pre-filled message
      const waUrl = buildWhatsAppUrl(form.phone, form.name)
      window.open(waUrl, '_blank')

      setForm({ name: '', phone: '', notes: '' })
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveOnly = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ ...form, whatsapp_sent: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVisitors(v => [data.visitor, ...v])
      toast.success(`${form.name} saved!`)
      setForm({ name: '', phone: '', notes: '' })
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const sendWhatsApp = (visitor: Visitor) => {
    const waUrl = buildWhatsAppUrl(visitor.phone, visitor.name)
    window.open(waUrl, '_blank')
    // Mark as sent
    fetch('/api/visitors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id: visitor.id, whatsapp_sent: true }),
    }).then(() => {
      setVisitors(v => v.map(vis => vis.id === visitor.id ? { ...vis, whatsapp_sent: true } : vis))
    })
  }

  const filtered = visitors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.phone.includes(search)
  )

  const todayCount = visitors.filter(v =>
    new Date(v.visited_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Today', value: todayCount, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Total Visitors', value: visitors.length, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'WA Sent', value: visitors.filter(v => v.whatsapp_sent).length, icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Entry Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="brand-gradient p-4">
          <h2 className="font-bold text-white flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5" /> Log New Visitor
          </h2>
          <p className="text-white/70 text-xs mt-0.5">Enter details and send a WhatsApp thank-you instantly</p>
        </div>

        <form onSubmit={handleSaveAndWhatsApp} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Customer Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Priya Sharma"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp Number *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+91</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Notes (optional)</label>
            <input
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Interested in leather totes, came with friend..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
            />
          </div>

          {/* WhatsApp Message Preview */}
          {form.name && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp message preview
              </p>
              <p className="text-xs text-green-800 whitespace-pre-line leading-relaxed">
                {WA_MESSAGE(form.name || 'Customer').slice(0, 180)}...
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-60"
            >
              <MessageCircle className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save & Send WhatsApp'}
            </button>
            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={saving}
              className="px-4 py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-sm disabled:opacity-60"
            >
              Save Only
            </button>
          </div>
        </form>
      </div>

      {/* Visitor List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Visitor Log</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 w-40"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No visitors logged yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(visitor => (
              <div key={visitor.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{visitor.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{visitor.name}</p>
                    {visitor.whatsapp_sent && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Sent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />{visitor.phone}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(visitor.visited_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {visitor.notes && <p className="text-xs text-gray-400 mt-0.5 italic line-clamp-1">{visitor.notes}</p>}
                </div>
                <button
                  onClick={() => sendWhatsApp(visitor)}
                  title="Send WhatsApp"
                  className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
