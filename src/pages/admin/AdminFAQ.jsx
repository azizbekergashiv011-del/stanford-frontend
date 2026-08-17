import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../../context/LangContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'

function FAQModal({ item, onClose, onSaved }) {
  const { t } = useLang()
  const isNew = !item?.id
  const [form, setForm] = useState({
    question_uz: item?.question_uz || '', question_en: item?.question_en || '', question_ru: item?.question_ru || '',
    answer_uz: item?.answer_uz || '', answer_en: item?.answer_en || '', answer_ru: item?.answer_ru || '',
    sort_order: item?.sort_order || 0,
    status: item?.status || 'active',
  })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('uz')

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      if (isNew) await api.post('/faq', form)
      else await api.put(`/faq/${item.id}`, form)
      toast.success(isNew ? 'FAQ qo\'shildi!' : 'Yangilandi!')
      onSaved()
    } catch (err) { toast.error(err.response?.data?.message || t('error')) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{isNew ? 'FAQ qo\'shish' : t('edit')}</h2>
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
                  <label className="form-label">Savol (UZ) *</label>
                  <input type="text" className="form-control" value={form.question_uz} onChange={e => setForm(p => ({ ...p, question_uz: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Javob (UZ) *</label>
                  <textarea className="form-control" value={form.answer_uz} onChange={e => setForm(p => ({ ...p, answer_uz: e.target.value }))} rows={4} required />
                </div>
              </>
            )}
            {tab === 'en' && (
              <>
                <div className="form-group">
                  <label className="form-label">Question (EN)</label>
                  <input type="text" className="form-control" value={form.question_en} onChange={e => setForm(p => ({ ...p, question_en: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Answer (EN)</label>
                  <textarea className="form-control" value={form.answer_en} onChange={e => setForm(p => ({ ...p, answer_en: e.target.value }))} rows={4} />
                </div>
              </>
            )}
            {tab === 'ru' && (
              <>
                <div className="form-group">
                  <label className="form-label">Вопрос (RU)</label>
                  <input type="text" className="form-control" value={form.question_ru} onChange={e => setForm(p => ({ ...p, question_ru: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ответ (RU)</label>
                  <textarea className="form-control" value={form.answer_ru} onChange={e => setForm(p => ({ ...p, answer_ru: e.target.value }))} rows={4} />
                </div>
              </>
            )}

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Tartib</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Holat</label>
                <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>
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

export default function AdminFAQ() {
  const { t } = useLang()
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/faq?status=all').then(res => setFaqs(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (faq) => {
    if (!confirm(t('confirmDelete'))) return
    try { await api.delete(`/faq/${faq.id}`); toast.success("O'chirildi"); load() }
    catch (err) { toast.error(err.response?.data?.message || t('error')) }
  }

  return (
    <div>
      <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>FAQ</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ isNew: true })}>
          <Plus size={16} /> {t('add')}
        </button>
      </div>

      <div className="admin-card">
        {loading ? <div className="loader"><div className="spinner" /></div> : faqs.length === 0 ? (
          <div className="empty-state"><p>{t('noData')}</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => (
              <div key={faq.id} style={{ border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: expanded === faq.id ? 'rgba(63,108,225,0.04)' : 'white' }}>
                  <button onClick={() => setExpanded(prev => prev === faq.id ? null : faq.id)}
                    style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <span style={{ width: '28px', height: '28px', background: 'rgba(63,108,225,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '0.95rem' }}>{faq.question_uz}</span>
                    {expanded === faq.id ? <ChevronUp size={16} style={{ color: 'var(--primary)', marginLeft: 'auto' }} /> : <ChevronDown size={16} style={{ color: 'var(--gray-400)', marginLeft: 'auto' }} />}
                  </button>
                  <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
                    <span className={`badge ${faq.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: '0.7rem' }}>{faq.status}</span>
                    <button onClick={() => setModal(faq)} className="btn btn-icon btn-sm"
                      style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(faq)} className="btn btn-icon btn-sm"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {expanded === faq.id && (
                  <div style={{ padding: '0.75rem 1.25rem 1.25rem', borderTop: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.8 }}>{faq.answer_uz}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <FAQModal item={modal.isNew ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}
