import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2, X, Upload, Image } from 'lucide-react'

function GalleryModal({ item, onClose, onSaved }) {
  const { t } = useLang()
  const isNew = !item?.id
  const [form, setForm] = useState({
    title: item?.title || '',
    category: item?.category || 'general',
    sort_order: item?.sort_order || 0,
    status: item?.status || 'active',
  })
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(item?.image || null)
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImgFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isNew && !imgFile) { toast.error('Rasm tanlang!'); return }
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (imgFile) data.append('image', imgFile)
      if (isNew) await api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/gallery/${item.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(isNew ? 'Rasm qo\'shildi!' : 'Yangilandi!')
      onSaved()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) } finally { setLoading(false) }
  }

  const categories = ['general', 'events', 'classes', 'students', 'teachers', 'graduation', 'other']

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isNew ? 'Rasm qo\'shish' : t('edit')}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Image upload area */}
            <div className="form-group">
              <label className="form-label">Rasm {isNew ? '*' : ''}</label>
              <label style={{
                display: 'block', border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius)',
                padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-300)'}>
                {preview ? (
                  <img src={preview} alt="" style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: 'var(--gray-400)' }}>
                    <Upload size={32} style={{ margin: '0 auto 0.75rem' }} />
                    <p style={{ fontSize: '0.875rem' }}>Rasm yuklash uchun bosing</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>JPG, PNG, WEBP — max 5MB</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Sarlavha</label>
              <input type="text" className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Rasm sarlavhasi..." />
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Kategoriya</label>
                <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tartib</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Holat</label>
              <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
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

export default function AdminGallery() {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params = categoryFilter ? `?category=${categoryFilter}&status=all` : '?status=all'
    api.get(`/gallery${params}`).then(res => setItems(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [categoryFilter])

  useEffect(() => { load() }, [load])

  const handleDelete = async (item) => {
    if (!confirm(t('confirmDelete'))) return
    try { await api.delete(`/gallery/${item.id}`); toast.success("O'chirildi"); load() }
    catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))]

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>Galereya</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>Jami: {items.length} ta rasm</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ isNew: true })}>
          <Plus size={16} /> Rasm qo'shish
        </button>
      </div>

      <div className="admin-card">
        {categories.length > 0 && (
          <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
            <button className={`btn btn-sm ${!categoryFilter ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategoryFilter('')}>
              {t('all')}
            </button>
            {categories.map(c => (
              <button key={c} className={`btn btn-sm ${categoryFilter === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategoryFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? <div className="loader"><div className="spinner" /></div> : items.length === 0 ? (
          <div className="empty-state">
            <Image size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray-300)' }} />
            <h3>Rasmlar yo'q</h3>
            <p>Yangi rasm qo'shing</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                <img src={item.image} alt={item.title || ''} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} loading="lazy" />
                {item.status === 'inactive' && (
                  <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                    <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>inactive</span>
                  </div>
                )}
                <div style={{ padding: '0.75rem' }}>
                  {item.title && <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>{item.category}</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={() => setModal(item)} className="btn btn-icon"
                        style={{ padding: '0.25rem', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', borderRadius: '6px' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="btn btn-icon"
                        style={{ padding: '0.25rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '6px' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <GalleryModal item={modal.isNew ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}
