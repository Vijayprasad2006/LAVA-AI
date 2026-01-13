import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    RotateCcw,
    Zap,
    Cpu,
    Activity,
    Layers
} from 'lucide-react';

// --- TYPES ---
interface Subject {
    id: string;
    credits: number;
    grade: string;
}

const GRADES: { [key: string]: number } = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C+': 5,
    'C': 4,
    'F': 0
};

// --- COMPONENTS ---

const ArcReactorGauge = ({ score }: { score: number }) => {
    // Color logic
    let color = "text-cyan-400";
    let glow = "shadow-[0_0_50px_rgba(34,211,238,0.4)]";
    let ringColor = "border-cyan-500/30";

    if (score >= 9) {
        color = "text-emerald-400";
        glow = "shadow-[0_0_50px_rgba(52,211,153,0.4)]";
        ringColor = "border-emerald-500/30";
    } else if (score < 5) {
        color = "text-red-500";
        glow = "shadow-[0_0_50px_rgba(239,68,68,0.4)]";
        ringColor = "border-red-500/30";
    }

    return (
        <div className="relative flex items-center justify-center w-48 h-48 mx-auto my-6 group cursor-default">
            {/* Core Reactor Glow */}
            <div className={`absolute inset-0 rounded-full bg-black border-4 ${ringColor} ${glow} animate-pulse z-0 transition-colors duration-1000`}></div>

            {/* Spinning Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className={`absolute inset-2 rounded-full border-t-2 border-b-2 ${color} opacity-50 z-10`}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                className={`absolute inset-6 rounded-full border-l-2 border-r-2 ${color} opacity-30 z-10`}
            />

            {/* Center Display */}
            <div className="relative z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-full w-28 h-28 border border-white/10">
                <motion.div
                    key={score}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-5xl font-black ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] font-mono tracking-tighter`}
                >
                    {score}
                </motion.div>
                <div className="text-[10px] font-mono text-gray-400 mt-1 tracking-widest">SGPA</div>
            </div>

            {/* Decorative Tech Marks */}
            <div className="absolute top-0 w-1 h-3 bg-white/20"></div>
            <div className="absolute bottom-0 w-1 h-3 bg-white/20"></div>
            <div className="absolute left-0 w-3 h-1 bg-white/20"></div>
            <div className="absolute right-0 w-3 h-1 bg-white/20"></div>
        </div>
    );
};

const SGPACalculator = () => {
    // State
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: '1', credits: 4, grade: 'O' },
        { id: '2', credits: 3, grade: 'A+' },
        { id: '3', credits: 3, grade: 'A' },
        { id: '4', credits: 1, grade: 'O' },
    ]);
    const [sgpa, setSgpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);

    // Calculation
    useEffect(() => {
        let tPoints = 0;
        let tCredits = 0;

        subjects.forEach(sub => {
            const points = GRADES[sub.grade] || 0;
            const cred = Number(sub.credits) || 0;
            tPoints += cred * points;
            tCredits += cred;
        });

        setTotalCredits(tCredits);
        setSgpa(tCredits > 0 ? Number((tPoints / tCredits).toFixed(2)) : 0);
    }, [subjects]);

    // Handlers
    const addSubject = () => {
        setSubjects([...subjects, { id: Date.now().toString(), credits: 3, grade: 'A' }]);
    };

    const removeSubject = (id: string) => {
        if (subjects.length > 1) setSubjects(subjects.filter(s => s.id !== id));
    };

    const updateSubject = (id: string, field: keyof Subject, value: any) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const reset = () => {
        setSubjects([{ id: Date.now().toString(), credits: 4, grade: 'O' }]);
    };

    return (
        <div className="min-h-screen bg-[#050510] text-cyan-50 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/30">

            {/* Cyber Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Visual Side (Left) */}
                <div className="flex flex-col items-center justify-center order-1 lg:order-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <ArcReactorGauge score={sgpa} />
                    </motion.div>

                    {/* Stats Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                            <Activity className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold font-mono text-white">{totalCredits}</div>
                            <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Reg. Credits</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
                            <Layers className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold font-mono text-white">{subjects.length}</div>
                            <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Subjects</div>
                        </div>
                    </motion.div>
                </div>

                {/* Info Side (Right) - The Projector Interface */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col h-[600px] bg-black/40 border-l border-white/10 backdrop-blur-md rounded-2xl relative overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                            <h2 className="text-lg font-bold font-mono tracking-widest text-cyan-100">COURSE_DATA</h2>
                        </div>
                        <button onClick={reset} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all" title="Reset Data">
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        <div className="flex text-xs font-mono text-gray-500 mb-2 px-2 uppercase tracking-widest">
                            <div className="w-10 text-center">#</div>
                            <div className="flex-1 text-center">Grade</div>
                            <div className="flex-1 text-center">Credits</div>
                            <div className="w-8"></div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {subjects.map((sub, index) => (
                                <motion.div
                                    key={sub.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-900/10 transition-all font-mono"
                                >
                                    <div className="w-10 text-center text-gray-500 text-sm">{String(index + 1).padStart(2, '0')}</div>

                                    {/* Grade Select */}
                                    <div className="flex-1">
                                        <select
                                            value={sub.grade}
                                            onChange={(e) => updateSubject(sub.id, 'grade', e.target.value)}
                                            className="w-full bg-black/40 text-cyan-300 font-bold text-center py-2 rounded border border-white/10 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-colors"
                                        >
                                            {Object.keys(GRADES).map(g => (
                                                <option key={g} value={g} className="bg-gray-900">{g}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Credits Input */}
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={sub.credits}
                                            onChange={(e) => updateSubject(sub.id, 'credits', Math.max(1, parseInt(e.target.value) || 0))}
                                            className="w-full bg-black/40 text-emerald-300 font-bold text-center py-2 rounded border border-white/10 focus:border-emerald-500 focus:outline-none hover:bg-black/60 transition-colors"
                                        />
                                    </div>

                                    {/* Delete */}
                                    <div className="w-8 flex justify-center">
                                        <button
                                            onClick={() => removeSubject(sub.id)}
                                            className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Footer / Add Button */}
                    <div className="p-6 border-t border-white/10 bg-white/5">
                        <button
                            onClick={addSubject}
                            className="w-full py-3 bg-cyan-600/20 border border-cyan-500/50 hover:bg-cyan-600/30 text-cyan-300 font-bold font-mono tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.3)] group"
                        >
                            <Zap className="w-4 h-4 group-hover:fill-cyan-300 transition-all" />
                            ADD_MODULE
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default SGPACalculator;
