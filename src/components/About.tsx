import userManualVideo from '../assets/user-manual.mp4'
import { motion } from 'framer-motion'
import profileImg from '../assets/vijay-photo.jpeg'
import videoSrc from '../assets/videoplayback.mp4'
import { Github, Linkedin, Mail, Codepen, Globe, Cpu, Play, Instagram, FileText, Code2, Globe2 } from 'lucide-react'
import { useRef, useEffect } from 'react'

const About = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Loop between 55s and 90s (1m 30s)
      if (video.currentTime >= 90) {
        video.currentTime = 55;
        video.play();
      }
    };

    // Initial start time
    video.currentTime = 55;
    video.ontimeupdate = handleTimeUpdate;
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1014] text-white relative overflow-hidden pt-[80px] font-sans selection:bg-red-500/30 selection:text-red-200">

      {/* Spider-Verse Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 max-w-6xl pb-20">

        {/* Header - Glitch Effect */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-[80px] animate-pulse"></div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-4 relative z-10"
          >
            <span className="text-white hover:text-red-500 transition-colors duration-300 cursor-default" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>VIJAY</span>
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-red-600 to-blue-600 mx-auto"
          />
          <p className="mt-4 text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase opacity-80">
            System.Identity_Verified
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* Swinging Profile Card */}
          <div className="md:col-span-4 relative group perspective-1000">
            {/* Web Strand */}
            <div className="absolute -top-[100px] left-1/2 w-[1px] h-[100px] bg-white/20 group-hover:bg-cyan-400/50 transition-colors"></div>

            <motion.div
              initial={{ rotate: 5 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 10 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              className="relative bg-[#1a1b23] border border-white/10 p-2 rounded-xl shadow-2xl overflow-hidden group-hover:border-red-500/50 transition-all duration-500"
            >
              {/* Glitch Overlay */}
              <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>

              <div className="relative z-10 bg-black rounded-lg overflow-hidden">
                <img
                  src={profileImg}
                  alt="Vijay"
                  className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h2 className="text-2xl font-bold text-white font-mono">VIJAY_01</h2>
                  <p className="text-xs text-red-500 uppercase tracking-widest font-bold">Full Stack Dev</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Info Panels */}
          <div className="md:col-span-8 space-y-6">

            {/* Biography */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1b23]/80 backdrop-blur-md border border-white/10 p-8 rounded-tr-3xl rounded-bl-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-blue-500"></div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Origin Story
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                I'm a developer at <span className="text-white font-bold">NIE Mysuru</span>, fighting the chaos of bad UI/UX.
                Like a friendly neighborhood coder, I build tools that empower students and simplify complex workflows.
                My mission? To verify that <span className="text-cyan-400 italic">"With great power comes great documentation."</span>
              </p>
            </motion.div>

            {/* Personal Motivation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="border-l-4 border-red-500 pl-6 py-2 my-8 relative"
            >
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-red-500 transform rotate-45"></div>
              <div className="absolute -left-1.5 bottom-0 w-3 h-3 bg-red-500 transform rotate-45"></div>
              <p className="text-xl italic text-gray-300 font-serif leading-relaxed mb-2">
                "I asked my dad why he didn't pursue his billion-dollar idea. He said he couldn't take the risk because he had a family to protect."
              </p>
              <p className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="w-8 h-[1px] bg-red-500"></span>
                Now it's my time to show what a genius can do for his sacrifice.
              </p>
            </motion.div>

            {/* Feature Video Section (Original) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl overflow-hidden border border-white/10 relative group"
            >
              <div className="absolute top-0 left-0 bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider z-10">
                Featured Project
              </div>
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                autoPlay
                loop={false}
                controls
                className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
              />
              <div className="absolute bottom-4 left-4 z-10">
                <div className="flex items-center gap-2 text-white font-bold drop-shadow-md">
                  <Play className="w-4 h-4 fill-white" />
                  <span>System Demo</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid - Hexagonal feel */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Level', val: '3', sub: 'rd Year ISE' },
                { label: 'Specialty', val: 'React', sub: 'Frontend' },
                { label: 'Location', val: 'Mysuru', sub: 'Karnataka' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, borderColor: 'rgba(239,68,68,0.4)' }}
                  className="bg-black/40 border border-white/10 p-4 rounded-xl text-center hover:bg-white/5 transition-all cursor-crosshair relative overflow-hidden"
                >
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-2xl font-black text-white font-mono">{stat.val}</div>
                  <div className="text-[10px] text-cyan-500">{stat.sub}</div>
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/50"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/50"></div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start"
            >
              <SocialBtn href="https://github.com/Vijayprasad2006?tab=repositories" icon={Github} label="GITHUB" color="hover:border-white hover:text-white" />
              <SocialBtn href="https://www.linkedin.com/in/vijay-prasad-2bb6a4308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" icon={Linkedin} label="LINKEDIN" color="hover:border-blue-500 hover:text-blue-500" />
              <SocialBtn href="https://www.instagram.com/prasadvjay?igsh=ZW91OWFpa3BrZno=" icon={Instagram} label="INSTAGRAM" color="hover:border-pink-500 hover:text-pink-500" />
              <SocialBtn href="https://68c5605258aae294cbf1c348--wondrous-faun-ab19c6.netlify.app/" icon={Globe2} label="PORTFOLIO" color="hover:border-violet-500 hover:text-violet-500" />
              <SocialBtn href="https://leetcode.com/u/Vijayprasadtengli/" icon={Code2} label="LEETCODE" color="hover:border-yellow-500 hover:text-yellow-500" />
              <SocialBtn href="https://drive.google.com/file/d/1hg0a6nnUy6i_AfFxXPKb1i7zWlZPIEGF/view?usp=sharing" icon={FileText} label="RESUME" color="hover:border-green-500 hover:text-green-500" />
              <SocialBtn href="mailto:vijayprasad.h2006@gmail.com" icon={Mail} label="MAIL" color="hover:border-red-500 hover:text-red-500" />
            </motion.div>

            {/* User Manual Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 flex flex-col items-center justify-center p-6 bg-[#1a1b23]/50 rounded-3xl border border-white/5"
            >
              <div className="relative group p-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-border-flow w-full">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
                <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl w-full bg-black">
                  <video
                    src={userManualVideo}
                    controls
                    className="w-full h-auto max-h-[400px] object-cover"
                    poster="/video-poster-placeholder.jpg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <p className="mt-4 text-cyan-500 text-xs font-bold tracking-[0.2em] uppercase animate-pulse flex items-center gap-2">
                <Globe className="w-4 h-4" />
                System Orientation Manual
              </p>
            </motion.div>

          </div>
        </div>

        {/* Footer Motto */}
        <div className="mt-20 text-center border-t border-white/5 pt-10">
          <Cpu className="w-8 h-8 text-white/10 mx-auto mb-4 animate-spin-slow" />
          <p className="text-white/20 font-mono text-xs uppercase tracking-[0.5em]">
            LAVA Architecture • v2.0.4
          </p>
        </div>

      </div>
    </div>
  )
}

const SocialBtn = ({ href, icon: Icon, label, color }: any) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-3 px-6 py-3 bg-[#1a1b23] border border-white/10 rounded-lg group transition-all duration-300 ${color}`}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:animate-glitch" />
    <span className="font-bold text-xs tracking-widest hidden md:block">{label}</span>
  </a>
)

export default About
