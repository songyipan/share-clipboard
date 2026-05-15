import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainApp } from './pages/MainApp'
import { FloatingBallPage } from './pages/FloatingBallPage'
import { PanelPage } from './pages/PanelPage'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/floating" element={<FloatingBallPage />} />
        <Route path="/panel" element={<PanelPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
