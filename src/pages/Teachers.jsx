import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { getTranslated } from '../utils/helpers'
import api from '../utils/api'
import { Clock, Users } from 'lucide-react'

export default function Teachers() {
  const { t, lang } = useLang()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teachers').then(res => setTeachers(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('teachersTitle')}</h1>
          <p>{lang === 'uz' ? "Malakali va tajribali o'qituvchilarimiz bilan tanishing" : lang === 'ru' ? "Познакомьтесь с нашими квалифицированными преподавателями" : "Meet our qualified and experienced teachers"}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : teachers.length === 0 ? (
            <div className="empty-state"><Users size={48} /><h3>{t('noData')}</h3></div>
          ) : (
            <div className="grid grid-4" style={{ gap: '1.5rem' }}>
              {teachers.map(teacher => (
                <div key={teacher.id} className="card teacher-card card-body">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={getTranslated(teacher, 'name', lang)} className="teacher-img" loading="lazy" />
                  ) : (
                    <div className="teacher-avatar">{getTranslated(teacher, 'name', lang)[0]}</div>
                  )}
                  <h3>{getTranslated(teacher, 'name', lang)}</h3>
                  <p className="teacher-subject">{teacher.subject}</p>
                  <p className="teacher-pos">{teacher.position}</p>
                  {teacher.experience && <span className="teacher-exp"><Clock size={12} />{teacher.experience}</span>}
                  {getTranslated(teacher, 'bio', lang) && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.7, marginTop: '0.75rem', textAlign: 'left' }}>
                      {getTranslated(teacher, 'bio', lang)?.substring(0, 100)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
