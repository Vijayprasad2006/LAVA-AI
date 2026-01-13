import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Plus,
    Info,
    X,
    ChevronRight,
    Search,
    Bell,
    Star,
    MonitorPlay,
    ArrowLeft
} from 'lucide-react';
// Import the video
import ThreeIdiotsVideo from '../assets/_-_3_-_3_Idiots_Result_Day_Scene_1080P.mp4';

// --- CONSTANTS ---
const NETFLIX_RED = "#E50914";
const NETFLIX_BLACK = "#141414";

// --- DATA ---
const STRATEGIES = [
    {
        id: 'holiday',
        title: 'The 3-3-3 Holiday Protocol',
        match: '98% Match',
        rating: 'U/A 16+',
        duration: '18h Course',
        tags: ['Intense', 'Grind', 'Topper'],
        desc: 'The ultimate holiday strategy. Wake up at 5 AM. Three modules. Three subjects. Zero excuses.',
        details: [
            { time: '05:00 AM', activity: 'Wake Up & Fresh Up', note: 'Yoga / Meditation / Milk' },
            { time: '06:00 AM - 12:00 PM', activity: 'Subject 1 Grind', note: '6 Hours Non-Stop' },
            { time: '12:00 PM - 12:30 PM', activity: 'Lunch Break', note: 'Refuel' },
            { time: '12:30 PM - 06:00 PM', activity: 'Subject 2 Grind', note: '6 Hours Non-Stop' },
            { time: '06:00 PM - 06:30 PM', activity: 'Dinner / Break', note: 'Bath & Relax' },
            { time: '06:30 PM - 12:00 AM', activity: 'Subject 3 Grind', note: 'Final Push' },
        ]
    },
    {
        id: 'college',
        title: 'The College Survivor',
        match: '95% Match',
        rating: '18+',
        duration: 'Daily Cycle',
        tags: ['Survival', 'Smart Work', 'Efficient'],
        desc: 'For when you have college but still need to top the exam. Ace the subject even if you start 1 week before.',
        details: [
            { time: '05:00 AM - 07:30 AM', activity: 'Morning Study', note: 'Fresh Mind Concept Grasping' },
            { time: '08:00 AM - 05:00 PM', activity: 'College / Internals', note: 'Survive the Day' },
            { time: '06:00 PM - 01:00 AM', activity: 'The Night Shift', note: 'The Real Grind Starts Here' },
            { time: 'Strategy', activity: 'Consistency', note: 'Repeat until you f**k the exam.' }
        ]
    }
];

