import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainApp } from './pages/MainApp'
import { FloatingBallPage } from './pages/FloatingBallPage'
import { PanelPage } from './pages/PanelPage'
import { AppPreferencesProvider } from './AppPreferencesProvider'

function App(): React.JSX.Element {
  return (
    <AppPreferencesProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/floating" element={<FloatingBallPage />} />
          <Route path="/panel" element={<PanelPage />} />
        </Routes>
      </HashRouter>
    </AppPreferencesProvider>
  )
}

export default App
