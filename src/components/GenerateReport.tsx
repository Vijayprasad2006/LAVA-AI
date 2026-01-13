import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer, PageNumber, NumberFormat } from 'docx';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { Terminal, Activity, Zap, Loader2 } from 'lucide-react';

// Declare Puter global
declare const puter: any;

interface ReportData {
    studentName: string;
    usn: string;
    department: string;
    collegeName: string;
    subject: string;
    semester: string;
    reportTitle: string;
    reportType: string;
    topicDescription: string;
    numPages: number;
    numChapters: number;
    numImages: number;
    numFlowcharts: number;
    pageNumbers: boolean;
    headerFooter: boolean;
    humanize: boolean;
    fontStyle: string;
    chapterHeadingSize: number;
    subheadingSize: number;
    contentFontSize: number;
    textColor: string;
}

const GenerateReport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState('Ready');
    const [logs, setLogs] = useState<string[]>([]);
    const [formData, setFormData] = useState<ReportData>({
        studentName: '',
        usn: '',
        department: '',
        collegeName: '',
        subject: '',
        semester: '',
        reportTitle: '',
        reportType: 'Assignment',
        topicDescription: '',
        numPages: 5,
        numChapters: 3,
        numImages: 2,
        numFlowcharts: 1,
        pageNumbers: true,
        headerFooter: true,
        humanize: false,
        fontStyle: 'Times New Roman',
        chapterHeadingSize: 32,
        subheadingSize: 28,
        contentFontSize: 24,
        textColor: '000000',
    });

    const addLog = (msg: string) => {
        setLogs(prev => [`> [${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
        setProgress(msg);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const generateContent = async () => {
        setLoading(true);
        addLog('Starting report generation...');

        try {
            const {
                studentName, usn, department, collegeName, subject, semester,
                reportTitle, reportType, topicDescription, numChapters,
                humanize, pageNumbers, headerFooter
            } = formData;

            // 1. Generate Chapter Outline
            addLog('Creating chapter outline...');
            const outlinePrompt = `Generate a table of contents for a ${reportType} titled "${reportTitle}" on the topic: "${topicDescription}".
      It must have exactly ${numChapters} chapters.
      Return ONLY a JSON array of strings, e.g., ["Introduction", "Literature Survey", "Methodology", "Conclusion"].
      Do not include any other text.`;

            let chapters: string[] = [];
            try {
                const outlineResponse = await puter.ai.chat(outlinePrompt);
                const jsonMatch = outlineResponse.message.content.match(/\[.*\]/s);
                if (jsonMatch) {
                    chapters = JSON.parse(jsonMatch[0]);
                    addLog(`Outline created: ${chapters.length} chapters found`);
                } else {
                    throw new Error("Invalid outline data received");
                }
            } catch (e) {
                addLog("Outline generation failed. Using default structure.");
                chapters = ["Introduction", "Analysis", "Design", "Implementation", "Conclusion"].slice(0, numChapters);
            }

            if (chapters.length === 0) chapters = ["Introduction"];
            if (chapters.length > 20) chapters = chapters.slice(0, 20);

            // 2. Generate Content
            addLog(`Generating content for ${chapters.length} chapters...`);

            const chapterPromises = chapters.map(async (chapterTitle, i) => {
                try {
                    await new Promise(resolve => setTimeout(resolve, i * 200));

                    const contentPrompt = `Write the content for Chapter ${i + 1}: "${chapterTitle}" for a ${reportType} on "${reportTitle}".
            The content should be detailed, academic, and suitable for an engineering report.
            ${humanize ? 'Write in a natural, human-like tone, avoiding robotic phrasing.' : 'Use standard, strictly formal academic tone.'}
            Include 2-3 subheadings.
            IMPORTANT:
            1. Return purely text.
            2. Mark subheadings as "SUBHEADING: <Title>". 
            3. NO manual numbering.
            4. Strictly black text.`;

                    const contentResponse = await puter.ai.chat(contentPrompt);
                    return { title: chapterTitle, content: contentResponse.message.content };
                } catch (chapterError) {
                    return {
                        title: chapterTitle,
                        content: `SUBHEADING: Content Missing\nGeneration failed. Please fill manually.`
                    };
                }
            });

            const reportContent = await Promise.all(chapterPromises);
            addLog("Content generated. Creating file...");

            // 3. Build DOCX
            const sections = [];

            // -- Styles & Layout (Same rigorous logic as before, just UI changed) --
            const titlePageChildren = [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 400, after: 200 },
                    children: [new TextRun({ text: collegeName, font: formData.fontStyle, size: 32, color: "000000", bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: `Department of ${department}`, font: formData.fontStyle, size: 28, color: "000000" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 800, after: 400 },
                    children: [new TextRun({ text: reportTitle, font: formData.fontStyle, size: 48, color: "000000", bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 1200, after: 200 },
                    children: [new TextRun({ text: `A ${reportType} Submitted by`, font: formData.fontStyle, size: 24, color: "000000" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: studentName, font: formData.fontStyle, size: 28, color: "000000", bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: `(${usn})`, font: formData.fontStyle, size: 24, color: "000000" })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 400 },
                    children: [new TextRun({ text: `Subject: ${subject}`, font: formData.fontStyle, size: 24, color: "000000" })]
                }),
            ];

            if (semester) {
                titlePageChildren.push(
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: semester, font: formData.fontStyle, size: 24, color: "000000" })]
                    })
                )
            }

            sections.push({
                properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
                children: titlePageChildren,
            });

            const chapterChildren: any[] = [];
            let imagesAdded = 0;
            let flowchartsAdded = 0;

            reportContent.forEach((chapter, index) => {
                chapterChildren.push(new Paragraph({ pageBreakBefore: true }));
                chapterChildren.push(
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 100 },
                        children: [new TextRun({ text: `CHAPTER ${index + 1}`, font: formData.fontStyle, size: 32, bold: true, color: "000000" })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 400 },
                        children: [new TextRun({ text: chapter.title.toUpperCase(), font: formData.fontStyle, size: 32, bold: true, color: "000000" })]
                    })
                );

                const lines = chapter.content.split('\n');
                let subheadingCount = 1;

                lines.forEach((line: string) => {
                    let trimmedLine = line.trim();
                    if (!trimmedLine) return;
                    if (trimmedLine.toLowerCase() === chapter.title.toLowerCase()) return;
                    if (/^chapter\s+\d+$/i.test(trimmedLine)) return;

                    if (trimmedLine.startsWith('SUBHEADING:')) {
                        let subheadingTitle = trimmedLine.replace('SUBHEADING:', '').trim().replace(/^[\d\.]+\s+/, '');
                        chapterChildren.push(
                            new Paragraph({
                                alignment: AlignmentType.LEFT,
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 240, after: 120 },
                                children: [new TextRun({ text: `${index + 1}.${subheadingCount} ${subheadingTitle}`, font: formData.fontStyle, size: 28, bold: true, color: "000000" })]
                            })
                        );
                        subheadingCount++;
                    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                        chapterChildren.push(new Paragraph({ bullet: { level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: { line: 360 }, children: [new TextRun({ text: trimmedLine.substring(2).trim(), font: formData.fontStyle, size: 24, color: "000000" })] }));
                    } else {
                        chapterChildren.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 200 }, children: [new TextRun({ text: trimmedLine, font: formData.fontStyle, size: 24, color: "000000" })] }));
                    }
                });

                if (imagesAdded < formData.numImages && (index + 1) % Math.ceil(formData.numChapters / formData.numImages) === 0) {
                    chapterChildren.push(
                        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `[INSERT FIGURE ${index + 1}.1 HERE]`, color: 'FF0000', bold: true, size: 24 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: `Figure ${index + 1}.1: Illustrative diagram for ${chapter.title}`, italics: true, size: 20, color: "000000" })] })
                    );
                    imagesAdded++;
                }
                if (flowchartsAdded < formData.numFlowcharts && index === Math.floor(formData.numChapters / 2)) {
                    chapterChildren.push(
                        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `[INSERT FLOWCHART ${index + 1}.2 HERE]`, color: '0000FF', bold: true, size: 24 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: `Figure ${index + 1}.2: Process Flowchart`, italics: true, size: 20, color: "000000" })] })
                    );
                    flowchartsAdded++;
                }
            });

            sections.push({
                properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL, } } },
                headers: headerFooter ? { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: collegeName || reportTitle, size: 18, color: "000000" })] })] }) } : undefined,
                footers: pageNumbers ? { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 24, color: "000000" })] })] }) } : undefined,
                children: chapterChildren
            });

            const doc = new Document({ sections: sections });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${studentName.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}.docx`);
            addLog("Report ready. Downloading...");
            setProgress('Done');
        } catch (error: any) {
            addLog(`Error: ${error.message}`);
            setProgress('Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-cyan-500 font-mono p-4 selection:bg-cyan-500 selection:text-black overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900 via-black to-black"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-end border-b-2 border-cyan-800 pb-4 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center gap-3">
                            <Terminal className="text-cyan-500" size={40} /> REPORT GENERATOR
                        </h1>
                        <p className="text-xs md:text-sm text-cyan-700 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            AI ACADEMIC ASSISTANT // READY
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-xs text-cyan-900">IP: 192.168.X.X</p>
                        <p className="text-xs text-cyan-900">LATENCY: 12ms</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* LEFT: INPUT CONSOLE */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Section 1: Target Identity */}
                        <SectionBox title="Student Information" delay={0.1}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <HackerInput label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter your name" />
                                <HackerInput label="USN" name="usn" value={formData.usn} onChange={handleChange} placeholder="Enter USN" />
                                <HackerInput label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Department (e.g. CSE)" />
                                <HackerInput label="College Name" name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Enter college name" />
                                <HackerInput label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject Name" />
                                <HackerInput label="Semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="Semester (e.g. 5th)" />
                            </div>
                        </SectionBox>

                        {/* Section 2: Core Data */}
                        <SectionBox title="Report Details" delay={0.2}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <HackerInput label="Report Title" name="reportTitle" value={formData.reportTitle} onChange={handleChange} placeholder="Enter report title" />
                                <div>
                                    <label className="block text-xs font-bold text-cyan-600 mb-1 tracking-widest">Report Type</label>
                                    <select
                                        name="reportType"
                                        value={formData.reportType}
                                        onChange={handleChange}
                                        className="w-full h-10 bg-black border border-cyan-800 text-cyan-400 px-3 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] outline-none transition-all appearance-none"
                                    >
                                        <option>Assignment</option>
                                        <option>Lab Report</option>
                                        <option>Mini Project</option>
                                        <option>Internship Report</option>
                                        <option>Seminar Report</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-cyan-600 mb-1 tracking-widest">Topic Description</label>
                                <textarea
                                    name="topicDescription"
                                    value={formData.topicDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-black border border-cyan-800 text-cyan-400 px-3 py-2 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] outline-none transition-all resize-none"
                                    placeholder="Describe what the report is about..."
                                />
                            </div>
                        </SectionBox>

                        {/* Section 3: Advanced Config */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SectionBox title="Report Settings" delay={0.3}>
                                <div className="grid grid-cols-2 gap-4">
                                    <HackerInput label="No. of Chapters" name="numChapters" type="number" value={formData.numChapters} onChange={handleChange} />
                                    <HackerInput label="No. of Pages" name="numPages" type="number" value={formData.numPages} onChange={handleChange} />
                                    <HackerInput label="Images Count" name="numImages" type="number" value={formData.numImages} onChange={handleChange} />
                                    <HackerInput label="Flowcharts" name="numFlowcharts" type="number" value={formData.numFlowcharts} onChange={handleChange} />
                                </div>
                            </SectionBox>

                            <SectionBox title="Formatting Options" delay={0.4}>
                                <div className="space-y-4">
                                    <HackerToggle label="Page Numbers" name="pageNumbers" checked={formData.pageNumbers} onChange={handleChange} />
                                    <HackerToggle label="Header & Footer" name="headerFooter" checked={formData.headerFooter} onChange={handleChange} />
                                    <HackerToggle label="Humanize Content" name="humanize" checked={formData.humanize} onChange={handleChange} warning="Makes content sound natural" />

                                    <div className="mt-4 pt-4 border-t border-cyan-900">
                                        <label className="block text-xs font-bold text-cyan-600 mb-1 tracking-widest">Font Style</label>
                                        <div className="flex gap-2">
                                            {['Times New Roman', 'Arial', 'Calibri'].map(font => (
                                                <button
                                                    key={font}
                                                    onClick={() => setFormData(p => ({ ...p, fontStyle: font }))}
                                                    className={`px-3 py-1 text-xs border ${formData.fontStyle === font ? 'bg-cyan-900 border-cyan-400 text-white' : 'border-cyan-900 text-cyan-700 hover:border-cyan-600'}`}
                                                >
                                                    {font.split(' ')[0].toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SectionBox>
                        </div>

                    </div>

                    {/* RIGHT: SYSTEM STATUS / LOGS */}
                    <div className="lg:col-span-1 space-y-6">
                        <SectionBox title="Generation Status" delay={0.5} className="h-full flex flex-col">
                            <div className="flex-1 min-h-[200px] bg-black border border-cyan-900 p-4 font-mono text-xs overflow-y-auto mb-4 relative">
                                <div className="absolute top-0 right-0 p-1">
                                    <Activity className="text-green-500 animate-pulse" size={16} />
                                </div>
                                <div className="space-y-1">
                                    {logs.length === 0 && <span className="text-gray-600 animate-pulse">Ready to generate...</span>}
                                    {logs.map((log, i) => (
                                        <div key={i} className={`truncate ${i === 0 ? 'text-green-400' : 'text-cyan-800'}`}>{log}</div>
                                    ))}
                                </div>
                                {/* Scanline overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent pointer-events-none bg-[length:100%_4px] animate-scan"></div>
                            </div>

                            <div className="border border-cyan-800 p-4 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-cyan-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <h4 className="text-cyan-400 text-xs font-bold mb-2">CPU_LOAD</h4>
                                <div className="w-full bg-cyan-900/30 h-2 mt-1">
                                    <motion.div
                                        className="h-full bg-cyan-500"
                                        animate={{ width: loading ? ["10%", "80%", "40%", "90%"] : "5%" }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                </div>
                                <h4 className="text-cyan-400 text-xs font-bold mt-4 mb-2">NET_TRAFFIC</h4>
                                <div className="w-full bg-cyan-900/30 h-2 mt-1">
                                    <motion.div
                                        className="h-full bg-green-500"
                                        animate={{ width: ["20%", "40%", "60%", "30%"] }}
                                        transition={{ repeat: Infinity, duration: 3 }}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generateContent}
                                disabled={loading}
                                className={`w-full mt-auto py-5 relative group overflow-hidden border ${loading ? 'border-gray-700 text-gray-700 cursor-not-allowed' : 'border-cyan-500 text-cyan-400 hover:text-black'}`}
                            >
                                <div className={`absolute inset-0 ${loading ? 'bg-gray-900' : 'bg-cyan-500 translate-y-full group-hover:translate-y-0'} transition-transform duration-300`}></div>
                                <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-widest text-lg">
                                    {loading ? <Loader2 className="animate-spin" /> : <Zap className={loading ? "" : "group-hover:fill-black"} />}
                                    {loading ? 'PROCESSING...' : 'GENERATE REPORT'}
                                </span>
                            </motion.button>

                            <div className="mt-2 text-center">
                                <span className="text-[10px] text-cyan-900 uppercase tracking-[0.2em]">{progress}</span>
                            </div>

                        </SectionBox>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- CYBERPUNK COMPONENTS ---

const SectionBox = ({ title, children, delay = 0, className = "" }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4 }}
        className={`bg-black/50 border border-cyan-900/50 p-6 relative backdrop-blur-sm ${className}`}
    >
        {/* Decor Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></div>

        <h3 className="text-cyan-500 font-bold mb-6 flex items-center gap-2 tracking-wider text-sm border-b border-cyan-900/50 pb-2">
            <span className="text-cyan-800">//</span> {title}
        </h3>
        {children}
    </motion.div>
);

const HackerInput = ({ label, ...props }: any) => (
    <div className="relative group">
        <label className="block text-xs font-bold text-cyan-600 mb-1 tracking-widest transition-colors group-focus-within:text-cyan-400">
            {label}
        </label>
        <input
            {...props}
            className={`w-full bg-black border border-cyan-800 text-cyan-400 px-3 h-10 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] outline-none transition-all placeholder-cyan-900/50 text-sm`}
        />
    </div>
);

const HackerToggle = ({ label, warning, ...props }: any) => (
    <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-cyan-900/10 border border-transparent hover:border-cyan-900/30 transition-all">
        <div>
            <span className="text-cyan-600 font-bold text-xs tracking-wider group-hover:text-cyan-400 transition-colors">{label}</span>
            {warning && <span className="block text-[10px] text-red-500 mt-1 animate-pulse">{warning}</span>}
        </div>
        <div className="relative">
            <input type="checkbox" className="sr-only peer" {...props} />
            <div className="w-10 h-5 bg-gray-900 peer-focus:outline-none border border-cyan-900 peer-checked:border-cyan-400 peer-checked:bg-cyan-900/50 transition-all">
                <div className="absolute top-1 left-1 bg-cyan-700 w-3 h-3 transition-all peer-checked:translate-x-full peer-checked:bg-cyan-400 peer-checked:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            </div>
        </div>
    </label>
);

export default GenerateReport;
