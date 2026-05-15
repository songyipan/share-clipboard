import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainApp } from './pages/MainApp'
import { FloatingBall } from './components/FloatingBall'
import { Panel } from './components/Panel'

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

function FloatingBallPage(): React.JSX.Element {
  return (
    <div style={{ background: 'transparent', height: '100vh' }}>
      <FloatingBall />
    </div>
  )
}

function PanelPage(): React.JSX.Element {
  return (
    <div style={{ background: 'transparent', height: '100vh', padding: '8px' }}>
      <Panel />
    </div>
  )
}

export default App
