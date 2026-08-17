import { useLang } from '../context/LangContext'
export default function PrivacyPolicy() {
  const { t } = useLang()
  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero"><div className="container"><h1>{t('privacyPolicy')}</h1></div></div>
      <section className="section"><div className="container" style={{ maxWidth: '800px' }}>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Stanford Training Center foydalanuvchilar ma'lumotlarini himoya qilishga alohida e'tibor beradi. Ushbu maxfiylik siyosati saytimizdan foydalanish shartlarini belgilab beradi.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Ma'lumotlar to'plash</h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Biz faqat bog'lanish formasidan kelib tushgan ma'lumotlarni saqlaymiz: ism, telefon, email va xabar mazmuni.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Ma'lumotlardan foydalanish</h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Yig'ilgan ma'lumotlar faqat sizga yordam berish va xizmat ko'rsatish maqsadida ishlatiladi. Uchinchi taraflarga berilmaydi.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Aloqa</h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.9 }}>Savol va takliflar uchun: <a href="mailto:info@stanford.uz" style={{ color: 'var(--primary)' }}>info@stanford.uz</a></p>
      </div></section>
    </div>
  )
}
