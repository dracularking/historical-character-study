import { useEffect } from 'react'
import { Routes, Route, useLocation, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import PersonPage from './pages/PersonPage'

/** 切换人物或通过 #锚点/?tab= 深链进入时重挂载，保证初始 tab 正确 */
function PersonRoute() {
  const { slug } = useParams()
  const location = useLocation()
  return <PersonPage key={`${slug}${location.hash}${location.search}`} />
}
import ComparePage from './pages/ComparePage'
import TraitsPage from './pages/TraitsPage'
import TraitDetailPage from './pages/TraitDetailPage'
import SimulatorPage from './pages/SimulatorPage'
import SimulatorRunPage from './pages/SimulatorRunPage'
import TrainingPage from './pages/TrainingPage'
import TrainingDetailPage from './pages/TrainingDetailPage'
import ArchivePage from './pages/ArchivePage'
import SourcesPage from './pages/SourcesPage'
import AboutPage from './pages/AboutPage'
import FailureTopicPage from './pages/FailureTopicPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/person/:slug" element={<PersonRoute />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/traits" element={<TraitsPage />} />
        <Route path="/traits/:slug" element={<TraitDetailPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/simulator/:slug" element={<SimulatorRunPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/training/:slug" element={<TrainingDetailPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/topics/failure" element={<FailureTopicPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  )
}
