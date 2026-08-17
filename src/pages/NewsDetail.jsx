import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { getTranslated, formatDate } from '../utils/helpers'
import api from '../utils/api'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export default function NewsDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/news/slug/${slug}`).then(res => setItem(res.data.data)).catch(console.error).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="loader" style={{ minHeight: '100vh', paddingTop: '80px' }}><div className="spinner" /></div>
  if (!item) return <div style={{ paddingTop: '120px', textAlign: 'center' }}><h2>News not found</h2><Link to="/news" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to News</Link></div>

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, #1a2d5a 100%)', padding: '5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link to="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> {t('allNews')}
          </Link>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '1rem' }}>
            {getTranslated(item, 'title', lang)}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} />{formatDate(item.published_at || item.created_at, lang)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} />{item.author}</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {item.cover_image && (
            <img src={item.cover_image} alt={getTranslated(item, 'title', lang)} style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: '2.5rem', maxHeight: '450px', objectFit: 'cover' }} />
          )}
          <div style={{ color: 'var(--gray-800)', lineHeight: 1.9, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
            {getTranslated(item, 'content', lang) || getTranslated(item, 'excerpt', lang)}
          </div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-200)' }}>
            <Link to="/news" className="btn btn-outline">
              <ArrowLeft size={16} /> {t('allNews')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
