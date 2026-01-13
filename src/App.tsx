import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import About from './components/About'
import Footer from './components/Footer'
import Extract from './components/Extract'
import Home from './components/Home'
import Chatbot from './components/Chatbot'
import GenerateReport from './components/GenerateReport'
import LavaChat from './components/LavaChat'
import PPTGenerator from './components/PPTGenerator'
import MedicalReports from './components/MedicalReports'
import SGPACalculator from './components/SGPACalculator'
import ExamPlanner from './components/ExamPlanner'
import { useAuth } from './context/AuthContext'
import { Loader2 } from 'lucide-react'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup' | 'about' | 'extract' | 'home' | 'generate' | 'sgpa-calculator' | 'exam-planner' | 'lava-ai' | 'ppt-generator' | 'medical-certificate' | 'medical-reports'>('signin')
  const { user, loading } = useAuth()

  // Check URL hash on mount and when it changes
  useEffect(() => {
    const updatePage = () => {
      let hash = window.location.hash.replace('#', '')
      if (hash.startsWith('/')) hash = hash.substring(1).replace('/', '')

      if (['signup', 'signin', 'about', 'extract', 'home', 'generate', 'build-from-scratch', 'sgpa-calculator', 'exam-planner', 'lava-ai', 'ppt-generator', 'medical-certificate', 'medical-reports'].includes(hash)) {
        if (hash === 'build-from-scratch') {
          // Redirect legacy link to new calculator if clicked, or just render calculator
          setCurrentPage('sgpa-calculator')
        } else {
          setCurrentPage(hash as any)
        }
      }
    }

    updatePage()
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  // Auth Guard Effect: Redirect unauthenticated users to signin
  useEffect(() => {
    if (!loading && !user) {
      if (currentPage !== 'signin' && currentPage !== 'signup') {
        setCurrentPage('signin')
        window.location.hash = 'signin'
      }
    } else if (!loading && user) {
      // Optional: Redirect to home if on signin/signup page after login? 
      // User behavior usually expects this, but let's stick to simple guard first.
      // Actually, if user is on signin page but is logged in, we should probably send them home.
      if (currentPage === 'signin' || currentPage === 'signup') {
        setCurrentPage('home')
        window.location.hash = 'home'
      }
    }
  }, [user, loading, currentPage])

  // Update URL hash when page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page as any)
    window.location.hash = page
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-cyan-500">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm font-mono tracking-widest uppercase">Initializing System...</p>
        </div>
      </div>
    )
  }

  // Unauthenticated View - strictly SignIn or SignUp, NO Navbar
  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <main className="min-h-screen bg-[#faf8f5] dark:bg-gray-950 flex flex-col">
          {/* Explicitly passing handlePageChange to allow switching between login/signup */}
          {currentPage === 'signup' ? (
            <SignUp onNavigateToSignIn={() => handlePageChange('signin')} />
          ) : (
            <SignIn onNavigateToSignUp={() => handlePageChange('signup')} />
          )}
          <div className="mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    )
  }

  // Authenticated View - Full App
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-grow">
          {currentPage === 'extract' ? (
            <Extract />
          ) : currentPage === 'home' ? (
            <Home />
          ) : currentPage === 'generate' ? (
            <GenerateReport />
          ) : currentPage === 'sgpa-calculator' ? (
            <SGPACalculator />
          ) : currentPage === 'exam-planner' ? (
            <ExamPlanner />
          ) : currentPage === 'lava-ai' ? (
            <LavaChat />
          ) : currentPage === 'ppt-generator' ? (
            <PPTGenerator />
          ) : currentPage === 'medical-certificate' || currentPage === 'medical-reports' ? (
            <MedicalReports />
          ) : currentPage === 'about' ? (
            <About />
          ) : (
            /* Fallback usually doesn't happen due to useEffect guard, but good to have Home as default */
            <Home />
          )}
        </main>
        {currentPage !== 'about' && currentPage !== 'home' && currentPage !== 'sgpa-calculator' && currentPage !== 'lava-ai' && currentPage !== 'ppt-generator' && <Footer />}
      </div>
      <Chatbot />
    </div>
  )
}

export default App
