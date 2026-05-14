import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainApp } from './pages/MainApp'
import { FloatingBall } from './components/FloatingBall'
import './components/FloatingBall.css'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/floating" element={<FloatingBallPage />} />
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

export default App
