export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return path
}

export const formatDate = (dateStr, lang = 'uz') => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const locales = { uz: 'uz-UZ', en: 'en-US', ru: 'ru-RU' }
  try {
    return date.toLocaleDateString(locales[lang] || 'uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  } catch {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getTranslated = (item, field, lang) => {
  if (!item) return ''
  return item[`${field}_${lang}`] || item[`${field}_uz`] || item[`${field}_en`] || ''
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}
