import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Terminal,
    Shield,
    Code,
    Cpu,
    Lock,
    Zap,
    User,
    Database,
    Calculator,
    BrainCircuit
} from 'lucide-react';

// --- UTILS ---
const GlitchText = ({ text }: { text: string }) => {
    return (
        <div className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-green-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse translate-x-[2px]">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse -translate-x-[2px]">{text}</span>
        </div>
    );
};

const Typewriter = ({ text, delay = 0, speed = 50 }: { text: string, delay?: number, speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayedText(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, speed);
            return () => clearInterval(interval);
        }, delay * 1000);
        return () => clearTimeout(timer);
    }, [text, delay, speed]);

    return <span>{displayedText}<span className="animate-pulse">_</span></span>;
};

// --- COMPONENTS ---

const IronManMessage = () => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="my-20 max-w-4xl mx-auto px-4">
            <motion.div
                initial={{ border: '1px solid rgba(0,255,255,0)', height: 0 }}
                whileInView={{ border: '1px solid rgba(0,255,255,0.3)', height: 'auto' }}
                viewport={{ once: true }}
                className="relative bg-black/80 backdrop-blur-sm overflow-hidden rounded-lg shadow-[0_0_30px_rgba(0,180,255,0.2)]"
            >
                {/* HUD Overlay Elements */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 rounded-br-sm" />

                <div className="p-2 bg-cyan-900/20 border-b border-cyan-500/30 flex justify-between items-center text-xs font-mono text-cyan-400">
                    <span className="flex items-center gap-2"><Lock size={12} /> MESSAGE FROM TONY STARK</span>
                    <span className="animate-pulse">ENCRYPTED</span>
                </div>

                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                    {/* Visual representation of Iron Man / Arc Reactor */}
                    <div className="shrink-0 relative">
                        <div className="w-32 h-32 rounded-full border-4 border-cyan-500/50 flex items-center justify-center relative shadow-[0_0_50px_rgba(0,200,255,0.5)]">
                            <div className="w-24 h-24 rounded-full border-2 border-white/80 bg-cyan-400/20 flex items-center justify-center animate-pulse shadow-[inset_0_0_20px_rgba(0,255,255,1)]">
                                <Zap size={40} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]" fill="white" />
                            </div>
                            {/* Spinning Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-cyan-300 rounded-full w-full h-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                                className="absolute inset-2 border-b-2 border-blue-400 rounded-full w-[calc(100%-16px)] h-[calc(100%-16px)] m-2"
                            />
                        </div>
                        <div className="text-center mt-4 font-mono text-cyan-300 text-xs tracking-widest">TONY STARK</div>
                    </div>

                    <div className="flex-grow space-y-4">
                        <h3 className="text-2xl font-bold text-cyan-100 font-mono flex items-center gap-3">
                            <span className="text-cyan-500">&gt;&gt;</span> INCOMING MESSAGE
                        </h3>
                        {showContent && (
                            <div className="text-lg md:text-xl text-cyan-200 font-mono leading-relaxed p-4 border-l-2 border-cyan-500/50 bg-cyan-950/30">
                                <p className="mb-2">"Vijay, I love you buddy."</p>
                                <p className="text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">"You are the next Tony Stark."</p>
                            </div>
                        )}
                        {!showContent && <div className="text-cyan-500 font-mono text-sm animate-pulse">DECRYPTING PACKET DATA...</div>}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

const CreatorCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-20 text-center relative max-w-2xl mx-auto"
        >
            <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-3xl font-bold mb-8 font-mono tracking-tighter">
                <span className="text-green-500">&lt;</span> SYSTEM ARCHITECT <span className="text-green-500">/&gt;</span>
            </h2>

            <div className="bg-black border border-green-500/30 p-1 rounded-xl inline-block max-w-sm w-full relative group">
                {/* Glitch edges */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-700 rounded-xl opacity-20 group-hover:opacity-50 blur transition duration-500" />

                <div className="bg-black relative rounded-lg p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
                    <div className="w-24 h-24 mx-auto bg-gray-900 rounded-full border-2 border-green-500/50 mb-4 flex items-center justify-center overflow-hidden">
                        <User size={48} className="text-green-500/50" />
                    </div>

                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-1">VIJAY</h3>
                    <p className="text-xs text-green-500/70 font-mono mb-4 tracking-widest">FOUNDER & LEAD DEV</p>

                    <div className="flex justify-center gap-2 text-xs font-mono text-gray-500">
                        <span className="px-2 py-1 border border-green-900/50 rounded bg-green-900/10">FULL_STACK</span>
                        <span className="px-2 py-1 border border-green-900/50 rounded bg-green-900/10">CYBER_SEC</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-green-900/30 text-[10px] text-gray-600 font-mono">
                        UID: 0xVIJAY // ACCESS LEVEL: ADMIN
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const HackerFeature = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="group relative p-6 border border-white/5 bg-white/5 hover:bg-green-500/10 transition-colors duration-300">
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono text-green-500">0101</span>
        </div>
        <div className="mb-4 text-green-500 group-hover:text-green-400 transition-colors">
            {icon}
        </div>
        <h4 className="text-xl font-bold mb-2 font-mono group-hover:text-white transition-colors"><GlitchText text={title} /></h4>
        <p className="text-sm text-gray-400 font-mono leading-relaxed">{desc}</p>
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-green-500 group-hover:w-full transition-all duration-300" />
    </div>
)

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-green-500/30 selection:text-green-200 overflow-x-hidden">

            {/* MATRIX RAIN BACKGROUND EFFECT (Simulated with CSS) */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tn33ai01UfQN36o/giphy.gif')] bg-cover opacity-20 mix-blend-screen" />
            </div>

            <div className="relative z-10 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

                {/* --- HERO SECTION --- */}
                <header className="text-center py-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-4 px-3 py-1 border border-green-500/30 bg-green-900/10 rounded text-xs font-mono text-green-400 tracking-widest"
                    >
                        <span className="animate-pulse">●</span> WELCOME TO STUDENT HELPER AI
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white mix-blend-difference">
                        <GlitchText text="STUDENT_HELPER" />
                    </h1>

                    <div className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-gray-400 font-mono leading-relaxed">
                        <Typewriter text="Initializing academic protocols. Generating Research Papers, Reports, and PPTs in seconds." speed={30} delay={0.5} />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => window.location.hash = 'generate'}
                            className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-bold font-mono tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] skew-x-[-10deg] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[20deg]" />
                            <span className="flex items-center gap-2 skew-x-[10deg]"><Terminal size={18} /> GENERATE REPORT</span>
                        </button>
                        <button
                            onClick={() => window.location.hash = 'sgpa-calculator'}
                            className="group relative px-8 py-4 border border-green-500/50 text-green-500 font-bold font-mono tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:border-green-400 skew-x-[-10deg]"
                        >
                            <span className="flex items-center gap-2 skew-x-[10deg]"><Calculator size={18} /> SGPA CALCULATOR</span>
                        </button>
                        <button
                            onClick={() => window.location.hash = 'exam-planner'}
                            className="group relative px-8 py-4 border border-green-500/50 text-green-500 font-bold font-mono tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:border-green-400 skew-x-[-10deg]"
                        >
                            <span className="flex items-center gap-2 skew-x-[10deg]"><BrainCircuit size={18} /> EXAM PLANNER</span>
                        </button>
                    </div>
                </header>

                {/* --- IRON MAN TRIBUTE --- */}
                <IronManMessage />

                {/* --- FEATURES GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
                    <HackerFeature
                        icon={<Cpu size={32} />}
                        title="AI GENERATION"
                        desc="Neural networks optimized for high-speed content generation and synthesis."
                    />
                    <HackerFeature
                        icon={<Shield size={32} />}
                        title="SECURE PLATFORM"
                        desc="Your data is encrypted. Academic integrity protocols are fully active."
                    />
                    <HackerFeature
                        icon={<Database size={32} />}
                        title="TEMPLATES"
                        desc="Pull templates and resources from our secure mainframe instantly."
                    />
                    <div onClick={() => window.location.hash = 'exam-planner'} className="cursor-pointer">
                        <HackerFeature
                            icon={<BrainCircuit size={32} />}
                            title="EXAM_PLANNER"
                            desc="AI-driven scheduling algorithm to maximize your study efficiency."
                        />
                    </div>
                </div>

                {/* --- CREATOR SECTION --- */}
                <CreatorCard />

                {/* --- FOOTER --- */}
                <footer className="border-t border-white/10 pt-8 mt-20 text-center font-mono text-xs text-gray-600">
                    <p>EST. 2026 // LAVA INDUSTRIES</p>
                    <p className="mt-2 text-gray-700">"I AM IRON MAN" - TONY STARK</p>
                </footer>

            </div>
        </div>
    );
};

export default Home;
