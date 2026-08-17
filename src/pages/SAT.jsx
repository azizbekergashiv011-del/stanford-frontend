import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { ArrowRight, CheckCircle, BookOpen, Target, Clock } from 'lucide-react'

export default function SAT() {
  const { lang } = useLang()
  const features = [
    { icon: <BookOpen size={22} />, title: lang === 'uz' ? "Math bo'limi" : lang === 'ru' ? 'Раздел Math' : 'Math Section', desc: lang === 'uz' ? "Algebra, geometriya va ma'lumotlar tahlili" : lang === 'ru' ? 'Алгебра, геометрия и анализ данных' : 'Algebra, geometry and data analysis' },
    { icon: <Target size={22} />, title: lang === 'uz' ? "Evidence-Based Reading" : lang === 'ru' ? 'Evidence-Based Reading' : 'Evidence-Based Reading', desc: lang === 'uz' ? "O'qish tushunish va tahlil qilish" : lang === 'ru' ? 'Понимание и анализ прочитанного' : 'Reading comprehension and analysis' },
    { icon: <Clock size={22} />, title: lang === 'uz' ? "Writing & Language" : lang === 'ru' ? 'Writing & Language' : 'Writing & Language', desc: lang === 'uz' ? "Grammatika va yozuv ko'nikmalari" : lang === 'ru' ? 'Грамматика и письменные навыки' : 'Grammar and writing skills' },
  ]

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{ background: 'rgba(255,221,0,0.15)', color: '#FFDD00' }}>SAT</div>
          <h1>SAT {lang === 'uz' ? "Tayyorlov Kursi" : lang === 'ru' ? 'Подготовительный курс' : 'Preparation Course'}</h1>
          <p>{lang === 'uz' ? "SAT imtihoniga professional tayyorgarlik" : lang === 'ru' ? "Профессиональная подготовка к экзамену SAT" : "Professional preparation for SAT exam"}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <div className="section-tag">SAT Program</div>
              <h2 className="section-title">SAT <span>{lang === 'uz' ? "imtihoniga tayyorlanish" : lang === 'ru' ? "подготовка к экзамену" : "exam preparation"}</span></h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                {lang === 'uz'
                  ? "Stanford Training Center SAT imtihoniga tayyorgarlik kursini taqdim etadi. Bizning tajribali o'qituvchilarimiz sizga Math va Evidence-Based Reading & Writing bo'limlarida yuqori ball to'plashga yordam beradi."
                  : lang === 'ru'
                  ? "Stanford Training Center предлагает курс подготовки к экзамену SAT. Наши опытные преподаватели помогут вам набрать высокие баллы по разделам Math и Evidence-Based Reading & Writing."
                  : "Stanford Training Center offers SAT exam preparation course. Our experienced teachers will help you score high in the Math and Evidence-Based Reading & Writing sections."}
              </p>
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#92400e', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  ⚠️ {lang === 'uz' ? "Eslatma: Stanford Training Center rasmiy SAT imtihon markazi emas." : lang === 'ru' ? "Примечание: Stanford Training Center не является официальным экзаменационным центром SAT." : "Note: Stanford Training Center is not an official SAT test center."}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/contact" className="btn btn-primary">{lang === 'uz' ? "Yozilish" : lang === 'ru' ? 'Записаться' : 'Enroll'} <ArrowRight size={16} /></Link>
                <Link to="/courses" className="btn btn-outline">{lang === 'uz' ? "Barcha kurslar" : lang === 'ru' ? 'Все курсы' : 'All Courses'}</Link>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', background: 'white' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(63,108,225,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What we offer */}
          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '3rem' }}>
            <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
              {lang === 'uz' ? "Nima olasiz?" : lang === 'ru' ? 'Что вы получите?' : 'What you will get?'}
            </h2>
            <div className="grid grid-3" style={{ gap: '1.25rem' }}>
              {[
                lang === 'uz' ? "Haftasiga 3 marta dars" : lang === 'ru' ? '3 занятия в неделю' : '3 classes per week',
                lang === 'uz' ? "Mock test imtihonlari" : lang === 'ru' ? 'Пробные тесты' : 'Mock test exams',
                lang === 'uz' ? "Individual homework" : lang === 'ru' ? 'Индивидуальные домашние задания' : 'Individual homework',
                lang === 'uz' ? "Kurs materiallari" : lang === 'ru' ? 'Учебные материалы' : 'Study materials',
                lang === 'uz' ? "Onlayn resurslar" : lang === 'ru' ? 'Онлайн ресурсы' : 'Online resources',
                lang === 'uz' ? "Kurs sertifikati" : lang === 'ru' ? 'Сертификат курса' : 'Course certificate',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}>
                  <CheckCircle size={18} color="var(--success)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gray-800)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
