import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppPreferencesProvider } from './AppPreferencesProvider'

const MainApp = lazy(async () => {
  const m = await import('./pages/MainApp')
  return { default: m.MainApp }
})

const FloatingBallPage = lazy(async () => {
  const m = await import('./pages/FloatingBallPage')
  return { default: m.FloatingBallPage }
})

const PanelPage = lazy(async () => {
  const m = await import('./pages/PanelPage')
  return { default: m.PanelPage }
})

function App(): React.JSX.Element {
  return (
    <AppPreferencesProvider>
      <HashRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/floating" element={<FloatingBallPage />} />
            <Route path="/panel" element={<PanelPage />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AppPreferencesProvider>
  )
}

export default App
