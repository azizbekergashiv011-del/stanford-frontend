import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/helpers'
import { Plus, Edit2, Trash2, X, Search, Image } from 'lucide-react'

function NewsModal({ item, onClose, onSaved }) {
  const { t } = useLang()
  const isNew = !item?.id
  const [form, setForm] = useState({
    title_uz: item?.title_uz || '', title_en: item?.title_en || '', title_ru: item?.title_ru || '',
    slug: item?.slug || '',
    excerpt_uz: item?.excerpt_uz || '', excerpt_en: item?.excerpt_en || '', excerpt_ru: item?.excerpt_ru || '',
    content_uz: item?.content_uz || '', content_en: item?.content_en || '', content_ru: item?.content_ru || '',
    author: item?.author || 'Stanford Admin',
    published_at: item?.published_at ? item.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    status: item?.status || 'DRAFT',
  })
  const [imgFile, setImgFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('uz')

  const autoSlug = (val) => {
    const slug = val.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setForm(p => ({ ...p, title_uz: val, slug: p.slug || slug }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') data.append(k, v) })
      if (imgFile) data.append('cover_image', imgFile)
      if (isNew) await api.post('/news', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/news/${item.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(isNew ? 'Yangilik yaratildi!' : 'Yangilandi!')
      onSaved()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{isNew ? 'Yangilik qo\'shish' : t('edit')}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="tabs" style={{ marginBottom: '1.5rem' }}>
              {['uz', 'en', 'ru'].map(l => (
                <button key={l} type="button" className={`tab-btn ${tab === l ? 'active' : ''}`} onClick={() => setTab(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {tab === 'uz' && (
              <>
                <div className="form-group">
                  <label className="form-label">Sarlavha (UZ) *</label>
                  <input type="text" className="form-control" value={form.title_uz} onChange={e => autoSlug(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Qisqa tavsif (UZ)</label>
                  <textarea className="form-control" value={form.excerpt_uz} onChange={e => setForm(p => ({ ...p, excerpt_uz: e.target.value }))} rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kontent (UZ)</label>
                  <textarea className="form-control" value={form.content_uz} onChange={e => setForm(p => ({ ...p, content_uz: e.target.value }))} rows={6} />
                </div>
              </>
            )}
            {tab === 'en' && (
              <>
                <div className="form-group">
                  <label className="form-label">Title (EN)</label>
                  <input type="text" className="form-control" value={form.title_en} onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Excerpt (EN)</label>
                  <textarea className="form-control" value={form.excerpt_en} onChange={e => setForm(p => ({ ...p, excerpt_en: e.target.value }))} rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">Content (EN)</label>
                  <textarea className="form-control" value={form.content_en} onChange={e => setForm(p => ({ ...p, content_en: e.target.value }))} rows={6} />
                </div>
              </>
            )}
            {tab === 'ru' && (
              <>
                <div className="form-group">
                  <label className="form-label">Заголовок (RU)</label>
                  <input type="text" className="form-control" value={form.title_ru} onChange={e => setForm(p => ({ ...p, title_ru: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Краткое описание (RU)</label>
                  <textarea className="form-control" value={form.excerpt_ru} onChange={e => setForm(p => ({ ...p, excerpt_ru: e.target.value }))} rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">Контент (RU)</label>
                  <textarea className="form-control" value={form.content_ru} onChange={e => setForm(p => ({ ...p, content_ru: e.target.value }))} rows={6} />
                </div>
              </>
            )}

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input type="text" className="form-control" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Muallif</label>
                <input type="text" className="form-control" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
              </div>
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Chop etish sanasi</label>
                <input type="date" className="form-control" value={form.published_at} onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Holat</label>
                <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Muqova rasm</label>
              {item?.cover_image && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <img src={item.cover_image} alt="" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              )}
              <input type="file" className="form-control" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }} onClick={onClose}>{t('cancel')}</button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
              {loading ? <><div className="spinner spinner-sm" /> Saqlash...</> : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminNews() {
  const { t, lang } = useLang()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    else params.set('status', 'all')
    api.get(`/news?${params}`).then(res => setNews(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [search, statusFilter])

  useEffect(() => { load() }, [load])

  const handleDelete = async (item) => {
    if (!confirm(t('confirmDelete'))) return
    try { await api.delete(`/news/${item.id}`); toast.success("O'chirildi"); load() }
    catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>Yangiliklar</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ isNew: true })}>
          <Plus size={16} /> {t('add')}
        </button>
      </div>

      <div className="admin-card">
        <div className="filter-bar">
          <div style={{ position: 'relative', maxWidth: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input type="text" className="form-control" placeholder={t('search')} value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>
          <select className="form-control" style={{ maxWidth: '180px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">{t('all')}</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>

        {loading ? <div className="loader"><div className="spinner" /></div> : news.length === 0 ? (
          <div className="empty-state"><p>{t('noData')}</p></div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Rasm</th>
                  <th>Sarlavha</th>
                  <th>Muallif</th>
                  <th>Sana</th>
                  <th>Holat</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {news.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.cover_image
                        ? <img src={item.cover_image} style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} alt="" />
                        : <div style={{ width: '50px', height: '36px', background: 'var(--gray-100)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={16} color="var(--gray-400)" /></div>
                      }
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: '220px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title_uz}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>{item.slug}</div>
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{item.author}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                      {formatDate(item.published_at || item.created_at, lang)}
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'PUBLISHED' ? 'badge-success' : 'badge-gray'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => setModal(item)} className="btn btn-icon btn-sm"
                          style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }} title={t('edit')}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="btn btn-icon btn-sm"
                          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }} title={t('delete')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <NewsModal item={modal.isNew ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}
