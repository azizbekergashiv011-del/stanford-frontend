import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/index'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('stanford_lang') || 'uz')

  const t = (key) => translations[lang]?.[key] || translations['uz']?.[key] || key

  const changeLang = (code) => {
    setLang(code)
    localStorage.setItem('stanford_lang', code)
    document.documentElement.lang = code
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
