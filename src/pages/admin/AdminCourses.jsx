import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Image, X, Search } from 'lucide-react'

function CourseModal({ course, teachers, onClose, onSaved }) {
  const { t } = useLang()
  const isNew = !course?.id
  const [form, setForm] = useState({
    title_uz: course?.title_uz || '', title_en: course?.title_en || '', title_ru: course?.title_ru || '',
    slug: course?.slug || '', description_uz: course?.description_uz || '', description_en: course?.description_en || '',
    description_ru: course?.description_ru || '', curriculum_uz: course?.curriculum_uz || '',
    duration: course?.duration || '', level: course?.level || 'Beginner',
    teacher_id: course?.teacher_id || '', category: course?.category || '', status: course?.status || 'active', sort_order: course?.sort_order || 0,
  })
  const [imgFile, setImgFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('uz')

  const autoSlug = (val) => setForm(p => ({ ...p, title_uz: val, slug: p.slug || val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) data.append(k, v) })
      if (imgFile) data.append('image', imgFile)
      if (isNew) await api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/courses/${course.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(isNew ? 'Kurs yaratildi!' : 'Yangilandi!')
      onSaved()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{isNew ? t('add') + ' kurs' : t('edit')}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="tabs" style={{ marginBottom: '1.5rem' }}>
              {['uz', 'en', 'ru'].map(l => <button key={l} type="button" className={`tab-btn ${tab === l ? 'active' : ''}`} onClick={() => setTab(l)}>{l.toUpperCase()}</button>)}
            </div>
            {tab === 'uz' && <>
              <div className="form-group"><label className="form-label">{t('titleUz')} *</label><input type="text" className="form-control" value={form.title_uz} onChange={e => autoSlug(e.target.value)} required /></div>
              <div className="form-group"><label className="form-label">{t('descUz')}</label><textarea className="form-control" value={form.description_uz} onChange={e => setForm(p => ({ ...p, description_uz: e.target.value }))} rows={3} /></div>
              <div className="form-group"><label className="form-label">Dastur (UZ)</label><textarea className="form-control" value={form.curriculum_uz} onChange={e => setForm(p => ({ ...p, curriculum_uz: e.target.value }))} rows={4} /></div>
            </>}
            {tab === 'en' && <>
              <div className="form-group"><label className="form-label">{t('titleEn')}</label><input type="text" className="form-control" value={form.title_en} onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">{t('descEn')}</label><textarea className="form-control" value={form.description_en} onChange={e => setForm(p => ({ ...p, description_en: e.target.value }))} rows={3} /></div>
            </>}
            {tab === 'ru' && <>
              <div className="form-group"><label className="form-label">{t('titleRu')}</label><input type="text" className="form-control" value={form.title_ru} onChange={e => setForm(p => ({ ...p, title_ru: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">{t('descRu')}</label><textarea className="form-control" value={form.description_ru} onChange={e => setForm(p => ({ ...p, description_ru: e.target.value }))} rows={3} /></div>
            </>}
            <div className="form-row form-row-2">
              <div className="form-group"><label className="form-label">{t('slug')} *</label><input type="text" className="form-control" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required /></div>
              <div className="form-group"><label className="form-label">{t('category')}</label><input type="text" className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="IELTS, SAT, English..." /></div>
            </div>
            <div className="form-row form-row-3">
              <div className="form-group"><label className="form-label">{t('duration')}</label><input type="text" className="form-control" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="3 oy" /></div>
              <div className="form-group"><label className="form-label">{t('level')}</label>
                <select className="form-control" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                  {['Beginner','Elementary','Intermediate','Upper-Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">{t('selectTeacher')}</label>
                <select className="form-control" value={form.teacher_id} onChange={e => setForm(p => ({ ...p, teacher_id: e.target.value }))}>
                  <option value="">—</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name_uz}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group"><label className="form-label">{t('status')}</label>
                <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">{t('status_active')}</option>
                  <option value="inactive">{t('status_inactive')}</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">{t('sortOrder')}</label><input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('image')}</label>
              {course?.image && <div style={{ marginBottom: '0.5rem' }}><img src={course.image} style={{ height: '80px', borderRadius: '8px' }} alt="" /></div>}
              <input type="file" className="form-control" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }} onClick={onClose}>{t('cancel')}</button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">{loading ? <><div className="spinner spinner-sm" /> Saving...</> : t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCourses() {
  const { t } = useLang()
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params = search ? `?search=${search}&status=all` : '?status=all'
    api.get(`/courses${params}`).then(res => setCourses(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])
  useEffect(() => { api.get('/teachers').then(res => setTeachers(res.data.data || [])) }, [])

  const handleDelete = async (course) => {
    if (!confirm(t('confirmDelete'))) return
    try { await api.delete(`/courses/${course.id}`); toast.success('O\'chirildi'); load() }
    catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>{t('courses')}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ isNew: true })}><Plus size={16} /> {t('add')}</button>
      </div>
      <div className="admin-card">
        <div className="filter-bar">
          <div style={{ position: 'relative', maxWidth: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input type="text" className="form-control" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>
        </div>
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Rasm</th><th>Sarlavha</th><th>Kategoriya</th><th>Davomiylik</th><th>Holat</th><th>{t('actions')}</th></tr></thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td>{c.image ? <img src={c.image} style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} alt="" /> : <div style={{ width: '50px', height: '36px', background: 'var(--gray-200)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={16} color="var(--gray-400)" /></div>}</td>
                    <td style={{ fontWeight: 600, maxWidth: '200px' }}>{c.title_uz}</td>
                    <td>{c.category && <span className="badge badge-primary">{c.category}</span>}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{c.duration || '—'}</td>
                    <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{c.status === 'active' ? t('status_active') : t('status_inactive')}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => setModal(c)} className="btn btn-icon btn-sm" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }} title={t('edit')}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(c)} className="btn btn-icon btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }} title={t('delete')}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && <CourseModal course={modal.isNew ? null : modal} teachers={teachers} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </div>
  )
}
