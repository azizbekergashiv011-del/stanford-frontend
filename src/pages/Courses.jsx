import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { getTranslated } from '../utils/helpers'
import api from '../utils/api'
import { BookOpen, Search, Clock, Star, User2, ArrowRight, Filter } from 'lucide-react'

export default function Courses() {
  const { t, lang } = useLang()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')

  const categories = ['IELTS', 'SAT', 'English', 'Math', 'Other']
  const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced']

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (level) params.set('level', level)
    api.get(`/courses?${params}`).then(res => setCourses(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [search, category, level])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('coursesTitle')}</h1>
          <p>{lang === 'uz' ? "IELTS, SAT, Ingliz tili va boshqa kurslar" : lang === 'ru' ? "IELTS, SAT, английский язык и другие курсы" : "IELTS, SAT, English and other courses"}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="filter-bar">
            <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input type="text" className="form-control" placeholder={t('search')} value={search}
                onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <select className="form-control" style={{ maxWidth: '180px' }} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">{t('all')} {t('category')}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-control" style={{ maxWidth: '180px' }} value={level} onChange={e => setLevel(e.target.value)}>
              <option value="">{t('all')} {t('level')}</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {(search || category || level) && (
              <button className="btn btn-sm" style={{ color: 'var(--gray-600)' }} onClick={() => { setSearch(''); setCategory(''); setLevel('') }}>
                ✕ Clear
              </button>
            )}
          </div>

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} />
              <h3>{t('noData')}</h3>
              <p>{lang === 'uz' ? "Hozircha kurslar yo'q." : lang === 'ru' ? "Курсов пока нет." : "No courses yet."}</p>
            </div>
          ) : (
            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              {courses.map(course => (
                <div key={course.id} className="card course-card">
                  <div className="card-img-wrap">
                    {course.image ? (
                      <img src={course.image} alt={getTranslated(course, 'title', lang)} loading="lazy" />
                    ) : (
                      <div style={{ height: '200px', background: 'linear-gradient(135deg, #1a2d5a, #3F6CE1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={48} color="rgba(255,255,255,0.3)" />
                      </div>
                    )}
                    {course.category && <span className="badge badge-primary" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>{course.category}</span>}
                  </div>
                  <div className="card-body">
                    <h3>{getTranslated(course, 'title', lang)}</h3>
                    <p>{getTranslated(course, 'description', lang)?.substring(0, 120)}...</p>
                    <div className="course-meta">
                      {course.duration && <span className="course-meta-item"><Clock size={13} />{course.duration}</span>}
                      {course.level && <span className="course-meta-item"><Star size={13} />{course.level}</span>}
                      {course.teacher_name_uz && <span className="course-meta-item"><User2 size={13} />{getTranslated(course, 'teacher_name', lang) || course.teacher_name_uz}</span>}
                    </div>
                    <div className="card-footer">
                      <Link to={`/courses/${course.slug}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                        {t('courseDetail')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
