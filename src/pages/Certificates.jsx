import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { Search, Award, QrCode, Shield, CheckCircle } from 'lucide-react'

export default function Certificates() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [certId, setCertId] = useState('')

  const handleCheck = (e) => {
    e.preventDefault()
    if (certId.trim()) navigate(`/verify/${certId.trim()}`)
  }

  const steps = [
    { icon: <Award size={28} />, num: '01', title: lang === 'uz' ? "Sertifikat olish" : lang === 'ru' ? 'Получение сертификата' : 'Receive Certificate', desc: lang === 'uz' ? "Kursni muvaffaqiyatli tugatgandan so'ng sertifikat beriladi." : lang === 'ru' ? 'После успешного завершения курса выдаётся сертификат.' : 'Certificate is issued after successfully completing the course.' },
    { icon: <QrCode size={28} />, num: '02', title: lang === 'uz' ? "QR kodni skaner qilish" : lang === 'ru' ? 'Сканирование QR-кода' : 'Scan QR Code', desc: lang === 'uz' ? "Sertifikatdagi QR kodni telefon orqali skaner qiling." : lang === 'ru' ? 'Отсканируйте QR-код на сертификате с помощью телефона.' : 'Scan the QR code on the certificate with your phone.' },
    { icon: <Shield size={28} />, num: '03', title: lang === 'uz' ? "Tekshirish" : lang === 'ru' ? 'Проверка' : 'Verification', desc: lang === 'uz' ? "Tizim sertifikatni ma'lumotlar bazasida tekshiradi." : lang === 'ru' ? 'Система проверяет сертификат в базе данных.' : 'The system checks the certificate in the database.' },
    { icon: <CheckCircle size={28} />, num: '04', title: lang === 'uz' ? "Natija" : lang === 'ru' ? 'Результат' : 'Result', desc: lang === 'uz' ? "VALID yoki REVOKED holat ko'rsatiladi va PDF yuklab olinadi." : lang === 'ru' ? 'Отображается статус VALID или REVOKED и загружается PDF.' : 'VALID or REVOKED status is shown and PDF is downloaded.' },
  ]

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{ background: 'rgba(255,221,0,0.15)', color: '#FFDD00' }}>
            <Award size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.3rem' }} />
            {t('certificates')}
          </div>
          <h1>{t('certTitle')}</h1>
          <p>{t('certDesc')}</p>
        </div>
      </div>

      {/* Check Section */}
      <section className="cert-section" style={{ padding: '4rem 0' }}>
        <div className="container">
          <form onSubmit={handleCheck} style={{ position: 'relative', zIndex: 2 }}>
            <div className="cert-input-wrap" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <input type="text" className="cert-input" placeholder={t('certIdPlaceholder')}
                value={certId} onChange={e => setCertId(e.target.value)} aria-label="Certificate ID" />
              <button type="submit" className="cert-btn">
                <Search size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                {t('checkBtn')}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{lang === 'uz' ? "Qanday ishlaydi?" : lang === 'ru' ? 'Как это работает?' : 'How it works?'}</div>
            <h2 className="section-title">
              {lang === 'uz' ? "Sertifikat tekshirish jarayoni" : lang === 'ru' ? 'Процесс проверки сертификата' : 'Certificate Verification Process'}
            </h2>
          </div>
          <div className="grid grid-4" style={{ gap: '1.5rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)', position: 'relative', background: 'white' }}>
                <div style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{step.num}</div>
                <div style={{ width: '64px', height: '64px', background: 'rgba(63,108,225,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem auto 1.25rem', color: 'var(--primary)' }}>
                  {step.icon}
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.5rem', fontSize: '1rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="section bg-light">
        <div className="container">
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: 'var(--radius)', padding: '2.5rem', border: '1.5px solid var(--gray-200)', textAlign: 'center' }}>
            <Shield size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '1rem', fontSize: '1.5rem' }}>
              {lang === 'uz' ? "Sertifikat xavfsizligi" : lang === 'ru' ? 'Безопасность сертификата' : 'Certificate Security'}
            </h2>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
              {lang === 'uz'
                ? "Har bir sertifikat noyob ID va QR kod bilan himoyalangan. Sertifikatning haqiqiyligini istalgan vaqt tekshirish mumkin. VALID holat — haqiqiy, REVOKED holat — bekor qilingan."
                : lang === 'ru'
                ? "Каждый сертификат защищён уникальным ID и QR-кодом. Подлинность сертификата можно проверить в любое время. Статус VALID — действительный, REVOKED — отозванный."
                : "Each certificate is protected with a unique ID and QR code. Certificate authenticity can be verified at any time. VALID status — genuine, REVOKED — revoked."}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
