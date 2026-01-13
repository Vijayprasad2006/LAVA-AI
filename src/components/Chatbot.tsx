import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Cpu, Activity, Zap } from 'lucide-react';

// Declare globals for Puter.js
declare global {
    interface Window {
        puter: any;
    }
}

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "J.A.R.V.I.S. Online. Systems nominal. How may I assist you with your report today?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Use Puter.js AI with Jarvis persona
            const response = await window.puter.ai.chat(
                `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an advanced AI assistant.
         CONTEXT:
         - You are the AI for "LAVA", a report making helper website.
         - The creator of this website/tool is "Vijay".
         - Your goal is to help students with their reports and answer questions about LAVA.
         
         INSTRUCTIONS:
         - If asked about the website or creator, use the context above.
         - Be helpful, precise, and polite. Refer to the user as "Sir" or "Miss".
         - Keep answers concise and technical but accessible.
         
         User Query: ${userMessage.text}`
            );

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response?.toString() || "Connection interrupted. Re-establishing link...",
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Puter AI Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "System error. Unable to process request.",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-mono">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute bottom-24 right-0 w-[90vw] md:w-[400px] h-[500px] bg-black/90 backdrop-blur-xl border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden"
                    >
                        {/* Holographic Header */}
                        <div className="p-3 border-b border-cyan-500/30 flex items-center justify-between bg-cyan-900/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 border border-cyan-400 rounded-full flex items-center justify-center relative group">
                                    <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 animate-pulse"></div>
                                    <div className="w-8 h-8 rounded-full border border-cyan-300 flex items-center justify-center">
                                        <Zap size={16} className="text-cyan-300" />
                                    </div>
                                    {/* Orbiting dots */}
                                    <div className="absolute w-full h-full rounded-full border-t border-cyan-500 animate-spin"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-cyan-300 text-base tracking-widest uppercase">J.A.R.V.I.S.</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-cyan-500/80">SYSTEM ONLINE</span>
                                        <Activity size={10} className="text-cyan-400 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-cyan-500/20 rounded-md transition-colors text-cyan-400 z-10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-700/50 scrollbar-track-transparent relative">
                            {/* Grid Background */}
                            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.isBot ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} `}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 text-sm border backdrop-blur-sm relative group ${msg.isBot
                                            ? 'border-cyan-500/30 bg-cyan-900/10 text-cyan-100 rounded-tr-xl rounded-bl-xl'
                                            : 'border-orange-500/30 bg-orange-900/10 text-orange-100 rounded-tl-xl rounded-br-xl'
                                            }`}
                                    >
                                        {/* Corner decorative bits */}
                                        <div className={`absolute w-2 h-2 border-t border-l ${msg.isBot ? 'border-cyan-500 -top-[1px] -left-[1px]' : 'border-orange-500 -top-[1px] -left-[1px]'}`}></div>
                                        <div className={`absolute w-2 h-2 border-b border-r ${msg.isBot ? 'border-cyan-500 -bottom-[1px] -right-[1px]' : 'border-orange-500 -bottom-[1px] -right-[1px]'}`}></div>

                                        {msg.text}
                                    </div>

                                    {msg.isBot && <div className="ml-2 mt-1 text-[8px] text-cyan-700 font-mono tracking-tighter opacity-0 group-hover:opacity-100">{new Date().toLocaleTimeString()}</div>}

                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-cyan-900/10 border border-cyan-500/30 p-2 rounded-tr-xl rounded-bl-xl flex gap-1 items-center h-8">
                                        <div className="w-1 h-3 bg-cyan-400 animate-pulse delay-75"></div>
                                        <div className="w-1 h-4 bg-cyan-400 animate-pulse delay-150"></div>
                                        <div className="w-1 h-2 bg-cyan-400 animate-pulse delay-300"></div>
                                        <span className="text-[10px] text-cyan-400 ml-1 animate-pulse">PROCESSING...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-cyan-500/30 bg-black/40 backdrop-blur-md">
                            <div className="relative flex items-center">
                                <Cpu size={18} className="absolute left-3 text-cyan-500/50" />
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="ENTER COMMAND..."
                                    className="w-full bg-cyan-900/10 border border-cyan-500/30 rounded-full pl-10 pr-12 py-3 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder:text-cyan-700"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-1.5 p-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 rounded-full text-cyan-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* "Arc Reactor" Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-16 h-16 rounded-full flex items-center justify-center group"
            >
                {/* Glow Effects */}
                <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-20 animate-pulse blur-md group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute inset-1 bg-black rounded-full border-2 border-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>

                {/* Inner Reactor */}
                <div className="relative z-10 flex items-center justify-center">
                    {isOpen ? (
                        <X size={24} className="text-cyan-100" />
                    ) : (
                        <div className="relative">
                            <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff] animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-300 rounded-full opacity-50 animate-spin-slow"></div>
                        </div>
                    )}
                </div>

                {/* Ring */}
                <div className="absolute inset-0 border border-cyan-400/30 rounded-full scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
            </motion.button>
        </div>
    );
};

export default Chatbot;
