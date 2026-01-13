import React, { useState } from 'react';
import {
    Layout,
    Type,
    Image as ImageIcon,
    Square,
    Download,
    Plus,
    Minus,
    Maximize,
    Undo,
    Redo,
    FileText,
    Grid,
    Search,
    Trash2,
    Copy,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Sparkles,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// --- GLOBALS ---
declare const puter: any;

// --- TYPES ---
interface Page {
    id: string;
    elements: string[]; // Ordered list of element IDs on this page
}

interface CanvasElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    content: string;
    style: React.CSSProperties;
    pageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ReportTemplate {
    id: string;
    name: string;
    icon: any;
    color: string;
    elements: Record<string, CanvasElement>;
    pages: Page[];
}

// --- TEMPLATE DATA ---
const REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: 'imported-doc-1',
        name: 'Research Paper (BirdNET)',
        icon: <FileText size={24} />,
        color: 'from-indigo-500 to-purple-500',
        pages: [
            { id: 'p1', elements: ['t1', 't2', 't3'] },
            { id: 'p2', elements: ['ref1', 'ref2', 'ref3'] }
        ],
        elements: {
            // Page 1: Title & Intro
            't1': { id: 't1', type: 'text', content: 'BirdNET: Acoustic Species Embedding', pageId: 'p1', x: 100, y: 100, width: 600, height: 60, style: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', color: '#000000' } },
            't2': { id: 't2', type: 'text', content: 'Abstract', pageId: 'p1', x: 100, y: 200, width: 600, height: 30, style: { fontSize: '18px', fontWeight: 'bold', textAlign: 'left', color: '#000000' } },
            't3': { id: 't3', type: 'text', content: 'This paper discusses time-frequency representations which allow neural networks to capture acoustic features effectively...', pageId: 'p1', x: 100, y: 240, width: 600, height: 100, style: { fontSize: '14px', textAlign: 'justify', color: '#333333' } },

            // Page 2: References (Extracted Content)
            'ref1': { id: 'ref1', type: 'text', content: 'References', pageId: 'p2', x: 100, y: 80, width: 600, height: 40, style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'left', color: '#000000' } },
            'ref2': { id: 'ref2', type: 'text', content: 'BirdNET Research Group. (2022). BirdNET acoustic species embedding. Frontiers in Artificial Intelligence.', pageId: 'p2', x: 100, y: 140, width: 600, height: 60, style: { fontSize: '14px', textAlign: 'left', color: '#333333' } },
            'ref3': { id: 'ref3', type: 'text', content: 'Sahoo, A. (2023). IBC53 Indian Bird Call Dataset. Kaggle.', pageId: 'p2', x: 100, y: 220, width: 600, height: 40, style: { fontSize: '14px', textAlign: 'left', color: '#333333' } },
        }
    }
];


