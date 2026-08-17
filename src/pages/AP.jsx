import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { ArrowRight, Info } from 'lucide-react'

export default function AP() {
  const { lang } = useLang()

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{ background: 'rgba(255,221,0,0.15)', color: '#FFDD00' }}>AP Program</div>
          <h1>AP (Advanced Placement)</h1>
          <p>{lang === 'uz' ? "Rivojlangan tayyorlov dasturi" : lang === 'ru' ? "Расширенная программа подготовки" : "Advanced Placement Program"}</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ background: 'rgba(63,108,225,0.05)', border: '1.5px solid rgba(63,108,225,0.2)', borderRadius: 'var(--radius)', padding: '2.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Info size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                  {lang === 'uz' ? "AP dasturi haqida" : lang === 'ru' ? 'О программе AP' : 'About AP Program'}
                </h3>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  {lang === 'uz'
                    ? "AP (Advanced Placement) — College Board tomonidan boshqariladigan xalqaro ta'lim dasturi. Stanford Training Center AP imtihoniga tayyorgarlik kurslarini taqdim etadi."
                    : lang === 'ru'
                    ? "AP (Advanced Placement) — международная образовательная программа, управляемая College Board. Stanford Training Center предлагает курсы подготовки к экзаменам AP."
                    : "AP (Advanced Placement) is an international education program managed by College Board. Stanford Training Center offers AP exam preparation courses."}
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '2.5rem' }}>
            <p style={{ color: '#92400e', fontSize: '0.9rem', lineHeight: 1.7 }}>
              ⚠️ {lang === 'uz' ? "Eslatma: Stanford Training Center rasmiy AP dasturining akkreditatsiyalangan muassasasi sifatida ko'rsatilmaydi. Rasmiy AP ma'lumotlari uchun collegeboard.org ga murojaat qiling." : lang === 'ru' ? "Примечание: Stanford Training Center не указывается как аккредитованное учреждение официальной программы AP. Для получения официальной информации об AP посетите collegeboard.org." : "Note: Stanford Training Center is not indicated as an accredited institution of the official AP program. For official AP information, visit collegeboard.org."}
            </p>
          </div>

          <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            {lang === 'uz' ? "Taklif etilgan AP kurslar" : lang === 'ru' ? 'Предлагаемые курсы AP' : 'Offered AP Courses'}
          </h2>
          <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '2.5rem' }}>
            {['AP Calculus AB/BC', 'AP Statistics', 'AP English Language', 'AP English Literature', 'AP Physics', 'AP Chemistry', 'AP Biology', 'AP History'].map((c, i) => (
              <div key={i} style={{ padding: '1rem 1.25rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{c}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/contact" className="btn btn-primary btn-lg">
              {lang === 'uz' ? "Batafsil ma'lumot olish" : lang === 'ru' ? 'Получить подробную информацию' : 'Get more information'} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
