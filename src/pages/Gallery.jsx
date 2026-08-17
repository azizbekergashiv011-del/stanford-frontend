import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import api from '../utils/api'
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Gallery() {
  const { t, lang } = useLang()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [category, setCategory] = useState('')

  useEffect(() => {
    api.get('/gallery').then(res => setItems(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))]
  const filtered = category ? items.filter(i => i.category === category) : items

  const openLightbox = (idx) => setLightbox(idx)
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox(l => l > 0 ? l - 1 : filtered.length - 1)
  const next = () => setLightbox(l => l < filtered.length - 1 ? l + 1 : 0)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [filtered.length])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-hero">
        <div className="container">
          <h1>{t('galleryTitle')}</h1>
          <p>{lang === 'uz' ? "Stanford Training Center foto galereya" : lang === 'ru' ? "Фотогалерея Stanford Training Center" : "Stanford Training Center photo gallery"}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {categories.length > 0 && (
            <div className="filter-bar" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
              <button className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategory('')}>{t('all')}</button>
              {categories.map(c => (
                <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          )}
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><Image size={48} /><h3>{t('noData')}</h3></div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((item, idx) => (
                <div key={item.id} className="gallery-item" onClick={() => openLightbox(idx)} role="button" tabIndex={0} aria-label={item.title || 'Gallery image'}
                  onKeyDown={e => e.key === 'Enter' && openLightbox(idx)}>
                  <img src={item.image} alt={item.title || 'Gallery'} loading="lazy" />
                  <div className="gallery-overlay">
                    <Image size={28} color="white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><X size={20} /></button>
          <button onClick={e => { e.stopPropagation(); prev() }} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Previous">
            <ChevronLeft size={22} />
          </button>
          <img src={filtered[lightbox]?.image} alt={filtered[lightbox]?.title || ''} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); next() }} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Next">
            <ChevronRight size={22} />
          </button>
          {filtered[lightbox]?.title && (
            <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.9rem' }}>
              {filtered[lightbox].title}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
