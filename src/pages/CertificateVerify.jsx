import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { formatDate } from '../utils/helpers'
import api from '../utils/api'
import { CheckCircle2, XCircle, AlertTriangle, Download, ArrowLeft, Award, User, BookOpen, Calendar, Hash } from 'lucide-react'

export default function CertificateVerify() {
  const { certificateId } = useParams()
  const { t, lang } = useLang()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (certificateId) {
      setLoading(true)
      api.get(`/certificates/verify/${certificateId}`)
        .then(res => setResult(res.data))
        .catch(err => setResult({ valid: false, found: false, message: err.response?.data?.message || 'Error' }))
        .finally(() => setLoading(false))
    }
  }, [certificateId])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/certificates/download/${certificateId}`)
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate_${certificateId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('PDF yuklab olishda xatolik. Iltimos qayta urinib ko\'ring.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      {/* Meta for no-index */}
      <div style={{ display: 'none' }}>
        <meta name="robots" content="noindex, nofollow" />
      </div>

      <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--gray-50)' }}>
        {/* Page Hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, #1a2d5a 100%)', padding: '4rem 0 3rem' }}>
          <div className="container">
            <div className="text-center">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,221,0,0.15)', border: '1px solid rgba(255,221,0,0.3)', color: '#FFDD00', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                <Award size={14} />
                {t('certificates')}
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
                {t('certTitle')}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                {lang === 'uz' ? 'Sertifikat holati tekshirilmoqda...' : lang === 'ru' ? 'Проверка статуса сертификата...' : 'Checking certificate status...'}
              </p>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '3rem 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/certificates" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', transition: 'color 0.2s' }}>
              <ArrowLeft size={16} />
              {lang === 'uz' ? "Orqaga qaytish" : lang === 'ru' ? 'Назад' : 'Go back'}
            </Link>
          </div>

          <div className="verify-card">
            {loading ? (
              <div className="loader" style={{ minHeight: '300px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--gray-500)' }}>{t('loading')}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Status card */}
                {result?.valid && (
                  <div className="verify-status valid">
                    <span className="verify-icon">✅</span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>
                      {t('certValid')}
                    </h2>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                      {lang === 'uz' ? "Bu sertifikat Stanford Training Center ma'lumotlar bazasida tasdiqlangan." : lang === 'ru' ? 'Этот сертификат подтверждён в базе данных Stanford Training Center.' : 'This certificate is verified in the Stanford Training Center database.'}
                    </p>
                  </div>
                )}

                {result?.found && !result.valid && result?.status === 'REVOKED' && (
                  <div className="verify-status revoked">
                    <span className="verify-icon">⚠️</span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '0.5rem' }}>
                      {t('certRevoked')}
                    </h2>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>{t('certRevokedDesc')}</p>
                  </div>
                )}

                {!result?.found && (
                  <div className="verify-status notfound">
                    <span className="verify-icon">❌</span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)', marginBottom: '0.5rem' }}>
                      {t('certNotFound')}
                    </h2>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>{t('certNotFoundDesc')}</p>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      ID: <strong style={{ color: 'var(--gray-700)' }}>{certificateId}</strong>
                    </p>
                  </div>
                )}

                {/* Certificate details */}
                {result?.found && (
                  <div className="verify-info" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '1rem', fontSize: '1rem' }}>
                      {lang === 'uz' ? "Sertifikat ma'lumotlari" : lang === 'ru' ? 'Данные сертификата' : 'Certificate Details'}
                    </h3>

                    {[
                      { icon: <Hash size={16} />, label: t('certId'), value: result.certificateId },
                      { icon: <User size={16} />, label: t('studentName'), value: result.studentName },
                      { icon: <BookOpen size={16} />, label: t('courseName'), value: result.course },
                      { icon: <Calendar size={16} />, label: t('issueDate'), value: formatDate(result.issueDate, lang) },
                      {
                        icon: <CheckCircle2 size={16} />, label: t('status'), value: (
                          <span className={`badge ${result.status === 'VALID' ? 'badge-success' : 'badge-danger'}`}>
                            {result.status === 'VALID' ? t('status_valid') : t('status_revoked')}
                          </span>
                        )
                      },
                    ].map((row, i) => (
                      <div key={i} className="verify-row">
                        <span className="verify-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)' }}>
                          {row.icon} {row.label}
                        </span>
                        <span className="verify-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Download button - only for VALID */}
                {result?.valid && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <button onClick={handleDownload} disabled={downloading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                      {downloading ? (
                        <><div className="spinner spinner-sm" /> {lang === 'uz' ? 'Yuklanmoqda...' : lang === 'ru' ? 'Загрузка...' : 'Downloading...'}</>
                      ) : (
                        <><Download size={20} /> {t('downloadPdf')}</>
                      )}
                    </button>
                  </div>
                )}

                {/* Info box */}
                <div style={{ marginTop: '1.5rem', background: 'rgba(63,108,225,0.05)', border: '1px solid rgba(63,108,225,0.15)', borderRadius: 'var(--radius-sm)', padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                  <strong style={{ color: 'var(--primary)' }}>Stanford Training Center</strong>
                  {' '}{lang === 'uz' ? "tomonidan berilgan sertifikatlar ushbu tizim orqali tekshirilishi mumkin." : lang === 'ru' ? "— сертификаты, выданные центром, можно проверить через эту систему." : "— certificates issued by the center can be verified through this system."}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
