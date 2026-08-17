import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

function TeacherModal({ teacher, onClose, onSaved }) {
  const { t } = useLang()
  const isNew = !teacher?.id
  const [form, setForm] = useState({
    name_uz: teacher?.name_uz || '', name_en: teacher?.name_en || '', name_ru: teacher?.name_ru || '',
    position: teacher?.position || '', subject: teacher?.subject || '', experience: teacher?.experience || '',
    bio_uz: teacher?.bio_uz || '', bio_en: teacher?.bio_en || '', bio_ru: teacher?.bio_ru || '',
    status: teacher?.status || 'active', sort_order: teacher?.sort_order || 0,
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('uz')

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') data.append(k, v) })
      if (photoFile) data.append('photo', photoFile)
      if (isNew) await api.post('/teachers', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/teachers/${teacher.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(isNew ? "O'qituvchi yaratildi!" : 'Yangilandi!'); onSaved()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay"><div className="modal modal-lg">
      <div className="modal-header"><h2>{isNew ? "O'qituvchi qo'shish" : t('edit')}</h2><button className="close-btn" onClick={onClose}><X size={20} /></button></div>
      <form onSubmit={handleSubmit}><div className="modal-body">
        <div className="tabs" style={{ marginBottom: '1.5rem' }}>
          {['uz', 'en', 'ru'].map(l => <button key={l} type="button" className={`tab-btn ${tab === l ? 'active' : ''}`} onClick={() => setTab(l)}>{l.toUpperCase()}</button>)}
        </div>
        {tab === 'uz' && <>
          <div className="form-group"><label className="form-label">Ism (UZ) *</label><input type="text" className="form-control" value={form.name_uz} onChange={e => setForm(p => ({ ...p, name_uz: e.target.value }))} required /></div>
          <div className="form-group"><label className="form-label">{t('bio')} (UZ)</label><textarea className="form-control" value={form.bio_uz} onChange={e => setForm(p => ({ ...p, bio_uz: e.target.value }))} rows={3} /></div>
        </>}
        {tab === 'en' && <>
          <div className="form-group"><label className="form-label">Name (EN)</label><input type="text" className="form-control" value={form.name_en} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Bio (EN)</label><textarea className="form-control" value={form.bio_en} onChange={e => setForm(p => ({ ...p, bio_en: e.target.value }))} rows={3} /></div>
        </>}
        {tab === 'ru' && <>
          <div className="form-group"><label className="form-label">Имя (RU)</label><input type="text" className="form-control" value={form.name_ru} onChange={e => setForm(p => ({ ...p, name_ru: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Биография (RU)</label><textarea className="form-control" value={form.bio_ru} onChange={e => setForm(p => ({ ...p, bio_ru: e.target.value }))} rows={3} /></div>
        </>}
        <div className="form-row form-row-2">
          <div className="form-group"><label className="form-label">{t('position')}</label><input type="text" className="form-control" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">{t('subject')}</label><input type="text" className="form-control" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} /></div>
        </div>
        <div className="form-row form-row-2">
          <div className="form-group"><label className="form-label">{t('experience')}</label><input type="text" className="form-control" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="5 yil" /></div>
          <div className="form-group"><label className="form-label">{t('status')}</label>
            <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="active">{t('status_active')}</option><option value="inactive">{t('status_inactive')}</option>
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">{t('photo')}</label>
          {teacher?.photo && <img src={teacher.photo} style={{ height: '80px', borderRadius: '8px', marginBottom: '0.5rem' }} alt="" />}
          <input type="file" className="form-control" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }} onClick={onClose}>{t('cancel')}</button>
        <button type="submit" disabled={loading} className="btn btn-primary btn-sm">{loading ? <><div className="spinner spinner-sm" /> Saving...</> : t('save')}</button>
      </div></form>
    </div></div>
  )
}

export default function AdminTeachers() {
  const { t } = useLang()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = useCallback(() => { setLoading(true); api.get('/teachers?status=all').then(res => setTeachers(res.data.data || [])).catch(console.error).finally(() => setLoading(false)) }, [])
  useEffect(() => { load() }, [load])

  const handleDelete = async (t_) => {
    if (!confirm(t('confirmDelete'))) return
    try { await api.delete(`/teachers/${t_.id}`); toast.success("O'chirildi"); load() }
    catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>{t('teachers')}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ isNew: true })}><Plus size={16} /> {t('add')}</button>
      </div>
      <div className="admin-card">
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="grid grid-4" style={{ gap: '1.25rem' }}>
            {teachers.map(teacher => (
              <div key={teacher.id} style={{ background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center' }}>
                {teacher.photo ? <img src={teacher.photo} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.75rem', border: '3px solid var(--primary)' }} alt={teacher.name_uz} /> : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{teacher.name_uz?.[0]}</div>}
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{teacher.name_uz}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{teacher.subject}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>{teacher.experience}</p>
                <span className={`badge ${teacher.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>{teacher.status}</span>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => setModal(teacher)} className="btn btn-icon btn-sm" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(teacher)} className="btn btn-icon btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && <TeacherModal teacher={modal.isNew ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </div>
  )
}
