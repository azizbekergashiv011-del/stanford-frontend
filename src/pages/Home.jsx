import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { getTranslated, formatDate } from '../utils/helpers'
import api from '../utils/api'
import {
  ArrowRight, BookOpen, Users, Award, TrendingUp,
  CheckCircle, ChevronRight, Search, Star, Clock, User2,
  GraduationCap, Target, Lightbulb, Heart, Zap, Shield
} from 'lucide-react'

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const num = parseInt(target) || 0
    const animate = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * num))
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(num)
    }
    requestAnimationFrame(animate)
  }, [target, duration, start])
  return count
}

function StatItem({ value, label }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const numMatch = String(value).match(/^(\d+)(.*)$/)
  const numPart = numMatch ? parseInt(numMatch[1]) : 0
  const suffix = numMatch ? numMatch[2] : ''
  const count = useCountUp(numPart, 2000, visible)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">{visible ? count : 0}{suffix}</span>
      <p className="stat-label">{label}</p>
    </div>
  )
}

export default function Home() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [news, setNews] = useState([])
  const [settings, setSettings] = useState({})
  const [certId, setCertId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/courses?limit=4'),
      api.get('/teachers?status=active'),
      api.get('/news?limit=3'),
      api.get('/settings/public'),
    ]).then(([cRes, tRes, nRes, sRes]) => {
      setCourses(cRes.data.data || [])
      setTeachers((tRes.data.data || []).slice(0, 4))
      setNews(nRes.data.data || [])
      setSettings(sRes.data.data || {})
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleCertCheck = (e) => {
    e.preventDefault()
    if (certId.trim()) navigate(`/verify/${certId.trim()}`)
  }

  const whyItems = [
    { icon: <Users size={22} />, key: 'why1', desc: "Har bir o'quvchiga individual yondashuv bilan yuqori natijalar erishish." },
    { icon: <Lightbulb size={22} />, key: 'why2', desc: "Zamonaviy pedagogik usullar va innovatsion o'quv texnologiyalari." },
    { icon: <Target size={22} />, key: 'why3', desc: "Har bir o'quvchining qobiliyatiga mos o'quv rejasi." },
    { icon: <GraduationCap size={22} />, key: 'why4', desc: "Real vaziyatlarda amaliy ko'nikmalarni rivojlantirish." },
    { icon: <TrendingUp size={22} />, key: 'why5', desc: "O'quvchilarning 95% imtihonlarda muvaffaqiyat qozongan." },
    { icon: <Heart size={22} />, key: 'why6', desc: "Zamonaviy, qulay va ilhomlantiruvchi o'quv muhiti." },
  ]

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">
              <Star size={14} />
              {lang === 'uz' ? "Namanganning #1 o'quv markazi" : lang === 'ru' ? 'Учебный центр №1 в Намангане' : 'Namangan\'s #1 Training Center'}
            </div>
            <h1 className="hero-title">
              {t('heroTitle')}
              <span className="accent">"{t('heroSubtitle')}"</span>
            </h1>
            <p className="hero-subtitle">{t('heroDesc')}</p>
            <p className="hero-desc">
              {lang === 'uz'
                ? "IELTS, SAT, Ingliz tili va boshqa kurslar orqali o'z kelajagingizni quring. Malakali o'qituvchilar, zamonaviy usullar va kafolatlangan natijalar."
                : lang === 'ru'
                ? "Стройте своё будущее через курсы IELTS, SAT, английского языка и многое другое. Квалифицированные преподаватели, современные методы и гарантированные результаты."
                : "Build your future through IELTS, SAT, English and other courses. Qualified teachers, modern methods and guaranteed results."}
            </p>
            <div className="hero-btns">
              <Link to="/courses" className="btn btn-primary btn-lg">
                <BookOpen size={18} />
                {t('viewCourses')}
              </Link>
              <Link to="/about" className="btn btn-outline-white btn-lg">
                {t('aboutUs')}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative SVG shapes */}
        <svg className="hero-shapes" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="2" />
          <circle cx="200" cy="200" r="130" stroke="white" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="80" stroke="white" strokeWidth="1" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="white" strokeWidth="1" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="white" strokeWidth="1" />
          <rect x="120" y="120" width="160" height="160" stroke="white" strokeWidth="1.5" transform="rotate(45 200 200)" />
        </svg>
      </section>

      {/* ABOUT SECTION */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-tag">{t('aboutTitle')}</div>
              <h2 className="section-title">Stanford Training Center <span>haqida</span></h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
                {lang === 'uz'
                  ? "Stanford Training Center 2020-yildan beri Namangan viloyatida ta'lim bermoqda. Biz o'quvchilarimizning muvaffaqiyati uchun eng yaxshi o'qituvchilar va zamonaviy o'quv metodlarini birlashtiramiz."
                  : lang === 'ru'
                  ? "Stanford Training Center работает в Наманганской области с 2020 года. Мы объединяем лучших преподавателей и современные методы обучения для достижения успеха наших студентов."
                  : "Stanford Training Center has been serving Namangan region since 2020. We combine the best teachers and modern teaching methods for our students' success."}
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>
                {lang === 'uz'
                  ? "IELTS, SAT, Ingliz tili kurslaridan tortib to maxsus tayyorlov dasturlarigacha — har bir o'quvchiga mos yo'l bor."
                  : lang === 'ru'
                  ? "От курсов IELTS, SAT, английского языка до специализированных программ подготовки — для каждого студента есть подходящий путь."
                  : "From IELTS, SAT, English language courses to specialized preparation programs — there is a path for every student."}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-primary">
                  {t('learnMore')} <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  {t('connect')}
                </Link>
              </div>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { icon: <GraduationCap size={28} />, title: lang === 'uz' ? "Yuqori natijalar" : lang === 'ru' ? 'Высокие результаты' : 'High Results', desc: lang === 'uz' ? "95% o'quvchilar maqsadlariga erishadilar" : lang === 'ru' ? '95% студентов достигают своих целей' : '95% of students achieve their goals' },
                  { icon: <Users size={28} />, title: lang === 'uz' ? "Tajribali o'qituvchilar" : lang === 'ru' ? 'Опытные преподаватели' : 'Experienced Teachers', desc: lang === 'uz' ? "5-10 yillik tajribaga ega mutaxassislar" : lang === 'ru' ? 'Специалисты с опытом 5-10 лет' : 'Specialists with 5-10 years of experience' },
                  { icon: <Zap size={28} />, title: lang === 'uz' ? "Intensiv dasturlar" : lang === 'ru' ? 'Интенсивные программы' : 'Intensive Programs', desc: lang === 'uz' ? "Qisqa vaqtda maksimal natija" : lang === 'ru' ? 'Максимальный результат за короткое время' : 'Maximum result in short time' },
                  { icon: <Shield size={28} />, title: lang === 'uz' ? "Sertifikatlangan" : lang === 'ru' ? 'Сертифицировано' : 'Certified', desc: lang === 'uz' ? "Tan olingan sertifikatlar" : lang === 'ru' ? 'Признанные сертификаты' : 'Recognized certificates' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(63,108,225,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--dark)' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t('courses')}</div>
            <h2 className="section-title">{t('coursesTitle')}</h2>
            <p className="section-subtitle">
              {lang === 'uz' ? "IELTS, SAT va Ingliz tili kurslarida yuqori natijalarga erishing." : lang === 'ru' ? "Достигайте высоких результатов на курсах IELTS, SAT и английского языка." : "Achieve high results in IELTS, SAT and English language courses."}
            </p>
          </div>

          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : (
            <div className="grid grid-4" style={{ gap: '1.5rem' }}>
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
                    <p>{getTranslated(course, 'description', lang)?.substring(0, 100)}...</p>
                    <div className="course-meta">
                      {course.duration && <span className="course-meta-item"><Clock size={13} />{course.duration}</span>}
                      {course.level && <span className="course-meta-item"><Star size={13} />{course.level}</span>}
                      {course.teacher_name_uz && <span className="course-meta-item"><User2 size={13} />{lang === 'uz' ? course.teacher_name_uz : lang === 'ru' ? course.teacher_name_ru : course.teacher_name_en}</span>}
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

          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/courses" className="btn btn-outline btn-lg">
              {t('allCourses')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div className="stats-grid">
            <StatItem value={settings.stats_courses || '10+'} label={t('statsCourses')} />
            <StatItem value={settings.stats_students || '500+'} label={t('statsStudents')} />
            <StatItem value={settings.stats_teachers || '20+'} label={t('statsTeachers')} />
            <StatItem value={settings.stats_results || '95%'} label={t('statsResults')} />
          </div>
        </div>
      </section>

      {/* WHY STANFORD */}
      <section className="section" style={{ background: '#0d1b35' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag" style={{ background: 'rgba(63,108,225,0.2)', color: '#8ab4f8' }}>{t('whyTitle')}</div>
            <h2 className="section-title" style={{ color: 'white' }}>
              {lang === 'uz' ? 'Nima uchun ' : lang === 'ru' ? 'Почему ' : 'Why '}<span>Stanford?</span>
            </h2>
          </div>
          <div className="why-grid">
            {whyItems.map((item, i) => (
              <div key={i} className="why-item">
                <div className="why-icon">{item.icon}</div>
                <h3>{t(item.key)}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      {teachers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">{t('teachers')}</div>
              <h2 className="section-title">{t('teachersTitle')}</h2>
            </div>
            <div className="grid grid-4" style={{ gap: '1.5rem' }}>
              {teachers.map(teacher => (
                <div key={teacher.id} className="card teacher-card card-body">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={getTranslated(teacher, 'name', lang)} className="teacher-img" loading="lazy" />
                  ) : (
                    <div className="teacher-avatar">
                      {getTranslated(teacher, 'name', lang)[0]}
                    </div>
                  )}
                  <h3>{getTranslated(teacher, 'name', lang)}</h3>
                  <p className="teacher-subject">{teacher.subject}</p>
                  <p className="teacher-pos">{teacher.position}</p>
                  {teacher.experience && (
                    <span className="teacher-exp"><Clock size={12} />{teacher.experience}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: '2.5rem' }}>
              <Link to="/teachers" className="btn btn-outline btn-lg">
                {lang === 'uz' ? "Barcha o'qituvchilar" : lang === 'ru' ? 'Все преподаватели' : 'All Teachers'} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* NEWS */}
      {news.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">{t('news')}</div>
              <h2 className="section-title">{t('newsTitle')}</h2>
            </div>
            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              {news.map(item => (
                <div key={item.id} className="card news-card">
                  <div className="news-img-wrap">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt={getTranslated(item, 'title', lang)} loading="lazy" />
                    ) : (
                      <div style={{ height: '200px', background: 'linear-gradient(135deg, #1a2d5a, #3F6CE1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Newspaper size={40} color="rgba(255,255,255,0.3)" />
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="news-meta">
                      <span>{formatDate(item.published_at || item.created_at, lang)}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>
                    <h3>{getTranslated(item, 'title', lang)}</h3>
                    <p>{getTranslated(item, 'excerpt', lang)}</p>
                    <div style={{ marginTop: '1rem' }}>
                      <Link to={`/news/${item.slug}`} className="btn btn-sm btn-outline">
                        {t('readMore')} <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: '2.5rem' }}>
              <Link to="/news" className="btn btn-outline btn-lg">
                {t('allNews')} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATE CHECK SECTION */}
      <section className="cert-section">
        <div className="container">
          <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,221,0,0.15)', border: '1px solid rgba(255,221,0,0.3)', color: '#FFDD00', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              <Award size={14} />
              {t('certificates')}
            </div>
            <h2 className="section-title" style={{ color: 'white', marginBottom: '1rem' }}>
              {t('certCheck')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2.5rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              {t('certDesc')}
            </p>
            <form onSubmit={handleCertCheck}>
              <div className="cert-input-wrap">
                <input type="text" className="cert-input" placeholder={t('certIdPlaceholder')}
                  value={certId} onChange={e => setCertId(e.target.value)}
                  aria-label="Certificate ID" />
                <button type="submit" className="cert-btn">
                  <Search size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  {t('checkBtn')}
                </button>
              </div>
            </form>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1rem' }}>
              {lang === 'uz' ? "Masalan: STF-2026-000001" : lang === 'ru' ? "Например: STF-2026-000001" : "Example: STF-2026-000001"}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
