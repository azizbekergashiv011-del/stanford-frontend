import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { formatDate, copyToClipboard } from '../../utils/helpers'
import { Plus, Edit2, Trash2, AlertTriangle, Download, Copy, RefreshCw, CheckCircle, RotateCcw, Search, Eye, X } from 'lucide-react'

function CertModal({ cert, courses, onClose, onSaved }) {
  const { t } = useLang()
  const isNew = !cert?.id
  const [form, setForm] = useState({
    certificate_number: cert?.certificate_number || '',
    student_name: cert?.student_name || '',
    course_id: cert?.course_id || '',
    course_name: cert?.course_name || '',
    issue_date: cert?.issue_date || new Date().toISOString().split('T')[0],
    status: cert?.status || 'VALID',
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const getNextId = async () => {
    try {
      const res = await api.get('/certificates/next-number')
      setForm(p => ({ ...p, certificate_number: res.data.nextId }))
    } catch {}
  }

  useEffect(() => { if (isNew) getNextId() }, [isNew])

  const handleCourseChange = (e) => {
    const courseId = e.target.value
    setForm(p => ({ ...p, course_id: courseId }))
    if (courseId) {
      const course = courses.find(c => String(c.id) === String(courseId))
      if (course) setForm(p => ({ ...p, course_name: course.title_uz || '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v) })
      if (pdfFile) data.append('pdf', pdfFile)

      if (isNew) await api.post('/certificates', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/certificates/${cert.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })

      toast.success(isNew ? 'Sertifikat yaratildi!' : 'Yangilandi!')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{isNew ? t('add') + ' ' + t('certificates') : t('edit')}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('certIdLabel')} *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" className="form-control" value={form.certificate_number}
                    onChange={e => setForm(p => ({ ...p, certificate_number: e.target.value }))} required placeholder="STF-2026-000001" />
                  {isNew && <button type="button" className="btn btn-sm btn-outline" onClick={getNextId} title="Auto ID"><RefreshCw size={14} /></button>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('studentNameLabel')} *</label>
                <input type="text" className="form-control" value={form.student_name}
                  onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))} required />
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('selectCourse')}</label>
                <select className="form-control" value={form.course_id} onChange={handleCourseChange}>
                  <option value="">— {t('selectCourse')} —</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title_uz}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('courseNameLabel')} *</label>
                <input type="text" className="form-control" value={form.course_name}
                  onChange={e => setForm(p => ({ ...p, course_name: e.target.value }))} required />
              </div>
            </div>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">{t('issueDateLabel')} *</label>
                <input type="date" className="form-control" value={form.issue_date}
                  onChange={e => setForm(p => ({ ...p, issue_date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('status')}</label>
                <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="VALID">VALID</option>
                  <option value="REVOKED">REVOKED</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('pdfFile')} {isNew ? '(optional - auto generated if not uploaded)' : ''}</label>
              <input type="file" className="form-control" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }} onClick={onClose}>{t('cancel')}</button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
              {loading ? <><div className="spinner spinner-sm" /> Saving...</> : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCertificates() {
  const { t, lang } = useLang()
  const [certs, setCerts] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 20 })
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    api.get(`/certificates?${params}`).then(res => { setCerts(res.data.data || []); setTotal(res.data.total || 0) }).catch(console.error).finally(() => setLoading(false))
  }, [search, statusFilter, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { api.get('/courses?limit=100').then(res => setCourses(res.data.data || [])) }, [])

  const handleRevoke = async (cert) => {
    if (!confirm(t('confirmRevoke'))) return
    try {
      await api.patch(`/certificates/${cert.id}/revoke`)
      toast.success('Sertifikat bekor qilindi')
      load()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  const handleRestore = async (cert) => {
    try {
      await api.patch(`/certificates/${cert.id}/restore`)
      toast.success('Sertifikat tiklandi')
      load()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  const handleDelete = async (cert) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await api.delete(`/certificates/${cert.id}`)
      toast.success('O\'chirildi')
      load()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  const handleCopyLink = (cert) => {
    const url = `${window.location.origin}/verify/${cert.certificate_number}`
    copyToClipboard(url)
    toast.success('Havola nusxalandi!')
  }

  const handleDownload = async (cert) => {
    try {
      const response = await fetch(`/api/certificates/download/${cert.certificate_number}`)
      if (!response.ok) throw new Error('Failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cert_${cert.certificate_number}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('PDF yuklab olishda xatolik') }
  }

  const handleRegenQR = async (cert) => {
    try {
      await api.post(`/certificates/${cert.id}/regenerate-qr`)
      toast.success('QR yangilandi!')
      load()
    } catch { toast.error(t('error')) }
  }

  const handleRegenPDF = async (cert) => {
    try {
      await api.post(`/certificates/${cert.id}/regenerate-pdf`)
      toast.success('PDF yangilandi!')
      load()
    } catch { toast.error(t('error')) }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>{t('certificates')}</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>Jami: {total}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ isNew: true })}>
          <Plus size={16} /> {t('add')}
        </button>
      </div>

      <div className="admin-card">
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input type="text" className="form-control" placeholder={t('search')} value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ paddingLeft: '2.5rem' }} />
          </div>
          <select className="form-control" style={{ maxWidth: '160px' }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">{t('all')}</option>
            <option value="VALID">VALID</option>
            <option value="REVOKED">REVOKED</option>
          </select>
        </div>

        {loading ? <div className="loader"><div className="spinner" /></div> : certs.length === 0 ? (
          <div className="empty-state"><p>{t('noData')}</p></div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>{t('studentNameLabel')}</th>
                  <th>{t('courseNameLabel')}</th>
                  <th>{t('issueDateLabel')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {certs.map(cert => (
                  <tr key={cert.id}>
                    <td>
                      <code style={{ fontSize: '0.8rem', background: 'var(--gray-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600, color: 'var(--primary)' }}>
                        {cert.certificate_number}
                      </code>
                    </td>
                    <td style={{ fontWeight: 500 }}>{cert.student_name}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{cert.course_name}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{formatDate(cert.issue_date, lang)}</td>
                    <td><span className={`badge ${cert.status === 'VALID' ? 'badge-success' : 'badge-danger'}`}>{cert.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                        <a href={`/verify/${cert.certificate_number}`} target="_blank" rel="noopener noreferrer" className="btn btn-icon btn-sm" style={{ background: 'rgba(63,108,225,0.1)', color: 'var(--primary)' }} title={t('view')}>
                          <Eye size={14} />
                        </a>
                        <button onClick={() => setModal(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }} title={t('edit')}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDownload(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }} title={t('download')}>
                          <Download size={14} />
                        </button>
                        <button onClick={() => handleCopyLink(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }} title={t('copyLink')}>
                          <Copy size={14} />
                        </button>
                        <button onClick={() => handleRegenPDF(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }} title={t('regeneratePDF')}>
                          <RefreshCw size={14} />
                        </button>
                        {cert.status === 'VALID' ? (
                          <button onClick={() => handleRevoke(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }} title={t('revoke')}>
                            <AlertTriangle size={14} />
                          </button>
                        ) : (
                          <button onClick={() => handleRestore(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }} title={t('restore')}>
                            <RotateCcw size={14} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(cert)} className="btn btn-icon btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }} title={t('delete')}>
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

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <CertModal cert={modal.isNew ? null : modal} courses={courses}
          onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}
