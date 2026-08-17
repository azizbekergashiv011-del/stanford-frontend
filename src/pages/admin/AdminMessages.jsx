import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/helpers'
import { Mail, MailOpen, Trash2, Phone, AtSign, MessageSquare } from 'lucide-react'

export default function AdminMessages() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all') // all | unread | read

  const load = useCallback(() => {
    setLoading(true)
    api.get('/contact/messages').then(res => setMessages(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleRead = async (msg) => {
    if (msg.is_read) return
    try {
      await api.patch(`/contact/messages/${msg.id}/read`)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m))
    } catch {}
  }

  const handleDelete = async (msg) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await api.delete(`/contact/messages/${msg.id}`)
      toast.success("O'chirildi")
      if (selected?.id === msg.id) setSelected(null)
      load()
    } catch (err) { toast.error(t('error')) }
  }

  const handleOpen = (msg) => {
    setSelected(msg)
    handleRead(msg)
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m))
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  })

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>
          Xabarlar
          {unreadCount > 0 && (
            <span style={{ marginLeft: '0.75rem', background: 'var(--danger)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
              {unreadCount} yangi
            </span>
          )}
        </h1>
        <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>Bog'lanish formasidan kelgan xabarlar</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', minHeight: '500px' }}>
        {/* Message List */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
            {[
              { key: 'all', label: `Barchasi (${messages.length})` },
              { key: 'unread', label: `O'qilmagan (${unreadCount})` },
              { key: 'read', label: "O'qilgan" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ flex: 1, padding: '0.875rem 0.5rem', fontSize: '0.78rem', fontWeight: 600, borderBottom: '2px solid transparent', transition: 'all 0.2s', color: filter === f.key ? 'var(--primary)' : 'var(--gray-500)', borderBottomColor: filter === f.key ? 'var(--primary)' : 'transparent', background: 'none' }}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loader" style={{ minHeight: '200px' }}><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--gray-300)' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Xabar yo'q</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', maxHeight: '600px' }}>
              {filtered.map(msg => (
                <div key={msg.id} onClick={() => handleOpen(msg)}
                  style={{
                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-200)', cursor: 'pointer',
                    background: selected?.id === msg.id ? 'rgba(63,108,225,0.06)' : !msg.is_read ? 'rgba(63,108,225,0.03)' : 'white',
                    borderLeft: !msg.is_read ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'background 0.15s'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                      {msg.is_read
                        ? <MailOpen size={15} color="var(--gray-400)" style={{ flexShrink: 0 }} />
                        : <Mail size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                      }
                      <span style={{ fontWeight: msg.is_read ? 500 : 700, fontSize: '0.875rem', color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {formatDate(msg.created_at, lang)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '1.5rem' }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="admin-card">
          {!selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--gray-400)' }}>
              <Mail size={48} style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 500 }}>Xabar tanlang</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Ko'rish uchun chap tomondagi xabarni bosing</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                    {selected.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                        <Phone size={14} /> {selected.phone}
                      </a>
                    )}
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                        <AtSign size={14} /> {selected.email}
                      </a>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                      {formatDate(selected.created_at, lang)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="btn btn-primary btn-sm">
                      <Mail size={14} /> Javob berish
                    </a>
                  )}
                  <button onClick={() => handleDelete(selected)} className="btn btn-sm"
                    style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                    <Trash2 size={14} /> O'chirish
                  </button>
                </div>
              </div>

              <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', lineHeight: 1.8, color: 'var(--gray-800)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${selected.is_read ? 'badge-success' : 'badge-warning'}`}>
                  {selected.is_read ? "O'qilgan" : "O'qilmagan"}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>ID: #{selected.id}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
