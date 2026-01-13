import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, MessageSquare, Trash2, Sparkles, Zap, Menu, Flame } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Declare globals for Puter.js
declare global {
    interface Window {
        puter: any;
    }
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    date: Date;
}

const LavaChat = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on mobile
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with a new session if none exists
    useEffect(() => {
        const savedSessions = localStorage.getItem('lava-ai-sessions');
        if (savedSessions) {
            try {
                const parsed = JSON.parse(savedSessions);
                const hydrated = parsed.map((s: any) => ({
                    ...s,
                    date: new Date(s.date),
                    messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
                }));
                // Sort sessions by date descending
                hydrated.sort((a: ChatSession, b: ChatSession) => b.date.getTime() - a.date.getTime());

                setSessions(hydrated);
                if (hydrated.length > 0) {
                    setCurrentSessionId(hydrated[0].id);
                } else {
                    createNewSession();
                }
            } catch (e) {
                createNewSession();
            }
        } else {
            createNewSession();
        }
    }, []);

    // Save to local storage whenever sessions change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('lava-ai-sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [sessions, currentSessionId, isLoading]);

    const createNewSession = () => {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: 'New Thread',
            messages: [],
            date: new Date()
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const deleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);
        if (currentSessionId === id) {
            if (newSessions.length > 0) {
                setCurrentSessionId(newSessions[0].id);
            } else {
                createNewSession();
            }
        }
        localStorage.setItem('lava-ai-sessions', JSON.stringify(newSessions));
    };

    const getCurrentMessages = () => {
        const session = sessions.find(s => s.id === currentSessionId);
        return session ? session.messages : [];
    };

    const updateCurrentSessionMessages = (newMessages: Message[]) => {
        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                let title = s.title;
                if (s.messages.length === 0 && newMessages.length > 0) {
                    const firstMsg = newMessages[0];
                    if (firstMsg.role === 'user') {
                        title = firstMsg.content.slice(0, 30) + (firstMsg.content.length > 30 ? '...' : '');
                    }
                }
                return { ...s, messages: newMessages, title, date: new Date() }; // Update date on new message
            }
            return s;
        }));
    };

    const handleSend = async () => {
        if (!input.trim() || !currentSessionId) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        const updatedMessages = [...getCurrentMessages(), userMsg];
        updateCurrentSessionMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const contextPrompt = `You are LAVA STUDENT HELPER AI, the ultimate academic assistant.
            - Your Mission: Help students instantly create automated reports, research papers, and presentation (PPT) outlines.
            - Capabilities: Writing complex academic content, structuring research, debugging code, and explaining concepts.
            - Tone: Intelligent, encouraging, and highly efficient.
            - Format Requirement: You MUST use styled Markdown.
              - Use **Bold** for emphasis.
              - Use ### Headers for sections.
              - Use - Bullet points for lists.
              - Use \`code blocks\` for code.
              - NEVER output a single long paragraph. Always break it down.
            
            Current Conversation:
            ${updatedMessages.slice(-5).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
            
            User's New Message: ${input}`;

            const response = await window.puter.ai.chat(contextPrompt);
            const aiContent = response?.toString() || "I apologize, but I received no response.";

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiContent,
                timestamp: new Date()
            };

            updateCurrentSessionMessages([...updatedMessages, aiMsg]);

        } catch (error: any) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to the LAVA neural network (Puter Error). Please try again later.",
                timestamp: new Date()
            };
            updateCurrentSessionMessages([...updatedMessages, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gpt-main text-gpt-text font-sans overflow-hidden">

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative z-30 md:translate-x-0 transition-transform duration-300 w-[260px] h-full bg-gpt-sidebar flex flex-col p-2`}>

                {/* Header Logo Area */}
                <div className="flex items-center gap-2 px-3 py-4 mb-2">
                    <div className="p-1 rounded-lg bg-white/10">
                        <Flame size={20} className="text-white fill-white" />
                    </div>
                    <span className="font-semibold text-white tracking-tight">LavaChat</span>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={createNewSession}
                    className="flex items-center gap-3 px-3 py-3 rounded-md border border-white/20 text-sm text-white hover:bg-gray-900/50 transition-colors mb-4 text-left"
                >
                    <Plus size={16} />
                    <span>New chat</span>
                </button>

                {/* History List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                    <div className="flex flex-col gap-2">
                        {sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => {
                                    setCurrentSessionId(session.id);
                                    if (window.innerWidth < 768) setSidebarOpen(false);
                                }}
                                className={`group flex items-center gap-3 px-3 py-3 text-sm text-gray-100 rounded-md transition-colors ${currentSessionId === session.id ? 'bg-[#343541]/90' : 'hover:bg-[#2A2B32]'
                                    }`}
                            >
                                <MessageSquare size={16} className="text-gray-400" />
                                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left relative">
                                    {session.title}
                                    <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${currentSessionId === session.id ? 'from-[#343541]' : 'from-[#202123] group-hover:from-[#2A2B32]'} to-transparent`} />
                                </div>
                                {currentSessionId === session.id && (
                                    <Trash2
                                        size={14}
                                        className="text-gray-400 hover:text-white z-10"
                                        onClick={(e) => deleteSession(e, session.id)}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User Profile */}
                <div className="border-t border-white/20 pt-2 mt-2">
                    <button className="flex items-center gap-3 px-3 py-3 w-full hover:bg-gray-900/50 rounded-md transition-colors text-sm">
                        <User size={16} />
                        <div className="font-bold">Vijay</div>
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600/50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative h-full">

                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-2 text-gray-300 bg-gpt-sidebar border-b border-white/10">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-700 rounded-md">
                        <Menu size={20} />
                    </button>
                    <span className="mx-auto font-medium">LavaChat</span>
                    <button onClick={createNewSession} className="p-2 hover:bg-gray-700 rounded-md">
                        <Plus size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-600">
                    {getCurrentMessages().length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white px-4">
                            <div className="bg-white/10 p-4 rounded-full mb-6">
                                <Flame size={40} className="text-white fill-white" />
                            </div>
                            <h1 className="text-4xl font-semibold mb-8">LavaChat</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl text-center">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-center mb-2">
                                        <Sparkles className="mb-2" />
                                        <h2 className="text-lg font-medium">Examples</h2>
                                    </div>
                                    <button onClick={() => setInput("Explain quantum computing in simple terms")} className="bg-white/5 p-3 rounded-md hover:bg-black/20 text-sm">"Explain quantum computing in simple terms" &rarr;</button>
                                    <button onClick={() => setInput("Got any creative ideas for a 10 year old's birthday?")} className="bg-white/5 p-3 rounded-md hover:bg-black/20 text-sm">"Got any creative ideas for a 10 year old's birthday?" &rarr;</button>
                                    <button onClick={() => setInput("How do I make an HTTP request in Javascript?")} className="bg-white/5 p-3 rounded-md hover:bg-black/20 text-sm">"How do I make an HTTP request in Javascript?" &rarr;</button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-center mb-2">
                                        <Zap className="mb-2" />
                                        <h2 className="text-lg font-medium">Capabilities</h2>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-md text-sm">Remembers what user said earlier in the conversation</div>
                                    <div className="bg-white/5 p-3 rounded-md text-sm">Allows user to provide follow-up corrections</div>
                                    <div className="bg-white/5 p-3 rounded-md text-sm">Trained to declin inappropriate requests</div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-center mb-2">
                                        <Trash2 className="mb-2" />
                                        <h2 className="text-lg font-medium">Limitations</h2>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-md text-sm">May occasionally generate incorrect information</div>
                                    <div className="bg-white/5 p-3 rounded-md text-sm">May occasionally produce harmful instructions or biased content</div>
                                    <div className="bg-white/5 p-3 rounded-md text-sm">Limited knowledge of world and events after 2021</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col pb-32">
                            {getCurrentMessages().map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-100 ${msg.role === 'assistant' ? 'bg-gpt-assistant' : 'bg-transparent'
                                        }`}
                                >
                                    <div className="max-w-3xl mx-auto flex gap-4 p-4 md:p-6 text-base m-auto">
                                        <div className="w-[30px] flex flex-col relative items-end">
                                            <div
                                                className={`w-[30px] h-[30px] rounded-sm flex items-center justify-center ${msg.role === 'assistant' ? 'bg-[#19c37d]' : 'bg-[#5436DA]'
                                                    }`}
                                            >
                                                {msg.role === 'assistant' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
                                            </div>
                                        </div>
                                        <div className="relative flex-1 overflow-hidden">
                                            <div className="prose prose-invert max-w-none leading-7">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code(props: any) {
                                                            const { children, className, ...rest } = props;
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return match ? (
                                                                <div className="relative">
                                                                    <div className="absolute right-2 top-2 text-xs text-gray-400">{match[1]}</div>
                                                                    <pre className="!bg-black/30 !p-4 !rounded-lg !my-4 overflow-x-auto">
                                                                        <code className={className} {...rest}>
                                                                            {children}
                                                                        </code>
                                                                    </pre>
                                                                </div>
                                                            ) : (
                                                                <code className="bg-white/10 rounded px-1 py-0.5 text-sm" {...rest}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="w-full bg-gpt-assistant border-b border-black/10 dark:border-gray-900/50 text-gray-100">
                                    <div className="max-w-3xl mx-auto flex gap-4 p-4 md:p-6 m-auto">
                                        <div className="w-[30px] flex flex-col relative items-end">
                                            <div className="w-[30px] h-[30px] rounded-sm bg-[#19c37d] flex items-center justify-center">
                                                <Bot size={20} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="relative flex-1 overflow-hidden">
                                            <div className="flex items-center gap-1 mt-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-12" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gpt-main via-gpt-main to-transparent pt-10 pb-6 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-center p-3 rounded-xl bg-gpt-input shadow-md border border-black/10 dark:border-gray-900/50">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Send a message..."
                                rows={1}
                                className="flex-1 max-h-[200px] overflow-y-auto bg-transparent border-0 ring-0 focus:ring-0 text-white placeholder:text-gray-400 resize-none py-1 pl-2 pr-10 m-0 w-full outline-none font-medium"
                                style={{ height: '24px' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={`absolute right-3 p-1.5 rounded-md transition-all duration-200 ${input.trim()
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-transparent text-gray-500 hover:bg-white/10'
                                    }`}
                            >
                                <Send size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="text-xs text-center text-gray-400 mt-2">
                            LavaChat may produce inaccurate information about people, places, or facts.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LavaChat;