const WATCHLIST = [
    { title: 'Game of Thrones', type: 'Series', img: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&q=80&w=400' },
    { title: 'Stranger Things', type: 'Series', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400' },
    { title: 'The Family Man', type: 'Series', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400' },
    { title: 'Iron Man', type: 'Marvel Saga', img: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=400' },
    { title: 'Avengers: Endgame', type: 'Marvel Saga', img: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&q=80&w=400' },
    { title: 'Deadpool & Wolverine', type: 'Marvel Saga', img: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&q=80&w=400' },
    { title: 'Death Note', type: 'Anime', img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400' },
    { title: 'One Punch Man', type: 'Anime', img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400' },
    { title: 'Demon Slayer', type: 'Anime', img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400' },
    { title: 'Naruto', type: 'Anime', img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=400' }
];

// --- COMPONENTS ---

const Header = () => (
    <div className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-12 py-4 bg-gradient-to-b from-black/80 to-transparent transition-all`}>
        <div className="flex items-center gap-4">
            <button
                onClick={() => window.location.hash = 'home'}
                className="text-white hover:text-[#E50914] transition-colors"
                title="Back to Home"
            >
                <ArrowLeft size={28} />
            </button>
            <div
                onClick={() => window.location.hash = 'home'}
                className="text-3xl font-bold text-[#E50914] tracking-tighter cursor-pointer hover:scale-105 transition-transform"
            >
                PLANFLIX
            </div>
        </div>
        <div className="flex items-center gap-6 text-white text-sm font-medium">
            <span
                onClick={() => window.location.hash = 'home'}
                className="hidden md:inline hover:text-gray-300 cursor-pointer font-bold"
            >
                Home
            </span>
            <span className="hidden md:inline hover:text-gray-300 cursor-pointer">Series</span>
            <span className="hidden md:inline hover:text-gray-300 cursor-pointer">Films</span>
            <span className="hidden md:inline hover:text-gray-300 cursor-pointer">My List</span>
            <div className="flex gap-4">
                <Search className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold">VJ</div>
            </div>
        </div>
    </div>
);

const EpisodeModal = ({ strategy, onClose }: { strategy: any, onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#181818] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative"
        >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#181818] flex items-center justify-center text-white hover:bg-[#333]">
                <X size={24} />
            </button>

            {/* Modal Hero */}
            <div className="h-[400px] w-full bg-cover bg-center relative" style={{ backgroundImage: 'linear-gradient(to top, #181818, transparent), url(https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1974&auto=format&fit=crop)' }}>
                <div className="absolute bottom-0 left-0 p-12 w-full">
                    <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">{strategy.title}</h2>
                    <div className="flex items-center gap-4 text-white mb-6">
                        <span className="text-green-400 font-bold">{strategy.match}</span>
                        <span className="text-gray-400">{strategy.duration}</span>
                        <span className="border border-gray-500 px-2 text-xs">{strategy.rating}</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white text-black px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-gray-200">
                            <Play fill="currentColor" size={20} /> Execute Plan
                        </button>
                        <button className="bg-gray-500/50 text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-gray-500/70">
                            <Plus size={24} /> Add to List
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Content */}
            <div className="p-12 pt-0 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div className="col-span-2">
                    <div className="mb-8 p-4 border-l-4 border-[#E50914] bg-[#2a2a2a] rounded-r">
                        <p className="text-lg leading-relaxed text-gray-200 font-medium">{strategy.desc}</p>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <MonitorPlay className="text-[#E50914]" /> Protocol Steps
                    </h3>

                    <div className="space-y-1">
                        {strategy.details.map((step: any, idx: number) => (
                            <div key={idx} className="group flex items-center p-4 border-b border-gray-700 hover:bg-[#333] transition-colors cursor-pointer rounded">
                                <span className="text-xl font-bold text-gray-500 w-8">{idx + 1}</span>
                                <div className="h-16 w-24 bg-gray-700 rounded mr-4 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" size={20} />
                                    </div>
                                    <img src={`https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover opacity-60" alt="Thumbnail" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-base">{step.activity}</h4>
                                        <span className="text-sm font-mono text-gray-400">{step.time}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs line-clamp-2">{step.note}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 text-sm">
                    <div>
                        <span className="text-gray-500">Tags:</span>
                        <span className="text-gray-300 ml-2">{strategy.tags.join(', ')}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">This plan is:</span>
                        <span className="text-gray-300 ml-2">Intense, Life-Changing, Mandatory</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
);

const ExamPlanner = () => {
    const [selectedStrategy, setSelectedStrategy] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#E50914] selection:text-white pb-20 overflow-x-hidden">
            <Header />

            {/* HERO SECTION */}
            <div className="relative h-[90vh] w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517430816045-df4b7de8db98?q=80&w=2070&auto=format&fit=crop)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
                </div>

                {/* Hero Content Grid */}
                <div className="absolute inset-0 flex items-end md:items-center pb-32 md:pb-0 px-4 md:px-12 z-10 w-full">
                    <div className="flex flex-col md:flex-row w-full items-end md:items-center justify-between gap-8 md:gap-16">

                        {/* LEFT: Text Content */}
                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="flex items-center gap-2 text-[#E50914] font-black tracking-widest text-lg animate-pulse">
                                <span className="bg-[#E50914] text-white px-1">N</span> SERIES
                            </div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-8xl font-black leading-none drop-shadow-2xl"
                            >
                                THE TOPPER
                            </motion.h1>

                            <div className="flex items-center gap-4 font-bold text-lg text-gray-200">
                                <span className="text-green-500">99% Match</span>
                                <span>2026</span>
                                <span className="border border-gray-500 px-2 text-sm bg-black/50">U/A 13+</span>
                                <span>1 Season</span>
                            </div>

                            <p className="text-xl md:text-2xl text-gray-200 font-medium drop-shadow-md text-shadow-lg leading-relaxed italic">
                                "If you are smart enough like <span className="text-[#E50914] font-bold">Rancho</span>, then chill maar, enjoy your genius brain.
                                If you are <span className="text-[#E50914] font-bold">Silencer</span>, then this site is not for you, buddy.
                                But if you are <span className="text-green-400 font-bold">Farhan or Raju</span>, then welcome buddy! You are the one who needs this site.
                                Enjoy with your life and studies!"
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button
                                    onClick={() => setSelectedStrategy(STRATEGIES[0])}
                                    className="bg-white text-black px-8 py-3 rounded font-bold text-xl flex items-center gap-3 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Play fill="currentColor" size={24} /> Play
                                </button>
                                <button className="bg-gray-500/70 text-white px-8 py-3 rounded font-bold text-xl flex items-center gap-3 hover:bg-gray-500/90 transition-all hover:scale-105 active:scale-95">
                                    <Info size={24} /> More Info
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Video Player */}
                        <div className="hidden md:block w-full md:w-5/12 mr-8">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: 0.5 } }}
                                className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800 rotate-2 hover:rotate-0 transition-transform duration-500 group"
                            >
                                <video
                                    src={ThreeIdiotsVideo}
                                    autoPlay
                                    loop
                                    controls
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">
                                    Results Day: Avoid the Tears
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROWS */}
            <div className="-mt-10 relative z-20 space-y-12 px-4 md:px-12 pb-20 bg-gradient-to-b from-transparent via-[#141414] to-[#141414]">

                {/* 1. PLANS ROW */}
                <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group cursor-pointer flex items-center gap-2">
                        Strategies for Success <ChevronRight className="text-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar scroll-smooth">
                        {STRATEGIES.map((strat, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedStrategy(strat)}
                                className="min-w-[300px] md:min-w-[400px] h-[220px] bg-[#1a1a1a] rounded relative transition-all duration-300 hover:scale-105 hover:z-30 cursor-pointer group shadow-lg border border-transparent hover:border-gray-700"
                            >
                                <img
                                    src={idx === 0 ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600" : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"}
                                    className="w-full h-full object-cover rounded opacity-60 group-hover:opacity-40 transition-opacity"
                                    alt={strat.title}
                                />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <h4 className="font-bold text-2xl mb-2 drop-shadow-lg text-white group-hover:text-white/90">{strat.title}</h4>
                                    <div className="flex gap-2 text-xs font-bold text-gray-300">
                                        <span className="text-green-500">{strat.match}</span>
                                        <span className="border border-gray-500 px-1">{strat.rating}</span>
                                        <span>{strat.duration}</span>
                                    </div>
                                    <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 shadow-lg"><Play fill="currentColor" size={14} /></button>
                                        <button className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white hover:bg-white/10"><Plus size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. QUITTERS ROW */}
                <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group cursor-pointer flex items-center gap-2">
                        If You Can't Follow The Plan... (Top Picks for You) <ChevronRight className="text-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-8 custom-scrollbar">
                        {WATCHLIST.map((item, idx) => (
                            <div key={idx} className="min-w-[200px] h-[300px] bg-[#222] rounded relative transition-transform duration-300 hover:scale-110 hover:z-30 cursor-pointer group">
                                <img
                                    src={item.img}
                                    className="w-full h-full object-cover rounded"
                                    alt={item.title}
                                />
                                {/* Hover Card Info */}
                                <div className="absolute inset-0 bg-[#181818] opacity-0 group-hover:opacity-100 transition-opacity rounded shadow-2xl p-4 flex flex-col justify-end">
                                    <div className="flex gap-2 mb-3">
                                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 shadow-lg"><Play fill="currentColor" size={14} /></button>
                                        <button className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:border-white hover:bg-white/10"><Plus size={16} /></button>
                                    </div>
                                    <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                                        <span className="text-green-500">New</span>
                                        <span className="border border-gray-600 px-1">HD</span>
                                        <span>{item.type}</span>
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-500">
                                        Exciting • Dark • Suspenseful
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* MODAL */}
            <AnimatePresence>
                {selectedStrategy && (
                    <EpisodeModal strategy={selectedStrategy} onClose={() => setSelectedStrategy(null)} />
                )}
            </AnimatePresence>

            {/* FOOTER */}
            <div className="mt-20 px-12 text-gray-500 text-sm pb-8">
                <div className="grid grid-cols-4 gap-4 max-w-4xl mb-4">
                    <span>Audio Description</span>
                    <span>Investor Relations</span>
                    <span>Legal Notices</span>
                    <span>Help Centre</span>
                    <span>Jobs</span>
                    <span>Cookie Preferences</span>
                </div>
                <button className="border border-gray-500 px-4 py-2 mt-4 hover:text-white">Service Code</button>
                <div className="mt-4 text-[11px]">© 2026 PlanFlix, Inc.</div>
            </div>
        </div>
    );
};

export default ExamPlanner;
