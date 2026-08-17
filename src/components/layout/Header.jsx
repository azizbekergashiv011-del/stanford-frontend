import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { languages } from '../../i18n/index'
import { Menu, X, GraduationCap } from 'lucide-react'

export default function Header() {
  const { t, lang, changeLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navItems = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/courses', label: t('courses') },
    { to: '/teachers', label: t('teachers') },
    { to: '/news', label: t('news') },
    { to: '/certificates', label: t('verifyCert') },
    { to: '/faq', label: t('faq') },
    { to: '/contact', label: t('contact') },
  ]

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <Link to="/" className="logo">
              <div className="logo-icon"><GraduationCap size={22} /></div>
              <div className="logo-text">
                <div className="logo-name">STANFORD</div>
                <div className="logo-sub">Training Center</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="nav" aria-label="Main navigation">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="header-actions">
              <div className="lang-switcher" aria-label="Language switcher">
                {languages.map(l => (
                  <button key={l.code} className={`lang-btn ${lang === l.code ? 'active' : ''}`} onClick={() => changeLang(l.code)} aria-label={l.label}>
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <Link to="/contact" className="btn btn-primary btn-sm" style={{ display: 'none' }}>
                {t('connect')}
              </Link>
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ display: 'none' }}>
                <Menu size={22} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        <div className="mobile-nav-header">
          <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
            <div className="logo-icon"><GraduationCap size={22} /></div>
            <div className="logo-text">
              <div className="logo-name">STANFORD</div>
              <div className="logo-sub">Training Center</div>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ color: 'white', padding: '0.5rem' }}>
            <X size={24} />
          </button>
        </div>

        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {item.label}
          </NavLink>
        ))}

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          {languages.map(l => (
            <button key={l.code} className={`lang-btn ${lang === l.code ? 'active' : ''}`}
              onClick={() => { changeLang(l.code); setMobileOpen(false) }}
              style={{ fontSize: '0.9rem' }}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>

        <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setMobileOpen(false)}>
          {t('connect')}
        </Link>
      </nav>
    </>
  )
}
