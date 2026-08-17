import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { getTranslated } from '../utils/helpers'
import api from '../utils/api'
import { Clock, Star, User2, ArrowRight, ChevronRight, BookOpen, CheckCircle } from 'lucide-react'

export default function CourseDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/courses/slug/${slug}`).then(res => setCourse(res.data.data)).catch(console.error).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="loader" style={{ minHeight: '100vh', paddingTop: '80px' }}><div className="spinner" /></div>
  if (!course) return <div style={{ paddingTop: '120px', textAlign: 'center' }}><h2>Course not found</h2><Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Courses</Link></div>

  const advantages = [
    lang === 'uz' ? "Malakali va tajribali o'qituvchilar" : lang === 'ru' ? 'Квалифицированные и опытные преподаватели' : 'Qualified and experienced teachers',
    lang === 'uz' ? "Zamonaviy o'quv materiallari" : lang === 'ru' ? 'Современные учебные материалы' : 'Modern study materials',
    lang === 'uz' ? "Kichik guruhlar (max 12 kishi)" : lang === 'ru' ? 'Маленькие группы (макс. 12 человек)' : 'Small groups (max 12 people)',
    lang === 'uz' ? "Individual dars rejasi" : lang === 'ru' ? 'Индивидуальный план занятий' : 'Individual lesson plan',
    lang === 'uz' ? "Kurs tugagandan so'ng sertifikat" : lang === 'ru' ? 'Сертификат после окончания курса' : 'Certificate after course completion',
  ]

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, #1a2d5a 100%)', padding: '5rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/courses" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('courses')}</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{getTranslated(course, 'title', lang)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
            <div>
              {course.category && <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>{course.category}</span>}
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>{getTranslated(course, 'title', lang)}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>{getTranslated(course, 'description', lang)}</p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {course.duration && <div style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}><Clock size={15} /> {course.duration}</div>}
                {course.level && <div style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}><Star size={15} /> {course.level}</div>}
                {course.teacher_name_uz && <div style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}><User2 size={15} /> {getTranslated(course, 'teacher_name', lang) || course.teacher_name_uz}</div>}
              </div>
            </div>
            {course.image && (
              <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <img src={course.image} alt={getTranslated(course, 'title', lang)} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
            <div>
              {/* Curriculum */}
              {getTranslated(course, 'curriculum', lang) && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '1rem' }}>
                    <BookOpen size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} />
                    {t('curriculum')}
                  </h2>
                  <div style={{ color: 'var(--gray-700)', lineHeight: 1.9, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                    {getTranslated(course, 'curriculum', lang)}
                  </div>
                </div>
              )}

              {/* Advantages */}
              <div>
                <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '1rem' }}>
                  {t('advantages')}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {advantages.map((adv, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                      <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--gray-700)', fontSize: '0.9rem' }}>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '2rem', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  {lang === 'uz' ? "Kurs haqida" : lang === 'ru' ? 'О курсе' : 'About course'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: t('duration'), value: course.duration, icon: <Clock size={16} /> },
                    { label: t('level'), value: course.level, icon: <Star size={16} /> },
                    { label: t('category'), value: course.category, icon: <BookOpen size={16} /> },
                    { label: t('teacher'), value: getTranslated(course, 'teacher_name', lang) || course.teacher_name_uz, icon: <User2 size={16} /> },
                  ].filter(r => r.value).map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>{row.icon} {row.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.9rem' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  {t('connect')} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
