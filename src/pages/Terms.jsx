import { useLang } from '../context/LangContext'
export default function Terms() {
  const { t } = useLang()
  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero"><div className="container"><h1>{t('terms')}</h1></div></div>
      <section className="section"><div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Stanford Training Center saytidan foydalanish quyidagi shartlarni qabul qilishni anglatadi.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Foydalanish</h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Sayt faqat ma'lumot olish va sertifikatlarni tekshirish maqsadida foydalanish uchun mo'ljallangan.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Sertifikatlar</h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Sertifikatlar faqat Stanford Training Center tomonidan berilgan o'quvchilarga tegishli. Sertifikatni noqonuniy tarzda foydalanish taqiqlanadi.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Aloqa</h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Savol va takliflar uchun: <a href="mailto:info@stanford.uz" style={{ color: 'var(--primary)' }}>info@stanford.uz</a></p>
      </div></section>
    </div>
  )
}