// --- MAIN COMPONENT ---
const BuildReport: React.FC = () => {
    // --- STATE ---
    const [zoom, setZoom] = useState(100);
    const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'text' | 'uploads'>('templates'); // Default to templates for visibility
    const [pages, setPages] = useState<Page[]>([{ id: 'page-1', elements: [] }]);
    const [elements, setElements] = useState<Record<string, CanvasElement>>({});
    const [selection, setSelection] = useState<string | null>(null);

    // --- AI STATE ---
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiPageCount, setAiPageCount] = useState(1);
    const [aiLoading, setAiLoading] = useState(false);

    // --- ACTIONS ---
    const addPage = () => {
        setPages(prev => [...prev, { id: `page-${Date.now()}`, elements: [] }]);
    };

    const deletePage = (pageId: string) => {
        if (pages.length <= 1) return;
        setPages(prev => prev.filter(p => p.id !== pageId));
    };

    const duplicatePage = (pageId: string) => {
        const pageToClone = pages.find(p => p.id === pageId);
        if (!pageToClone) return;

        const newPageId = `page-${Date.now()}`;
        const newElementsMap: Record<string, CanvasElement> = {};
        const newElementIds: string[] = [];

        pageToClone.elements.forEach(elId => {
            const el = elements[elId];
            if (el) {
                const newElId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                newElementsMap[newElId] = { ...el, id: newElId, pageId: newPageId };
                newElementIds.push(newElId);
            }
        });

        setElements(prev => ({ ...prev, ...newElementsMap }));
        setPages(prev => {
            const index = prev.findIndex(p => p.id === pageId);
            const newPage = { id: newPageId, elements: newElementIds };
            const newPages = [...prev];
            newPages.splice(index + 1, 0, newPage);
            return newPages;
        });
    };

    const loadTemplate = (template: ReportTemplate) => {
        if (window.confirm("Loading a template will replace your current work. Continue?")) {
            // Regeneration of IDs to ensure uniqueness if template loaded multiple times (optional, but good practice)
            // For simplicity, we just deep copy here.
            setPages(JSON.parse(JSON.stringify(template.pages)));
            setElements(JSON.parse(JSON.stringify(template.elements)));
            setSelection(null);
        }
    };

    const addElement = (pageId: string, type: 'text' | 'image' | 'shape') => {
        const id = `el-${Date.now()}`;
        const newEl: CanvasElement = {
            id,
            type,
            content: type === 'text' ? 'Double click to edit' : '',
            pageId,
            x: 50,
            y: 50,
            width: type === 'text' ? 300 : 150,
            height: type === 'text' ? 50 : 150,
            style: {
                backgroundColor: type === 'shape' ? '#cccccc' : undefined,
                fontSize: '16px',
                color: '#000000',
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                textAlign: 'left'
            }
        };

        setElements(prev => ({ ...prev, [id]: newEl }));
        setPages(prev => prev.map(p => p.id === pageId ? { ...p, elements: [...p.elements, id] } : p));
        setSelection(id);
    };

    const updateElementStyle = (key: keyof React.CSSProperties, value: any) => {
        if (!selection) return;
        setElements(prev => ({
            ...prev,
            [selection]: {
                ...prev[selection],
                style: { ...prev[selection].style, [key]: value }
            }
        }));
    };

    const deleteSelectedElement = () => {
        if (!selection) return;
        const el = elements[selection];
        if (!el) return;

        setPages(prev => prev.map(p => p.id === el.pageId ? { ...p, elements: p.elements.filter(id => id !== selection) } : p));
        setElements(prev => {
            const next = { ...prev };
            delete next[selection];
            return next;
        });
        setSelection(null);
        setSelection(null);
    };

    // --- AI WRITER ---
    const handleAIGenerate = async () => {
        if (!aiPrompt) return;
        setAiLoading(true);
        try {
            // 1. Generate text using Puter
            const prompt = `Write a comprehensive, academic report section on the topic: "${aiPrompt}".
            It must be long enough to fill approximately ${aiPageCount} A4 pages (about ${aiPageCount * 500} words).
            Format the output as clear paragraphs.
            Do not encompass it in quotes.
            Return ONLY the text content.`;

            const response = await puter.ai.chat(prompt);
            const text = response.message.content;

            // 2. Split text into chunks (naive page split)
            // Approx 1500 characters per page is a safe conservative estimate for 12pt font
            const charsPerPage = 1500;
            const chunks = [];
            for (let i = 0; i < text.length; i += charsPerPage) {
                chunks.push(text.substring(i, i + charsPerPage));
            }

            // 3. Create pages and place text
            const newPages: Page[] = [];
            const newElementsMap: Record<string, CanvasElement> = {};

            chunks.forEach((chunk, index) => {
                // If user requested more pages than text generated, or vice versa, we adapt.
                // But we limit to the requested page count if the text is short, or extend if long?
                // For now, let's just create as many pages as needed for the text.

                const pageId = `page-ai-${Date.now()}-${index}`;
                const elementId = `el-ai-${Date.now()}-${index}`;

                newElementsMap[elementId] = {
                    id: elementId,
                    type: 'text',
                    content: chunk, // The AI text chunk
                    pageId: pageId,
                    x: 50,
                    y: 50,
                    width: 700, // A4 width minus margins approx
                    height: 1000, // Full page height approx
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Times New Roman',
                        color: '#000000',
                        textAlign: 'justify',
                        lineHeight: '1.5'
                    }
                };

                newPages.push({ id: pageId, elements: [elementId] });
            });

            // Update state
            setElements(prev => ({ ...prev, ...newElementsMap }));
            setPages(prev => [...prev, ...newPages]);
            setIsAIModalOpen(false);
            setAiPrompt('');
            setAiPageCount(1);
            alert(`Generated ${newPages.length} pages of content!`);

        } catch (error) {
            console.error("AI Generation Failed:", error);
            alert("Failed to generate content. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    // --- DATA EXPORT ENGINE ---
    const exportToDocx = async () => {
        try {
            const docSections = [];

            for (const page of pages) {
                const pageElements = page.elements.map(id => elements[id]).filter(Boolean);

                // "Smart Flow" Logic
                pageElements.sort((a, b) => a.y - b.y);

                const children = pageElements.map(el => {
                    if (el.type === 'image') {
                        return new Paragraph({ children: [new TextRun("[IMAGE PLACEHOLDER]")] });
                    } else if (el.type === 'text') {
                        let headingLevel = undefined;
                        const fontSize = parseInt((el.style.fontSize as string)?.replace('px', '') || '16');
                        if (fontSize >= 32) headingLevel = HeadingLevel.HEADING_1;
                        else if (fontSize >= 24) headingLevel = HeadingLevel.HEADING_2;

                        return new Paragraph({
                            heading: headingLevel,
                            alignment: el.style.textAlign === 'center' ? AlignmentType.CENTER : el.style.textAlign === 'right' ? AlignmentType.RIGHT : AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: el.content || "",
                                    size: fontSize * 2,
                                    color: (el.style.color as string)?.replace('#', '') || "000000",
                                    bold: el.style.fontWeight === 'bold',
                                    italics: el.style.fontStyle === 'italic',
                                    underline: el.style.textDecoration === 'underline' ? {} : undefined,
                                })
                            ],
                            spacing: { after: 200 }
                        });
                    } else {
                        return new Paragraph({});
                    }
                });

                if (children.length === 0) children.push(new Paragraph(""));

                docSections.push({
                    properties: {
                        page: {
                            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                        }
                    },
                    children: children
                });
            }

            const doc = new Document({
                sections: docSections
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, "LavaDocs_Report.docx");
        } catch (e) {
            console.error("Export Failed", e);
            alert("Export failed. Please check console.");
        }
    };

    // --- DRAG LOGIC ---
    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('text/plain', id);
        setSelection(id);
    };

    const handleDrop = (e: React.DragEvent, pageId: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (!id || !elements[id]) return;

        setElements(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                pageId,
                x: prev[id].x + 10,
                y: prev[id].y + 10
            }
        }));

        const oldPageId = elements[id].pageId;
        if (oldPageId !== pageId) {
            setPages(prev => prev.map(p => {
                if (p.id === oldPageId) return { ...p, elements: p.elements.filter(elId => elId !== id) };
                if (p.id === pageId) return { ...p, elements: [...p.elements, id] };
                return p;
            }));
        }
    };

    // --- UI HELPERS ---
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 25));

    const selectedElement = selection ? elements[selection] : null;

    return (
        <div className="flex flex-col h-screen bg-[#0e1015] text-white font-sans overflow-hidden" onKeyDown={(e) => { if (e.key === 'Delete') deleteSelectedElement(); }}>

            {/* TOP BAR */}
            <div className="h-14 bg-gradient-to-r from-[#00c4cc] to-[#5433ff] flex items-center justify-between px-4 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <FileText className="fill-white" /> LAVA Docs
                    </div>
                    <div className="h-6 w-[1px] bg-white/20"></div>
                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg hover:shadow-pink-500/25 transition transform hover:scale-105"
                    >
                        <Sparkles size={14} /> Magic Write
                    </button>
                </div>
                <div className="flex items-center gap-2 bg-[#000000]/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10"><span className="text-sm font-medium truncate max-w-[200px]">Untitled Report</span></div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-white/10 rounded-full transition"><Undo size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition"><Redo size={18} /></button>
                    <button onClick={exportToDocx} className="bg-white text-black px-4 py-1.5 rounded font-bold text-sm hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
                        <Download size={16} /> Export DOCX
                    </button>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* LEFT SIDEBAR */}
                <div className="w-[72px] bg-[#18191b] flex flex-col items-center py-4 gap-4 z-40 border-r border-white/5">
                    <SidebarTab icon={<Layout size={24} />} label="Templates" active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
                    <SidebarTab icon={<Grid size={24} />} label="Elements" active={activeTab === 'elements'} onClick={() => setActiveTab('elements')} />
                    <SidebarTab icon={<Type size={24} />} label="Text" active={activeTab === 'text'} onClick={() => setActiveTab('text')} />
                    <SidebarTab icon={<ImageIcon size={24} />} label="Uploads" active={activeTab === 'uploads'} onClick={() => setActiveTab('uploads')} />
                </div>

                {/* SIDEBAR DRAWER */}
                <motion.div initial={false} animate={{ width: 360 }} className="bg-[#252627] border-r border-white/5 flex flex-col z-30 shadow-xl">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="font-bold text-lg capitalize mb-4">{activeTab}</h2>
                        <div className="relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={16} /><input type="text" placeholder={`Search ${activeTab}...`} className="w-full bg-[#18191b] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#00c4cc] transition" /></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 content-start">
                        {/* TEMPLATE TAB */}
                        {activeTab === 'templates' && (
                            <div className="grid grid-cols-2 gap-3">
                                {REPORT_TEMPLATES.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => loadTemplate(t)}
                                        className="bg-[#18191b] rounded-lg overflow-hidden border border-white/5 hover:border-[#00c4cc] hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition group"
                                    >
                                        <div className={`h-24 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                                            <div className="text-white drop-shadow-md transform group-hover:scale-110 transition">{t.icon}</div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-semibold text-sm truncate">{t.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">A4 Report</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'elements' && (
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => addElement(pages[0].id, 'shape')} className="aspect-square bg-[#18191b] rounded hover:bg-[#333] cursor-pointer flex flex-col items-center justify-center gap-2 transition border border-transparent hover:border-gray-600">
                                    <Square size={32} /> <span className="text-xs text-gray-400">Box</span>
                                </button>
                            </div>
                        )}
                        {activeTab === 'text' && (
                            <div className="space-y-2">
                                <button onClick={() => addElement(pages[0].id, 'text')} className="w-full text-left bg-[#18191b] p-4 rounded hover:bg-[#333] cursor-pointer border border-transparent hover:border-gray-600">
                                    <h1 className="text-2xl font-bold">Add a heading</h1>
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* CANVAS AREA */}
                <div className="flex-1 bg-[#f1f2f6] relative overflow-hidden flex flex-col">
                    {/* PROPERTIES PANEL / TOOLBAR */}
                    <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-4 text-gray-700 shadow-sm z-20">
                        {selection && selectedElement ? (
                            <>
                                <button onClick={deleteSelectedElement} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                <div className="h-4 w-[1px] bg-gray-300" />

                                {/* Font & Size */}
                                <select className="bg-transparent text-sm font-medium hover:bg-gray-100 p-1 rounded"><option>Open Sans</option></select>
                                <div className="w-[1px] h-4 bg-gray-300" />
                                <select
                                    className="bg-transparent text-sm font-medium hover:bg-gray-100 p-1 rounded"
                                    value={selectedElement.style.fontSize}
                                    onChange={(e) => updateElementStyle('fontSize', e.target.value)}
                                >
                                    {[12, 14, 16, 18, 24, 32, 48, 64].map(s => <option key={s} value={`${s}px`}>{s}</option>)}
                                </select>

                                <div className="h-4 w-[1px] bg-gray-300" />

                                {/* Styling (Bold, Italic, Underline) */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => updateElementStyle('fontWeight', selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold')}
                                        className={`p-1 rounded ${selectedElement.style.fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <Bold size={16} />
                                    </button>
                                    <button
                                        onClick={() => updateElementStyle('fontStyle', selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic')}
                                        className={`p-1 rounded ${selectedElement.style.fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <Italic size={16} />
                                    </button>
                                    <button
                                        onClick={() => updateElementStyle('textDecoration', selectedElement.style.textDecoration === 'underline' ? 'none' : 'underline')}
                                        className={`p-1 rounded ${selectedElement.style.textDecoration === 'underline' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <Underline size={16} />
                                    </button>
                                </div>

                                <div className="h-4 w-[1px] bg-gray-300" />

                                {/* Alignment */}
                                <div className="flex items-center gap-1">
                                    <button onClick={() => updateElementStyle('textAlign', 'left')} className={`p-1 rounded ${selectedElement.style.textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><AlignLeft size={16} /></button>
                                    <button onClick={() => updateElementStyle('textAlign', 'center')} className={`p-1 rounded ${selectedElement.style.textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><AlignCenter size={16} /></button>
                                    <button onClick={() => updateElementStyle('textAlign', 'right')} className={`p-1 rounded ${selectedElement.style.textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><AlignRight size={16} /></button>
                                </div>

                                <div className="h-4 w-[1px] bg-gray-300" />

                                {/* Color Picker */}
                                <input
                                    type="color"
                                    value={selectedElement.style.color as string}
                                    onChange={(e) => updateElementStyle('color', e.target.value)}
                                    className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                                />

                            </>
                        ) : (
                            <span className="text-gray-400 text-sm">Select an element to edit styles</span>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto p-12 flex justify-center items-start bg-[#edeff3]">
                        <div className="transition-transform duration-200 ease-out origin-top space-y-8 pb-20" style={{ transform: `scale(${zoom / 100})` }}>
                            {pages.map((page, index) => (
                                <div key={page.id} className="relative group">
                                    <div className="absolute -top-6 left-0 text-xs font-bold text-gray-500 uppercase tracking-widest">Page {index + 1}</div>
                                    <div
                                        className="bg-white shadow-xl transition-shadow hover:shadow-2xl relative overflow-hidden"
                                        style={{ width: '210mm', height: '297mm', padding: '0mm' }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, page.id)}
                                        onClick={() => setSelection(null)}
                                    >
                                        {/* Blank State (only if no elements) */}
                                        {page.elements.length === 0 && (
                                            <div className="h-full flex items-center justify-center opacity-10 pointer-events-none">
                                                <div className="text-center"><FileText size={48} className="mx-auto mb-2 text-gray-400" /><p className="text-2xl font-bold text-gray-300">Blank Page</p></div>
                                            </div>
                                        )}
                                        {page.elements.map(elId => {
                                            const el = elements[elId];
                                            if (!el) return null;
                                            return (
                                                <div
                                                    key={elId}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, elId)}
                                                    onClick={(e) => { e.stopPropagation(); setSelection(elId); }}
                                                    className={`absolute cursor-move group-element ${selection === elId ? 'ring-2 ring-[#00c4cc]' : 'hover:ring-1 hover:ring-blue-300'}`}
                                                    style={{
                                                        left: el.x,
                                                        top: el.y,
                                                        width: el.width,
                                                        height: el.height,
                                                        ...el.style
                                                    }}
                                                >
                                                    {el.type === 'text' ? (
                                                        <div
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => setElements(prev => ({ ...prev, [elId]: { ...prev[elId], content: e.currentTarget.textContent || "" } }))}
                                                            className="w-full h-full outline-none"
                                                            style={{
                                                                fontFamily: 'inherit',
                                                                color: 'inherit',
                                                                fontWeight: 'inherit',
                                                                fontStyle: 'inherit',
                                                                textDecoration: 'inherit',
                                                                textAlign: el.style.textAlign as any
                                                            }}
                                                        >
                                                            {el.content}
                                                        </div>
                                                    ) : el.type === 'shape' ? (
                                                        <div className="w-full h-full bg-gray-300" style={{ backgroundColor: el.style.backgroundColor }} />
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="absolute top-2 -right-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={addPage} className="p-2 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600"><Plus size={16} /></button>
                                        <button onClick={() => duplicatePage(page.id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600"><Copy size={16} /></button>
                                        <button onClick={() => deletePage(page.id)} className="p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center opacity-50 hover:opacity-100 transition"><button onClick={addPage} className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow text-gray-600 font-medium hover:bg-gray-50"><Plus size={18} /> Add Page</button></div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-200 text-gray-700">
                        <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded-full"><Minus size={14} /></button>
                        <span className="text-xs font-bold w-8 text-center">{zoom}%</span>
                        <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded-full"><Plus size={14} /></button>
                        <div className="w-[1px] h-4 bg-gray-300"></div>
                        <button className="p-1 hover:bg-gray-100 rounded-full"><Maximize size={14} /></button>
                    </div>
                </div>
            </div>

            {/* AI MODAL */}
            <AnimatePresence>
                {isAIModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#18191b] border border-white/10 rounded-xl shadow-2xl max-w-lg w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Magic Writer</h2>
                                    <p className="text-xs text-gray-400">AI-powered content generation</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">What should I write about?</label>
                                    <textarea
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="E.g. Introduction to Renewable Energy sources..."
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-pink-500 focus:outline-none min-h-[100px] text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Number of Pages needed</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={aiPageCount}
                                        onChange={(e) => setAiPageCount(parseInt(e.target.value))}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-pink-500 focus:outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button
                                    onClick={() => setIsAIModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAIGenerate}
                                    disabled={!aiPrompt || aiLoading}
                                    className={`flex-1 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-bold shadow-lg hover:shadow-pink-500/25 transition flex items-center justify-center gap-2 ${aiLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    {aiLoading ? 'Writing...' : 'Generate Content'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

const SidebarTab = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full py-3 gap-1 transition-colors relative ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00c4cc] rounded-r"></div>}{icon}<span className="text-[10px] font-medium">{label}</span></button>
)

export default BuildReport;
