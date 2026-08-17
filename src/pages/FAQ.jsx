import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { getTranslated } from '../utils/helpers'
import api from '../utils/api'
import { HelpCircle, ChevronDown } from 'lucide-react'

export default function FAQ() {
  const { t, lang } = useLang()
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    api.get('/faq').then(res => setFaqs(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  const toggle = (id) => setOpen(prev => prev === id ? null : id)

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('faqTitle')}</h1>
          <p>{lang === 'uz' ? "Ko'p so'raladigan savollarga javoblar" : lang === 'ru' ? "Ответы на часто задаваемые вопросы" : "Answers to frequently asked questions"}</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : faqs.length === 0 ? (
            <div className="empty-state"><HelpCircle size={48} /><h3>{t('noData')}</h3></div>
          ) : (
            <div>
              {faqs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <button className={`faq-question ${open === faq.id ? 'open' : ''}`} onClick={() => toggle(faq.id)}
                    aria-expanded={open === faq.id}>
                    {getTranslated(faq, 'question', lang)}
                    <ChevronDown size={18} className={`faq-icon ${open === faq.id ? 'open' : ''}`} />
                  </button>
                  <div className={`faq-answer ${open === faq.id ? 'open' : ''}`}>
                    <p>{getTranslated(faq, 'answer', lang)}</p>
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
