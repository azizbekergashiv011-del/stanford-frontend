import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { getTranslated, formatDate } from '../utils/helpers'
import api from '../utils/api'
import { Newspaper, ChevronRight, Calendar, User } from 'lucide-react'

export default function News() {
  const { t, lang } = useLang()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/news').then(res => setNews(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('newsTitle')}</h1>
          <p>{lang === 'uz' ? "Stanford Training Centerning so'ngi yangiliklari" : lang === 'ru' ? "Последние новости Stanford Training Center" : "Latest news from Stanford Training Center"}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : news.length === 0 ? (
            <div className="empty-state"><Newspaper size={48} /><h3>{t('noData')}</h3></div>
          ) : (
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} />{formatDate(item.published_at || item.created_at, lang)}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={12} />{item.author}</span>
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
          )}
        </div>
      </section>
    </div>
  )
}
