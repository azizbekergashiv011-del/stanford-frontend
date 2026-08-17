import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PublicLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
