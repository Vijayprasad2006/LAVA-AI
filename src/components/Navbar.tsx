import { useState, useEffect } from 'react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const Navbar = ({ darkMode, setDarkMode }: NavbarProps) => {
  // props are intentionally unused for now; keep them for future use
  void darkMode; void setDarkMode;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  // Auth state
  const { user, signOut } = useAuth()

  useEffect(() => {
    const id = setTimeout(() => setIsMounted(true), 50)
    return () => clearTimeout(id)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.hash = 'signin';
    } catch (error) {
      console.error("Error signing out", error);
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 md:relative z-50 bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/10 transition-colors">
      {/* Desktop Navbar */}
      <nav className={`hidden md:flex h-[72px] w-full items-center max-w-container mx-auto px-6 ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'} transition-transform transition-opacity duration-500 ease-out`}>
        <a href="#home" onClick={(e) => { e.preventDefault(); window.location.hash = 'home'; window.dispatchEvent(new HashChangeEvent('hashchange')); }} className="mb-0.5 flex items-center mr-8 gap-3 cursor-pointer group" aria-label="LAVA">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
            <Logo className="h-9 w-9 flex-shrink-0 relative z-10" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-black tracking-tight text-white leading-none relative">
              LAVA
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest mt-0.5 text-gray-400 group-hover:text-white transition-colors">
              Student Helper
            </span>
          </div>
        </a>

        <ul className="relative m-0 flex h-full grow items-center gap-2 self-end p-0 justify-center">
          <NavItem href="#home" label="Home" activeHash="home" />
          <NavItem href="#extract" label="Extract Templates" activeHash="extract" />
          <NavItem href="#ppt-generator" label="PPT Generator" activeHash="ppt-generator" />
          <NavItem href="#lava-ai" label="LAVA AI" activeHash="lava-ai" />
          <NavItem href="#medical-reports" label="Medical Reports" />
          <NavItem href="#about" label="About" activeHash="about" />
        </ul>

        <div className="relative flex h-full items-center pl-8">
          {/* Auth / Search area */}
          {/* If user signed in show avatar + sign out, otherwise show links */}
          {user ? (
            <div className="flex items-center gap-4 bg-white/5 pr-4 pl-2 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors">
              <img src={(user as any).photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="avatar" className="h-8 w-8 rounded-full object-cover border border-white/20" />
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-none mb-0.5">{(user as any).displayName?.split(' ')[0] || 'User'}</span>
                <button onClick={handleSignOut} className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-orange-400 transition-colors text-right font-medium">Sign Out</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="#signin"
                onClick={(e) => { e.preventDefault(); window.location.hash = 'signin'; window.dispatchEvent(new HashChangeEvent('hashchange')); }}
                className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
                aria-label="Sign in"
              >
                Log In
              </a>

              <a
                href="#signup"
                onClick={(e) => { e.preventDefault(); window.location.hash = 'signup'; window.dispatchEvent(new HashChangeEvent('hashchange')); }}
                className="px-5 py-2 rounded-full text-sm font-bold text-black bg-white hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                aria-label="Sign up"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden flex h-[60px] w-full items-center justify-between px-4 bg-black/90 backdrop-blur-md border-b border-white/10">
        <a href="#home" onClick={(e) => { e.preventDefault(); window.location.hash = 'home'; window.dispatchEvent(new HashChangeEvent('hashchange')); }} className="mb-0.5 flex items-center gap-2" aria-label="LAVA">
          <Logo className="h-8 w-8 flex-shrink-0" />
          <span className="text-xl font-bold text-white">LAVA</span>
        </a>
        <button
          className="group relative w-10 h-10 flex items-center justify-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="flex flex-col justify-between w-6 h-5">
            <span className={`block h-0.5 w-full bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-full bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-black z-50 overflow-y-auto">
          <div className="flex flex-col p-6 gap-4">
            {user && (
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <img src={(user as any).photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="avatar" className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-white font-bold">{(user as any).displayName || 'User'}</p>
                  <button onClick={handleSignOut} className="text-sm text-red-500 font-medium mt-1">Sign Out</button>
                </div>
              </div>
            )}

            <MobileLink href="#home" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="#extract" label="Extract Templates" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="#ppt-generator" label="PPT Generator" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="#lava-ai" label="LAVA AI" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="#medical-certificate" label="Medical Certificate" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink href="#about" label="About" onClick={() => setMobileMenuOpen(false)} />

            {!user && (
              <div className="mt-8 flex flex-col gap-3">
                <a href="#signin" onClick={(e) => { e.preventDefault(); window.location.hash = 'signin'; setMobileMenuOpen(false); }} className="w-full py-3 text-center rounded-xl border border-white/20 text-white font-bold">Log In</a>
                <a href="#signup" onClick={(e) => { e.preventDefault(); window.location.hash = 'signup'; setMobileMenuOpen(false); }} className="w-full py-3 text-center rounded-xl bg-white text-black font-bold">Sign Up</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const NavItem = ({ href, label, activeHash }: { href: string, label: string, activeHash?: string }) => {
  // A simple check for active state could be added here if we had access to the current hash prop
  const isActive = activeHash ? window.location.hash === `#${activeHash}` : false; // Naive check, won't update on prop change without re-render

  return (
    <li className="relative">
      <a
        href={href}
        onClick={(e) => {
          if (href.startsWith('#')) {
            e.preventDefault();
            window.location.hash = href.replace('#', '');
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
      >
        {label}
      </a>
    </li>
  )
}

const MobileLink = ({ href, label, onClick }: { href: string, label: string, onClick: () => void }) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
          window.location.hash = href.replace('#', '');
        }
        onClick();
      }}
      className="text-2xl font-bold text-gray-400 hover:text-white transition-colors"
    >
      {label}
    </a>
  )
}

export default Navbar
