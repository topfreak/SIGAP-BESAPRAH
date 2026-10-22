import React, { createContext, useContext, useState, useEffect } from 'react'

const NavigationContext = createContext(null)

const SESSION_STORAGE_KEY = 'sigap_navigation_state'

// Default route state awal jika sessionStorage kosong
const DEFAULT_ROUTE_STATE = {
  activePage: 'dashboard',
  pageParams: {},
}

export function NavigationProvider({ children }) {
  // 1. Inisialisasi state langsung dari sessionStorage (Session-Persistent)
  const [routeState, setRouteState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed.activePage === 'string') {
          return {
            activePage: parsed.activePage,
            pageParams: parsed.pageParams || {},
          }
        }
      }
    } catch (err) {
      console.warn('Gagal membaca navigation state dari sessionStorage:', err)
    }
    return DEFAULT_ROUTE_STATE
  })

  // 2. Sinkronkan ke sessionStorage setiap kali routeState berubah
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(routeState))
    } catch (err) {
      console.warn('Gagal menyimpan navigation state ke sessionStorage:', err)
    }

    // Pastikan URL browser tetap statis dan bersih (domain.com tanpa hash atau path)
    if (window.location.hash || window.location.search) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [routeState])

  // Fungsi navigasi utama
  const navigateTo = (pageName, params = {}) => {
    setRouteState({
      activePage: pageName,
      pageParams: params,
    })
    // Jaga kebersihan URL browser
    window.history.replaceState(null, '', window.location.pathname)
  }

  // Fungsi kembali ke halaman sebelumnya dengan fallback aman
  const goBack = (fallbackPage = 'dashboard') => {
    setRouteState((prev) => ({
      activePage: fallbackPage,
      pageParams: {},
    }))
    window.history.replaceState(null, '', window.location.pathname)
  }

  // Fungsi reset saat logout (membersihkan session storage secara total)
  const resetNavigation = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setRouteState(DEFAULT_ROUTE_STATE)
  }

  const value = {
    activePage: routeState.activePage,
    pageParams: routeState.pageParams,
    navigateTo,
    goBack,
    resetNavigation,
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation harus digunakan di dalam NavigationProvider')
  }
  return context
}
