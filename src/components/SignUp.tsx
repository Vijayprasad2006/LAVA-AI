import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { auth, db, googleProvider, facebookProvider, githubProvider, signInWithProvider } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

interface SignUpProps {
  onNavigateToSignIn?: () => void
}

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    const numStars = 200

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'

      stars.forEach((star) => {
        ctx.globalAlpha = star.opacity
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        star.y -= star.speed
        if (star.y < 0) {
          star.y = height
          star.x = Math.random() * width
        }
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 ml-0 mr-0 mt-0 mb-0" />
}

const SignUp = ({ onNavigateToSignIn }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'individual'
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // 3D Parallax Tilt Effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (windowSize.width === 0) return
    const { clientX, clientY } = e
    const centerX = windowSize.width / 2
    const centerY = windowSize.height / 2
    mouseX.set(clientX - centerX)
    mouseY.set(clientY - centerY)
  }

  const rotateX = useTransform(mouseY, [-500, 500], [5, -5])
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5])

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 }
  const smoothRotateX = useSpring(rotateX, springConfig)
  const smoothRotateY = useSpring(rotateY, springConfig)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setErrors({ name: '', email: '', password: '', confirmPassword: '', accountType: '' })

    // Validation
    const newErrors = { ...errors }
    let hasError = false

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; hasError = true }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; hasError = true }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email is invalid'; hasError = true }

    if (!formData.password) { newErrors.password = 'Password is required'; hasError = true }
    else if (formData.password.length < 8) { newErrors.password = 'Min 8 characters'; hasError = true }

    if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; hasError = true }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      await updateProfile(user, { displayName: formData.name })

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        accountType: formData.accountType,
        createdAt: serverTimestamp(),
      })

      if (onNavigateToSignIn) onNavigateToSignIn()
      else window.location.hash = 'signin' // Fallback

    } catch (err: any) {
      console.error('Sign up error', err)
      setSubmitError(err?.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-[#050505] font-sans text-gray-200 selection:bg-cyan-500/30 selection:text-cyan-200 perspective-[1000px] py-32"
      onMouseMove={handleMouseMove}
    >

      {/* --- COSMIC BACKGROUND --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-[#050508] to-[#0a0a12] z-0" />
      <Starfield />

      {/* Ambient Flares */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"
      />

      {/* --- 3D SIGN UP CARD --- */}
      <motion.div
        style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformStyle: 'preserve-3d' }}
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg px-6 py-10"
      >
        <div className="group relative rounded-3xl border border-cyan-400/50 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_0px_rgba(6,182,212,0.6)] overflow-hidden">

          {/* Internal Shimmer Layer */}
          <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Glossy Reflection */}
          <div className="absolute -inset-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 pointer-events-none translate-y-full hover:translate-y-[-100%] transition-transform duration-[2s] ease-in-out" />

          <motion.div
            className="relative z-10 p-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="relative inline-flex items-center justify-center w-16 h-16 mb-4 mx-auto"
              >
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow" />
                <div className="relative bg-black/50 p-3 rounded-full border border-cyan-500/30 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] backdrop-blur-md cursor-pointer">
                  <Logo className="w-8 h-8 text-cyan-400" />
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-1 select-none">
                <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                  INITIALIZE PROFILE
                </h1>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  Join the Collective
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Account Type */}
              <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="relative group">
                <div className="relative bg-[#0a0a0f] rounded-xl overflow-hidden border border-white/5">
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="relative w-full bg-transparent px-5 py-4 text-sm text-gray-200 focus:outline-none focus:bg-white/5 transition-all font-medium tracking-wide z-10 appearance-none cursor-pointer"
                  >
                    <option value="individual" className="bg-black text-gray-200">Individual Entity</option>
                    <option value="business" className="bg-black text-gray-200">Corporate Entity</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z" /></svg>
                  </div>
                </div>
              </motion.div>

              {/* Name */}
              <motion.div variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="relative group">
                <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur-[3px] transition-opacity duration-500" />
                <div className="relative bg-[#0a0a0f] rounded-xl overflow-hidden">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Designation"
                    className="relative w-full bg-transparent border border-white/5 px-5 py-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:bg-white/5 transition-all font-medium tracking-wide z-10"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-500 transition-all duration-300 group-focus-within:w-full box-border" />
                </div>
                {errors.name && <span className="absolute -bottom-4 right-0 text-[10px] text-red-400">{errors.name}</span>}
              </motion.div>

              {/* Email */}
              <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="relative group">
                <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur-[3px] transition-opacity duration-500" />
                <div className="relative bg-[#0a0a0f] rounded-xl overflow-hidden">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Comms Frequency (Email)"
                    className="relative w-full bg-transparent border border-white/5 px-5 py-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:bg-white/5 transition-all font-medium tracking-wide z-10"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-500 transition-all duration-300 group-focus-within:w-full box-border" />
                </div>
                {errors.email && <span className="absolute -bottom-4 right-0 text-[10px] text-red-400">{errors.email}</span>}
              </motion.div>

              {/* Password Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="relative group">
                  <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur-[3px] transition-opacity duration-500" />
                  <div className="relative bg-[#0a0a0f] rounded-xl overflow-hidden">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Access Key"
                      className="relative w-full bg-transparent border border-white/5 px-5 py-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:bg-white/5 transition-all font-medium tracking-wide z-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-600 hover:text-white uppercase z-20">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-purple-500 transition-all duration-300 group-focus-within:w-full box-border" />
                  </div>
                  {errors.password && <span className="absolute -bottom-4 left-0 text-[10px] text-red-400 w-[150%]">{errors.password}</span>}
                </motion.div>

                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="relative group">
                  <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur-[3px] transition-opacity duration-500" />
                  <div className="relative bg-[#0a0a0f] rounded-xl overflow-hidden">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Verify Key"
                      className="relative w-full bg-transparent border border-white/5 px-5 py-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:bg-white/5 transition-all font-medium tracking-wide z-10"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-600 hover:text-white uppercase z-20">
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-purple-500 transition-all duration-300 group-focus-within:w-full box-border" />
                  </div>
                  {errors.confirmPassword && <span className="absolute -bottom-4 right-0 text-[10px] text-red-400">{errors.confirmPassword}</span>}
                </motion.div>
              </div>

              {submitError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-red-400 text-xs bg-red-500/10 py-3 rounded-lg border border-red-500/20 font-medium">
                  {submitError}
                </motion.div>
              )}

              {/* Main Button */}
              <motion.button
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full relative py-4 bg-white text-black rounded-xl font-bold tracking-widest text-sm uppercase shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.6)] transition-all overflow-hidden group border border-white mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-0" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Access ID</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer Actions */}
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="mt-8 text-center">
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Already authorized?
                <button onClick={onNavigateToSignIn} className="ml-2 text-cyan-400 hover:text-white transition-colors uppercase font-bold tracking-widest relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-cyan-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  Sign In
                </button>
              </p>
            </motion.div>

            {/* Social Divider */}
            <motion.div variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1 } }} className="relative my-6 select-none">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center"><span className="bg-[#050508]/80 backdrop-blur px-4 text-[10px] text-gray-600 uppercase tracking-widest font-bold">Or Join With</span></div>
            </motion.div>

            {/* Socials */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "google", action: googleProvider },
                { icon: "github", action: githubProvider },
                { icon: "facebook", action: facebookProvider }
              ].map((social, i) => (
                <motion.button
                  key={i}
                  variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async (e) => { e.preventDefault(); setSubmitError(''); setIsLoading(true); try { await signInWithProvider(social.action); if (onNavigateToSignIn) onNavigateToSignIn(); window.location.hash = 'home'; } catch (err: any) { setSubmitError(err?.message); } finally { setIsLoading(false); } }}
                  className="flex items-center justify-center py-3 rounded-xl bg-white/5 border border-white/5 transition-all group"
                >
                  {social.icon === 'google' && <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>}
                  {social.icon === 'github' && <svg className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" /></svg>}
                  {social.icon === 'facebook' && <svg className="w-5 h-5 text-[#1877F2] opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                </motion.button>
              ))}
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
