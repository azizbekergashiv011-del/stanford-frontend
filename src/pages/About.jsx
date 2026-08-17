import { useLang } from '../context/LangContext'
import { Link } from 'react-router-dom'
import { Target, Eye, Heart, ArrowRight, Users, GraduationCap, Award, TrendingUp } from 'lucide-react'

export default function About() {
  const { t, lang } = useLang()

  const values = [
    { icon: <Target size={24} />, title: lang === 'uz' ? "Sifat" : lang === 'ru' ? 'Качество' : 'Quality', desc: lang === 'uz' ? "Har bir kursda eng yuqori ta'lim sifati" : lang === 'ru' ? 'Высочайшее качество образования в каждом курсе' : 'Highest education quality in every course' },
    { icon: <Users size={24} />, title: lang === 'uz' ? "Hamkorlik" : lang === 'ru' ? 'Сотрудничество' : 'Collaboration', desc: lang === 'uz' ? "O'qituvchi va o'quvchi bir jamoa" : lang === 'ru' ? 'Преподаватель и студент — одна команда' : 'Teacher and student as one team' },
    { icon: <TrendingUp size={24} />, title: lang === 'uz' ? "Rivojlanish" : lang === 'ru' ? 'Развитие' : 'Growth', desc: lang === 'uz' ? "Doimiy o'sish va yangilanish" : lang === 'ru' ? 'Постоянный рост и обновление' : 'Continuous growth and innovation' },
    { icon: <Heart size={24} />, title: lang === 'uz' ? "E'tibor" : lang === 'ru' ? 'Забота' : 'Care', desc: lang === 'uz' ? "Har bir o'quvchiga individual e'tibor" : lang === 'ru' ? 'Индивидуальное внимание каждому студенту' : 'Individual attention to every student' },
  ]

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('aboutTitle')}</h1>
          <p>{t('aboutDesc')}</p>
        </div>
      </div>

      {/* Main about */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-tag">{t('history')}</div>
              <h2 className="section-title">Stanford Training Center <span>tarixi</span></h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                {lang === 'uz'
                  ? "Stanford Training Center 2020-yilda Namangan viloyatida tashkil etildi. Ta'lim markazimiz qisqa vaqt ichida mintaqaning eng mashhur ta'lim markazlaridan biriga aylandi."
                  : lang === 'ru'
                  ? "Stanford Training Center был основан в 2020 году в Наманганской области. Наш учебный центр быстро стал одним из самых популярных в регионе."
                  : "Stanford Training Center was founded in 2020 in Namangan region. Our training center quickly became one of the most popular educational centers in the region."}
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.9, marginBottom: '2rem' }}>
                {lang === 'uz'
                  ? "Bugun bizda 500 dan ortiq o'quvchi tahsil olmoqda. IELTS, SAT va ingliz tili kurslarimiz yuqori natijalar bilan tan olingan."
                  : lang === 'ru'
                  ? "Сегодня у нас обучается более 500 студентов. Наши курсы IELTS, SAT и английского языка признаны высокими результатами."
                  : "Today more than 500 students are studying with us. Our IELTS, SAT and English language courses are recognized for high results."}
              </p>
              <Link to="/contact" className="btn btn-primary">{t('connect')} <ArrowRight size={16} /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { num: '2020', label: lang === 'uz' ? "Tashkil etilgan yil" : lang === 'ru' ? 'Год основания' : 'Founded', icon: <Award size={28} /> },
                { num: '500+', label: lang === 'uz' ? "O'quvchilar" : lang === 'ru' ? 'Студентов' : 'Students', icon: <GraduationCap size={28} /> },
                { num: '20+', label: lang === 'uz' ? "O'qituvchilar" : lang === 'ru' ? 'Преподавателей' : 'Teachers', icon: <Users size={28} /> },
                { num: '95%', label: lang === 'uz' ? "Muvaffaqiyat" : lang === 'ru' ? 'Успех' : 'Success', icon: <TrendingUp size={28} /> },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{item.num}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-light">
        <div className="container">
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {[
              { icon: <Target size={32} />, title: t('mission'), desc: lang === 'uz' ? "Namangan viloyati o'quvchilarining dunyoga chiqishiga yordam berish, sifatli ta'lim orqali ularning kelajagini qurish." : lang === 'ru' ? "Помочь студентам Наманганской области выйти в мир, строя их будущее через качественное образование." : "Help Namangan region students reach the world, building their future through quality education." },
              { icon: <Eye size={32} />, title: t('vision'), desc: lang === 'uz' ? "O'rta Osiyoning eng yaxshi ta'lim markazi bo'lish va xalqaro standartlarda ta'lim berish." : lang === 'ru' ? "Стать лучшим учебным центром Центральной Азии и предоставлять образование по международным стандартам." : "Become the best training center in Central Asia and provide education to international standards." },
              { icon: <Heart size={32} />, title: t('values'), desc: lang === 'uz' ? "Sifat, halollik, rivojlanish va har bir o'quvchiga chegirmacham munosabat biz uchun asosiy qadriyatlardir." : lang === 'ru' ? "Качество, честность, развитие и уважительное отношение к каждому студенту — наши основные ценности." : "Quality, honesty, growth and respectful attitude to every student are our core values." },
            ].map((item, i) => (
              <div key={i} className="card card-body" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ width: '72px', height: '72px', background: 'rgba(63,108,225,0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '1rem', fontSize: '1.2rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('values')}</h2>
          </div>
          <div className="grid grid-4" style={{ gap: '1.5rem' }}>
            {values.map((item, i) => (
              <div key={i} style={{ padding: '2rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', textAlign: 'center', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(63,108,225,0.08)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
