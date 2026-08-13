import { HashRouter, Routes, Route } from 'react-router-dom'
import { PrefsProvider } from './i18n/context'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Elevator } from './pages/Elevator'
import { Grid } from './pages/Grid'
import { Triage } from './pages/Triage'
import { Score } from './pages/Score'
import { Scenarios } from './pages/Scenarios'
import { Glossary } from './pages/Glossary'
import { Quiz } from './pages/Quiz'
import { Library } from './pages/Library'

export default function App() {
  return (
    <PrefsProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="elevator" element={<Elevator />} />
            <Route path="grid" element={<Grid />} />
            <Route path="triage" element={<Triage />} />
            <Route path="score" element={<Score />} />
            <Route path="scenarios" element={<Scenarios />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="library" element={<Library />} />
          </Route>
        </Routes>
      </HashRouter>
    </PrefsProvider>
  )
}
