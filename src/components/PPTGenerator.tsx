import { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, Image as ImageIcon, Type, Sparkles, Briefcase, Users, ChevronRight } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';

declare global {
    interface Window {
        puter: any;
    }
}

const PPTGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [slideCount, setSlideCount] = useState(5);
    const [college, setCollege] = useState('');
    const [subject, setSubject] = useState('');
    const [teamMembers, setTeamMembers] = useState('');

    // Premium Defaults (Stark Enterprise Style)
    const [bgColor, setBgColor] = useState('#0a0a0a'); // Deepest Black/Blue
    const [textColor, setTextColor] = useState('#f5f5f5'); // Off-white
    const [accentColor, setAccentColor] = useState('#00d4ff'); // Cyan Tech Glow
    const [fontFace, setFontFace] = useState('Roboto');

    const [images, setImages] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    const [activeTab, setActiveTab] = useState<'create' | 'customize'>('create');

    // Preview logic
    const [previewTitle, setPreviewTitle] = useState('PRESENTATION TITLE');

    const fonts = ['Roboto', 'Arial', 'Verdana', 'Times New Roman', 'Helvetica', 'Open Sans', 'Montserrat'];

    useEffect(() => {
        setPreviewTitle(prompt.length > 0 ? prompt : 'PRESENTATION TITLE');
    }, [prompt]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const promises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target?.result as string);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(promises).then(base64Images => {
                setImages(prev => [...prev, ...base64Images]);
            }).catch(err => console.error("Error reading images:", err));
        }
    };

    const generatePPT = async () => {
        if (!prompt.trim()) {
            alert("Please enter a presentation topic.");
            return;
        }

        setIsGenerating(true);
        setStatus('Initializing generation sequence...');

        try {
            const systemPrompt = `You are a professional presentation architect.
            Create a ${slideCount}-slide presentation on the user's topic.
            Context: Subject is "${subject}". Target audience is academic/professional.
            Result MUST be a valid JSON array of objects.
            Each object must have:
            - "title": (string) Slide title
            - "content": (string array) 3-5 bullet points
            
            Example format:
            [
                {"title": "Introduction", "content": ["Point 1", "Point 2"]},
                {"title": "Analysis", "content": ["Data A", "Data B"]}
            ]
            
            Do not include any markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON string.`;

            const aiResponse = await window.puter.ai.chat(systemPrompt + "\n\nTopic: " + prompt);

            setStatus('Structuring content...');
            let cleanResponse = aiResponse?.toString() || '[]';
            cleanResponse = cleanResponse.replace(/```json/g, '').replace(/```/g, '').trim();

            let slidesData;
            try {
                slidesData = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Failed to parse JSON", cleanResponse);
                throw new Error("Content generation failed. Please try again.");
            }

            if (!Array.isArray(slidesData) || slidesData.length === 0) {
                throw new Error("No slides were generated.");
            }

            setStatus('Designing slides...');

            const pres = new PptxGenJS();
            pres.layout = 'LAYOUT_16x9';
            pres.author = teamMembers.split('\n')[0] || 'LAVA AI';
            pres.company = college || 'ReportAI';
            pres.title = prompt;

            const hexBg = bgColor.replace('#', '');
            const hexText = textColor.replace('#', '');
            const hexAccent = accentColor.replace('#', '');

            // Master Slide: Clean, Modern, Tech-but-Formal
            pres.defineSlideMaster({
                title: 'MASTER_MODERN',
                background: { color: hexBg },
                objects: [
                    // Subtle top bar
                    { rect: { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: hexAccent, transparency: 80 } } },
                    { line: { x: 0, y: 0.1, w: '100%', h: 0, line: { color: hexAccent, width: 1 } } },

                    // Footer branding
                    { text: { text: "GENERATED BY LAVA", options: { x: 0.2, y: 7.2, w: 4, h: 0.3, fontSize: 8, color: hexText, transparency: 60 } } },
                    { text: { text: college.toUpperCase(), options: { x: 0.5, y: 0.25, w: 4, h: 0.3, fontSize: 10, color: hexText, bold: true, transparency: 40 } } },
                    { text: { text: subject.toUpperCase(), options: { x: 9.5, y: 0.25, w: 3, h: 0.3, fontSize: 10, color: hexAccent, align: 'right' } } }
                ]
            });

            const titleSlide = pres.addSlide();
            titleSlide.background = { color: hexBg };

            // Title Slide - Minimalist Premium
            titleSlide.addText(prompt.toUpperCase(), {
                x: 0.5, y: 2.5, w: '90%', h: 2,
                fontSize: 44, color: hexText, bold: true, fontFace, align: 'center', valign: 'middle'
            });

            // Accent line under title
            titleSlide.addShape('line', { x: 4.5, y: 4.5, w: 4.3, h: 0, line: { color: hexAccent, width: 3 } });

            if (subject) {
                titleSlide.addText(subject.toUpperCase(), {
                    x: 0, y: 1.5, w: '100%', h: 0.5,
                    fontSize: 14, color: hexAccent, fontFace, align: 'center', charSpacing: 4
                });
            }

            if (teamMembers) {
                const members = teamMembers.split('\n').filter(m => m.trim());
                titleSlide.addText(members.join('  |  '), {
                    x: 0.5, y: 6, w: '90%', h: 1,
                    fontSize: 12, color: hexText, fontFace, align: 'center', transparency: 30
                });
            }


            slidesData.forEach((slideContent: any, index) => {
                const slide = pres.addSlide({ masterName: 'MASTER_MODERN' });
                const slideImage = images[index % images.length];

                slide.addText(slideContent.title, {
                    x: 0.5, y: 0.5, w: '90%', h: 1,
                    fontSize: 32, color: hexText, bold: true, fontFace
                });

                const bulletPoints = Array.isArray(slideContent.content)
                    ? slideContent.content.map((point: string) => ({ text: point, options: { bullet: { type: 'round', color: hexAccent } } }))
                    : [{ text: String(slideContent.content), options: { bullet: true } }];

                if (slideImage && images.length > 0) {
                    slide.addText(bulletPoints, {
                        x: 0.5, y: 1.8, w: '50%', h: 4.5,
                        fontSize: 18, color: hexText, lineSpacing: 32, fontFace, valign: 'top'
                    });

                    slide.addImage({ data: slideImage, x: '60%', y: 1.8, w: '35%', h: 4 });
                    // Clean border
                    slide.addShape('rect', { x: '60%', y: 1.8, w: '35%', h: 4, line: { color: hexAccent, width: 1, transparency: 50 }, fill: { transparency: 100 } });
                } else {
                    slide.addText(bulletPoints, {
                        x: 0.5, y: 1.8, w: '90%', h: 4.5,
                        fontSize: 20, color: hexText, lineSpacing: 36, fontFace, valign: 'top'
                    });
                }

                // Page Number
                slide.addText(`${index + 1}`, {
                    x: 12.5, y: 7.0, w: 0.5, h: 0.3,
                    fontSize: 10, color: hexAccent, fontFace
                });
            });

            setStatus('Finalizing file...');
            await pres.writeFile({ fileName: `${prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx` });

            setStatus('Presentation Ready');
            setTimeout(() => {
                setIsGenerating(false);
                setStatus('');
            }, 2500);

        } catch (error: any) {
            console.error(error);
            alert("Error: " + error.message);
            setIsGenerating(false);
            setStatus('');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 flex items-center justify-center p-4 lg:p-6 font-sans overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">

            {/* Elegant Background - Deep & Clean */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f12] to-[#050505]"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-[1400px] h-[calc(100vh-220px)] min-h-[600px] grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative">

                {/* --- LEFT PANEL --- */}
                <div className="lg:col-span-4 flex flex-col gap-6 animate-fade-in-up h-full">

                    {/* Header */}
                    <div className="p-1 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-900/20">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">LAVA<span className="font-light text-cyan-400">Slides</span></h1>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 font-medium pl-14">Professional Presentation Suite</p>
                    </div>

                    {/* Controls Card */}
                    <div className="flex-1 bg-[#111114]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl min-h-0">

                        {/* Tab Switcher */}
                        <div className="flex border-b border-white/5 bg-black/20 shrink-0">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${activeTab === 'create' ? 'text-cyan-400 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <LayoutDashboard size={14} /> Content
                                {activeTab === 'create' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('customize')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${activeTab === 'customize' ? 'text-cyan-400 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Settings size={14} /> Style
                                {activeTab === 'customize' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400"></div>}
                            </button>
                        </div>

                        {/* Scrollable Form Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                            {activeTab === 'create' ? (
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Presentation Topic</label>
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Enter your topic..."
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-700 outline-none focus:border-cyan-500/50 focus:bg-black/40 transition-all font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Slides</label>
                                            <input
                                                type="number"
                                                min="3"
                                                max="20"
                                                value={slideCount}
                                                onChange={(e) => setSlideCount(Number(e.target.value))}
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500/50 transition-all font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Domain</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    placeholder="Category"
                                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 pl-10 text-white outline-none focus:border-cyan-500/50 transition-all text-sm"
                                                />
                                                <Briefcase className="absolute left-3 top-4 text-gray-600" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Organization</label>
                                        <input
                                            type="text"
                                            value={college}
                                            onChange={(e) => setCollege(e.target.value)}
                                            placeholder="Company / University"
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500/50 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Authors</label>
                                        <div className="relative">
                                            <textarea
                                                value={teamMembers}
                                                onChange={(e) => setTeamMembers(e.target.value)}
                                                placeholder={"Name 1\nName 2"}
                                                className="w-full min-h-[100px] bg-[#0a0a0a] border border-white/10 rounded-xl p-4 pl-10 text-white outline-none focus:border-cyan-500/50 transition-all text-sm resize-none"
                                            />
                                            <Users className="absolute left-3 top-4 text-gray-600" size={16} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Color Cards */}
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Color Theme</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="group relative h-20 rounded-xl overflow-hidden border border-white/10 cursor-pointer bg-white/5 hover:border-cyan-500/30 transition-all">
                                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                                                    className="absolute inset-0 w-[200%] h-[200%] -top-10 -left-10 cursor-pointer opacity-0" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                                                    <div className="w-6 h-6 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: bgColor }}></div>
                                                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-white">Background</span>
                                                </div>
                                            </div>
                                            <div className="group relative h-20 rounded-xl overflow-hidden border border-white/10 cursor-pointer bg-white/5 hover:border-cyan-500/30 transition-all">
                                                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                                                    className="absolute inset-0 w-[200%] h-[200%] -top-10 -left-10 cursor-pointer opacity-0" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                                                    <div className="w-6 h-6 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: accentColor }}></div>
                                                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-white">Accent</span>
                                                </div>
                                            </div>
                                            <div className="group relative h-12 rounded-xl overflow-hidden border border-white/10 cursor-pointer bg-white/5 hover:border-cyan-500/30 transition-all col-span-2 flex items-center px-4">
                                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                                                    className="absolute inset-0 w-[200%] h-[200%] -top-10 -left-10 cursor-pointer opacity-0" />
                                                <div className="flex items-center gap-3 pointer-events-none w-full">
                                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: textColor }}></div>
                                                    <span className="text-xs font-medium text-gray-400 flex-grow">Text Color</span>
                                                    <span className="text-[10px] text-gray-600 font-mono">{textColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Typography */}
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Typography</label>
                                        <div className="relative">
                                            <select
                                                value={fontFace}
                                                onChange={(e) => setFontFace(e.target.value)}
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl h-12 px-4 text-white focus:border-cyan-500/50 outline-none appearance-none cursor-pointer text-sm"
                                            >
                                                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                            <Type className="absolute right-4 top-3 text-gray-600 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Visual Assets</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="pro-upload"
                                        />
                                        <label
                                            htmlFor="pro-upload"
                                            className="w-full h-24 bg-[#0a0a0a] border border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-900/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                                        >
                                            <ImageIcon className="text-gray-600 group-hover:text-cyan-400 transition-colors" size={24} />
                                            <span className="text-[10px] font-bold text-gray-500 group-hover:text-cyan-300 transition-colors uppercase tracking-wide">{images.length} Images Selected</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Bar & Launch */}
                        <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-md mb-8">
                            <button
                                onClick={generatePPT}
                                disabled={isGenerating}
                                className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-lg ${isGenerating ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-700 to-blue-700 text-white hover:shadow-cyan-500/20 hover:scale-[1.01]'
                                    }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{status || 'Processing...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Generate Presentation</span>
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>

                {/* --- RIGHT PREVIEW (ELEGANT CANVAS) --- */}
                <div className="lg:col-span-8 flex flex-col relative animate-fade-in-up delay-100 h-full">
                    <div className="flex-grow flex items-center justify-center relative p-12 group overflow-hidden rounded-3xl bg-[#0f0f12] border border-white/5 shadow-2xl">

                        {/* Preview Label */}
                        <div className="absolute top-6 left-8 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Live Preview</span>
                        </div>

                        {/* The Slide Canvas */}
                        <div
                            className="relative w-full max-w-4xl aspect-[16/9] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] transition-all duration-500 border border-white/10 rounded-lg overflow-hidden"
                            style={{ backgroundColor: bgColor }}
                        >
                            {/* Content Layer */}
                            <div className="absolute inset-0 p-16 flex flex-col z-10">

                                {/* Header Decoration */}
                                <div className="flex justify-between items-start mb-auto">
                                    <div className="w-16 h-1 bg-gradient-to-r from-transparent to-transparent" style={{ backgroundColor: accentColor }}></div>
                                </div>

                                {/* Main Title Area */}
                                <div className="flex-grow flex flex-col justify-center items-start">
                                    <h1
                                        className="text-6xl font-bold tracking-tight mb-6 leading-tight max-w-3xl"
                                        style={{ color: textColor, fontFamily: fontFace }}
                                    >
                                        {previewTitle}
                                    </h1>

                                    {subject && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-[1px] w-12 bg-white/20"></div>
                                            <h2 className="text-sm font-bold tracking-[0.2em] uppercase opacity-80" style={{ color: accentColor, fontFamily: fontFace }}>{subject}</h2>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Area */}
                                <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-8 opacity-60">
                                    <div className="text-xs font-medium tracking-wide" style={{ color: textColor }}>
                                        {college ? college.toUpperCase() : 'ORGANIZATION NAME'}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold tracking-widest mb-1" style={{ color: accentColor }}>AUTHORS</div>
                                        <div className="text-xs" style={{ color: textColor }}>{teamMembers ? teamMembers.split('\n')[0] : 'Author Name'}</div>
                                    </div>
                                </div>

                            </div>

                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>
                        </div>

                    </div>
                </div>

            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default PPTGenerator;
