import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import cheatingVideo from '../assets/Cheating Karta Hai Tu Meme Template Download _Timesofcontent.mp4';
import { FileText, Eye, Stethoscope, Download, Loader2, Activity, User, Calendar, MapPin, Hash, ShieldCheck } from 'lucide-react';

type TemplateType = 'eye-record' | 'prescription' | 'record';

// --- UI COMPONENTS (Moved Outside) ---

const InputGroup = ({ label, name, value, type = "text", placeholder, onChange, className = "", icon: Icon }: any) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3 text-gray-500" />}
            {label}
        </label>
        <div className="relative group">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-[#09090b] border border-white/5 rounded-md px-3 py-2.5 text-sm text-gray-200 placeholder-gray-700 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
            />
        </div>
    </div>
);

const TextAreaGroup = ({ label, name, value, rows, placeholder, onChange, icon: Icon }: any) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3 text-gray-500" />}
            {label}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-[#09090b] border border-white/5 rounded-md px-3 py-2.5 text-sm text-gray-200 placeholder-gray-700 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono resize-none leading-relaxed"
        />
    </div>
);

const MedicalReports = () => {
    const [activeTemplate, setActiveTemplate] = useState<TemplateType>('eye-record');
    const [isDownloading, setIsDownloading] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Consolidated State
    const [formData, setFormData] = useState({
        // Common
        patientName: '',
        age: '',
        sex: 'M',
        date: new Date().toISOString().split('T')[0],
        doctorName: 'RAJESH BABY',
        hospitalName: 'DRISHTI EYE HOSPITAL',

        // Eye Record Specific
        mrdNo: '1001257775',
        mobile: '9988776655',
        location: 'DEVANAHALLI',

        // Vision Table Data
        vision: {
            re: { dist: '6/12', near: 'N6', sph: 'Pl', cyl: '-1.50', axis: '20', va: '6/9' },
            le: { dist: '6/18', near: 'N8', sph: 'Pl', cyl: '-1.50', axis: '170', va: '6/12' },
            add: { re: '', le: '' },
            iop: { re: '13', le: '15' }
        },

        // Clinical Notes
        history: 'c/o DOV for distance since 3 months',
        findings: 'RE\n+ Papilla\nSteep\nCornea\n\nLE',
        diagnosis: 'RE: Keratoconus\nHigh Myopia',
        medication: 'PMT Tomorrow.\n\nAllergan Eye Drops (BE)\n1-0-1 (2 months)',
        review: '3w',

        // Prescription Specific
        medicines: [{ name: '', dosage: '', duration: '' }],
        diagnosis_rx: '',
        prescriptionAdvice: '',

        // Outpatient Record Specific
        patientId: '',
        recordHistory: '',
        vitals: { bp: '', pulse: '', temp: '', weight: '' },
        recordAdvice: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const parts = name.split('.');
            if (parts.length === 2) {
                const [parent, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: { ...(prev as any)[parent], [child]: value }
                }));
            } else if (parts.length === 3) {
                const [grand, parent, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [grand]: {
                        ...(prev as any)[grand],
                        [parent]: { ...(prev as any)[grand][parent], [child]: value }
                    }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMedicineChange = (index: number, field: string, value: string) => {
        const newMedicines = [...formData.medicines];
        (newMedicines[index] as any)[field] = value;
        setFormData({ ...formData, medicines: newMedicines });
    };

    const addMedicine = () => {
        setFormData({ ...formData, medicines: [...formData.medicines, { name: '', dosage: '', duration: '' }] });
    };

    const removeMedicine = (index: number) => {
        const newMedicines = formData.medicines.filter((_, i) => i !== index);
        setFormData({ ...formData, medicines: newMedicines });
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsDownloading(true);
        try {
            // Wait a moment for UI
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create a clone of the element
            const originalElement = previewRef.current;
            const clone = originalElement.cloneNode(true) as HTMLElement;

            // Style the clone to ensure it captures correctly
            clone.style.transform = 'none';
            clone.style.position = 'fixed'; // Remove from flow
            clone.style.top = '-9999px';    // Hide off-screen
            clone.style.left = '0';
            clone.style.width = '794px';    // A4 width in pixels (approx) at 96 DPI
            clone.style.height = 'auto';    // Let height be auto
            clone.style.zIndex = '-1';
            clone.style.background = '#ffffff';

            // Append to body so html2canvas can find it
            document.body.appendChild(clone);

            try {
                const canvas = await html2canvas(clone, {
                    scale: 2,         // High res
                    useCORS: true,    // Allow cross-origin images
                    logging: true,    // Log issues to console
                    windowWidth: 794, // Force window width
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');

                // A4 dimensions in px at 72 DPI is roughly 595 x 842.
                const imgWidth = 595.28; // A4 width in pt
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: 'a4'
                });

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`${activeTemplate}_${formData.patientName || 'report'}.pdf`);
            } finally {
                document.body.removeChild(clone);
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert(`Failed to generate PDF. Error: ${(error as any).message || error}`);
        } finally {
            setIsDownloading(false);
        }
    };

    // --- LEFT PANEL RENDERERS ---

    const renderEyeRecordForm = () => (
        <div className="grid gap-6 animate-fadeIn">
            {/* Patient Vitals Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <InputGroup label="MRD Number" name="mrdNo" value={formData.mrdNo} onChange={handleChange} icon={Hash} />
                <InputGroup label="Mobile No" name="mobile" value={formData.mobile} onChange={handleChange} icon={Activity} />
            </div>

            {/* Vision Data Card */}
            <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Vision Metrics
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">OD/OS</span>
                </div>

                <div className="p-4 grid gap-6">
                    {/* Right Eye */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                            <span className="text-xs font-medium text-gray-300">Right Eye</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="Dist" name="vision.re.dist" value={formData.vision.re.dist} onChange={handleChange} placeholder="6/12" />
                            <InputGroup label="Near" name="vision.re.near" value={formData.vision.re.near} onChange={handleChange} placeholder="N6" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <InputGroup label="Sph" name="vision.re.sph" value={formData.vision.re.sph} onChange={handleChange} placeholder="Sph" />
                            <InputGroup label="Cyl" name="vision.re.cyl" value={formData.vision.re.cyl} onChange={handleChange} placeholder="Cyl" />
                            <InputGroup label="Ax" name="vision.re.axis" value={formData.vision.re.axis} onChange={handleChange} placeholder="Ax" />
                        </div>
                        <InputGroup label="IOP (mmHg)" name="vision.iop.re" value={formData.vision.iop.re} onChange={handleChange} placeholder="12" />
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Left Eye */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span className="text-xs font-medium text-gray-300">Left Eye</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="Dist" name="vision.le.dist" value={formData.vision.le.dist} onChange={handleChange} placeholder="6/18" />
                            <InputGroup label="Near" name="vision.le.near" value={formData.vision.le.near} onChange={handleChange} placeholder="N8" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <InputGroup label="Sph" name="vision.le.sph" value={formData.vision.le.sph} onChange={handleChange} placeholder="Sph" />
                            <InputGroup label="Cyl" name="vision.le.cyl" value={formData.vision.le.cyl} onChange={handleChange} placeholder="Cyl" />
                            <InputGroup label="Ax" name="vision.le.axis" value={formData.vision.le.axis} onChange={handleChange} placeholder="Ax" />
                        </div>
                        <InputGroup label="IOP (mmHg)" name="vision.iop.le" value={formData.vision.iop.le} onChange={handleChange} placeholder="14" />
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4 pt-2">
                <TextAreaGroup label="Patient History" name="history" value={formData.history} onChange={handleChange} rows={2} icon={FileText} />
                <TextAreaGroup label="Clinical Findings" name="findings" value={formData.findings} onChange={handleChange} rows={3} icon={Activity} />
                <TextAreaGroup label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} rows={2} icon={Stethoscope} />
                <TextAreaGroup label="Rx / Medication" name="medication" value={formData.medication} onChange={handleChange} rows={3} icon={Loader2} />
                <InputGroup label="Review Date" name="review" value={formData.review} onChange={handleChange} placeholder="e.g. 3 weeks" icon={Calendar} />
            </div>
        </div>
    );

    const renderPrescriptionForm = () => (
        <div className="space-y-6 animate-fadeIn">
            <InputGroup label="Clinical Diagnosis" name="diagnosis_rx" value={formData.diagnosis_rx} onChange={handleChange} icon={Stethoscope} />

            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Loader2 className="w-3 h-3" /> Medications (Rx)
                    </span>
                    <button onClick={addMedicine} className="text-[10px] border border-dashed border-gray-600 hover:border-cyan-500 text-gray-400 hover:text-cyan-400 px-2 py-1 rounded transition-colors uppercase font-bold">
                        + Add Item
                    </button>
                </div>

                <div className="space-y-3">
                    {formData.medicines.map((med, index) => (
                        <div key={index} className="grid grid-cols-[2fr_1fr_0.5fr_auto] gap-2 items-start group">
                            <InputGroup value={med.name} onChange={(e: any) => handleMedicineChange(index, 'name', e.target.value)} placeholder="Medicine Name" />
                            <InputGroup value={med.dosage} onChange={(e: any) => handleMedicineChange(index, 'dosage', e.target.value)} placeholder="1-0-1" />
                            <InputGroup value={med.duration} onChange={(e: any) => handleMedicineChange(index, 'duration', e.target.value)} placeholder="5d" />
                            <button onClick={() => removeMedicine(index)} className="mt-1 p-2 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <TextAreaGroup label="Additional Advice" name="prescriptionAdvice" value={formData.prescriptionAdvice} onChange={handleChange} rows={4} icon={FileText} />
        </div>
    );

    const renderRecordForm = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Patient ID" name="patientId" value={formData.patientId} onChange={handleChange} icon={Hash} />
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3 h-3 text-gray-500" />
                        Sex
                    </label>
                    <div className="relative">
                        <select name="sex" value={formData.sex} onChange={handleChange} className="w-full bg-[#09090b] border border-white/5 rounded-md px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 appearance-none font-mono">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <InputGroup label="BP (mmHg)" name="vitals.bp" value={formData.vitals.bp} onChange={handleChange} placeholder="120/80" />
                <InputGroup label="Pulse (bpm)" name="vitals.pulse" value={formData.vitals.pulse} onChange={handleChange} placeholder="72" />
            </div>

            <TextAreaGroup label="Clinical History" name="recordHistory" value={formData.recordHistory} onChange={handleChange} rows={4} icon={FileText} />
            <TextAreaGroup label="Treatment Plan" name="recordAdvice" value={formData.recordAdvice} onChange={handleChange} rows={5} icon={Activity} />
        </div>
    );

    // --- PREVIEW RENDERERS --- (UNCHANGED, KEEPING PDF OUTPUT IDENTICAL) ---
    // Note: Rendering code is bulky, collapsing for readability in this specific user instruction but in real code it's full length.
    // I will include the FULL standard preview code here to ensure no functionality loss.

    // ... Copy of preview components from previous versions ...
    const EyeRecordPreview = () => (
        <div className="bg-white text-black p-6 w-full h-full relative shadow-none font-sans text-xs flex flex-col">
            <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
                <div className="space-y-1">
                    <div className="font-bold text-lg">1001257775</div>
                    <h1 className="text-xl font-black uppercase tracking-wide">DRISHTI EYE HOSPITAL</h1>
                    <p className="text-[10px] leading-tight text-gray-600">
                        1st Floor, NCM Complex, BB Road<br />
                        Devanahalli, Bangalore Rural 562110<br />
                        Karnataka, India<br />
                        Phone: 080 27683838
                    </p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="text-3xl font-serif">👁</div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold lowercase leading-none">drishti</h2>
                            <p className="text-[8px] tracking-wider uppercase text-gray-500">vision for life</p>
                            <p className="text-[10px] uppercase font-bold text-gray-700">DEVANAHALLI</p>
                        </div>
                    </div>
                    <div className="font-bold text-[10px] mt-auto">Fri {new Date(formData.date).toDateString()}</div>
                </div>
            </div>
            <div className="border-b-2 border-black pb-1 mb-2 grid grid-cols-2 gap-x-4">
                <div>
                    <div className="flex"><span className="font-bold w-16">Name:</span> <span className="uppercase font-bold">{formData.patientName}</span></div>
                    <div className="flex"><span className="font-bold w-16">Location:</span> <span className="uppercase">{formData.location}</span></div>
                </div>
                <div>
                    <div className="flex justify-between">
                        <div><span className="font-bold">MRD:</span> {formData.mrdNo}</div>
                        <div><span className="font-bold">Age:</span> {formData.age}</div>
                    </div>
                    <div className="flex justify-between">
                        <div><span className="font-bold">Mobile:</span> {formData.mobile}</div>
                        <div><span className="font-bold">Gender:</span> {formData.sex}</div>
                    </div>
                </div>
            </div>
            <div className="text-[8px] text-justify leading-tight mb-4 border-b border-black pb-2">
                I agree to undergo examination, investigations and treatment as decided by the hospital and also to abide by its schedule of charges, rules and regulations.<br />
                <span className="italic text-gray-600">Kannada translation placeholder text...</span>
            </div>
            <div className="border-2 border-black mb-4">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_3fr_3fr] text-center border-b border-black divide-x divide-black bg-gray-100">
                    <div className="font-bold py-1">Right Eye</div>
                    <div className="font-bold py-1">Left Eye</div>
                    <div className="font-bold py-1 row-span-2 flex items-center justify-center bg-white">Prescription</div>
                    <div className="font-bold py-1">Right Eye</div>
                    <div className="font-bold py-1">Left Eye</div>
                </div>
                <div className="grid grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_1fr_1fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] text-center border-b border-black text-[9px] divide-x divide-black">
                    <div className="col-span-1 font-bold flex items-center justify-center">UCVA</div>
                    <div className="font-bold">dist</div>
                    <div className="font-bold">near</div>
                    <div className="font-bold">dist</div>
                    <div className="font-bold">near</div>
                    <div className="font-bold">Sph</div><div className="font-bold">Cyl</div><div className="font-bold">Axis</div><div className="font-bold">VA</div>
                    <div className="font-bold">Sph</div><div className="font-bold">Cyl</div><div className="font-bold">Axis</div><div className="font-bold">VA</div>
                </div>
                <div className="grid grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_1fr_1fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] text-center border-b border-black h-10 divide-x divide-black font-['Nothing_You_Could_Do',cursive] text-lg text-blue-900">
                    <div className="font-sans font-bold text-xs flex items-center justify-center text-black"></div>
                    <div className="pt-1">{formData.vision.re.dist}</div><div className="pt-1">{formData.vision.re.near}</div>
                    <div className="pt-1">{formData.vision.le.dist}</div><div className="pt-1">{formData.vision.le.near}</div>
                    <div className="font-sans font-bold text-xs flex items-center justify-center text-black">Distance</div>
                    <div className="pt-1">{formData.vision.re.sph}</div><div className="pt-1">{formData.vision.re.cyl}</div><div className="pt-1">{formData.vision.re.axis}</div><div className="pt-1">{formData.vision.re.va}</div>
                    <div className="pt-1">{formData.vision.le.sph}</div><div className="pt-1">{formData.vision.le.cyl}</div><div className="pt-1">{formData.vision.le.axis}</div><div className="pt-1">{formData.vision.le.va}</div>
                </div>
                <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_4fr_3fr] text-center h-8 divide-x divide-black">
                    <div className="font-bold flex items-center justify-center text-[10px]">IOP</div>
                    <div className="font-['Nothing_You_Could_Do',cursive] text-lg text-blue-900 pt-1 border-r border-black">{formData.vision.iop.re}</div>
                    <div className="col-span-2 font-['Nothing_You_Could_Do',cursive] text-lg text-blue-900 pt-1 text-left pl-4 border-r border-black">{formData.vision.iop.le}</div>
                    <div className="font-bold flex items-center justify-center text-[10px] border-r border-black">ADD</div>
                    <div className="grid grid-cols-2 divide-x divide-black">
                        <div></div><div></div>
                    </div>
                </div>
            </div>
            <div className="flex-grow space-y-4 font-['Nothing_You_Could_Do',cursive] text-xl text-blue-900 leading-normal relative">
                <div className="absolute inset-0 flex flex-col pointer-events-none opacity-10">
                    {[...Array(10)].map((_, i) => <div key={i} className="border-b border-black h-12 w-full"></div>)}
                </div>
                <div className="flex">
                    <span className="font-sans font-bold text-xs w-24 pt-2 text-black">Problems & History:</span>
                    <span className="flex-1 border-b border-gray-300 border-dashed">{formData.history}</span>
                </div>
                <div className="flex min-h-[100px]">
                    <span className="font-sans font-bold text-xs w-24 pt-2 text-black">Findings:</span>
                    <div className="flex-1 whitespace-pre-wrap">{formData.findings}</div>
                </div>
                <div className="flex">
                    <span className="font-sans font-bold text-xs w-24 pt-2 text-black">Diagnosis:</span>
                    <span className="flex-1 whitespace-pre-wrap">{formData.diagnosis}</span>
                </div>
                <div className="flex mt-4">
                    <span className="font-sans font-bold text-xs w-24 pt-2 text-black">Medication:</span>
                    <div className="flex-1 whitespace-pre-wrap relative">
                        {formData.medication}
                        <div className="absolute right-0 top-0 text-sm font-sans font-bold text-black border-b border-black">
                            Review After: <span className="font-['Nothing_You_Could_Do',cursive] text-xl text-blue-900 ml-2">{formData.review}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-end border-t border-black">
                <div className="text-[10px] leading-tight font-bold">
                    Dr {formData.doctorName}<br />
                    <span className="font-normal">MBBS, MS(Ophth), FMRF(Uveitis & Ocular Immunology)<br />MSc ICEH, London KMC 53557</span>
                </div>
                <div className="w-32 h-16 border border-black flex items-end justify-center pb-1">
                    <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-blue-900 transform -rotate-12">Signature</span>
                </div>
            </div>
        </div>
    );

    const PrescriptionPreview = () => (
        <div className="bg-white text-black p-8 w-full h-full relative shadow-none font-sans flex flex-col">
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-teal-100 border border-teal-500 flex items-center justify-center text-[8px] text-teal-800 font-bold leading-tight text-center">
                        LEENA<br />HOSPITAL
                    </div>
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wide leading-none">RAMAIAH<br />LEENA HOSPITAL</h1>
                    </div>
                </div>
                <div className="text-right pt-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide">PATIENT PRESCRIPTION</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 text-sm font-medium mb-8 relative font-serif">
                <div className="space-y-3">
                    <div className="flex relative">
                        <span className="w-12 text-gray-600">Name :</span>
                        <span className="font-['Nothing_You_Could_Do',cursive] text-3xl text-gray-900 absolute -top-2 left-12 transform -rotate-1 whitespace-nowrap z-10">{formData.patientName || '_________________'}</span>
                    </div>
                    <div className="flex items-center mt-4">
                        <span className="w-12 text-gray-600">Age :</span>
                        <span className="font-['Nothing_You_Could_Do',cursive] text-xl text-gray-900 ml-1">{formData.age || '__'}</span>
                    </div>
                    <div className="flex">
                        <span className="w-12 text-gray-600">MR No :</span>
                        <span className="font-['Nothing_You_Could_Do',cursive] text-lg text-gray-900 ml-1">{formData.patientId || '__________'}</span>
                    </div>
                </div>
                <div className="text-right space-y-3 flex flex-col items-end">
                    <div className="flex items-center">
                        <span className="mr-2 text-gray-600">Date / Time :</span>
                        <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 transform rotate-1">{formData.date.split('-').reverse().join('/')}</span>
                    </div>
                    <div className="flex items-center relative pr-4">
                        <span className="mr-2 text-gray-600">Sex M / F :</span>
                        <div className="absolute right-0 top-[-10px] w-12 h-12 rounded-full border-2 border-blue-900 opacity-70 transform rotate-12 skew-x-6 z-10" style={{ display: formData.sex === 'Male' ? 'block' : 'none', left: 'auto', right: '20px' }}></div>
                        <div className="absolute right-0 top-[-10px] w-12 h-12 rounded-full border-2 border-blue-900 opacity-70 transform rotate-12 skew-x-6 z-10" style={{ display: formData.sex === 'Female' ? 'block' : 'none', right: '-5px' }}></div>
                    </div>
                </div>
            </div>
            <div className="relative flex-grow">
                <div className="text-3xl font-serif font-bold mb-6">℞</div>
                <div className="space-y-8 ml-2">
                    <ul className="space-y-8 list-none w-full">
                        {formData.medicines.map((med, i) => (
                            <li key={i} className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 transform -rotate-[0.5deg] leading-none flex items-baseline">
                                <span className="font-bold mr-2 text-lg">●</span>
                                <span className="mr-4">T. {med.name}</span>
                                <span className="ml-auto mr-12 text-3xl tracking-widest">{med.dosage}</span>
                                <div className="flex flex-col text-xl leading-tight w-24 -ml-4 transform rotate-1">
                                    <span>x</span>
                                    <span>{med.duration} days</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {formData.prescriptionAdvice && (
                        <div className="mt-8 ml-8 font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 leading-normal transform rotate-1">
                            {formData.prescriptionAdvice}
                        </div>
                    )}
                    {formData.diagnosis_rx && (
                        <div className="mt-6 flex items-baseline font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900">
                            <span className="font-bold mr-2 text-lg">●</span>
                            <span>Dx: {formData.diagnosis_rx}</span>
                            <span className="ml-auto mr-12 transform -rotate-3 text-3xl">L/A</span>
                            <div className="border border-blue-900 rounded-full w-8 h-8 flex items-center justify-center ml-2 transform rotate-12">1</div>
                        </div>
                    )}
                    <div className="mt-12 ml-4 font-['Nothing_You_Could_Do',cursive] text-3xl text-gray-900 transform -rotate-2">
                        R/w after 5 days.
                    </div>
                </div>
            </div>
            <div className="mt-auto relative">
                <div className="absolute bottom-12 right-0 text-center transform -rotate-3">
                    <div className="font-['Nothing_You_Could_Do',cursive] text-xl text-blue-700 font-bold">DR. {formData.doctorName ? formData.doctorName.toUpperCase() : 'CHETHAN G'}</div>
                    <div className="text-[10px] text-blue-500 font-sans leading-tight mt-1">
                        Consultant Orthopedic Surgeon<br />
                        <span className="text-lg font-['Nothing_You_Could_Do',cursive] transform -rotate-6 block mt-1">KMC No-100624</span>
                    </div>
                </div>
                <div className="border-t border-gray-400 pt-2 text-[9px] text-gray-500 text-center font-sans">
                    S Narasimhaiah Layout, Budigere Road, Devanahalli Town - 562110. Bangalore Rural District.<br />
                    T 080 2768 2280/81/82/83/84 E info@leenahospital.com W leenahospital.com
                </div>
            </div>
        </div>
    );

    const RecordPreview = () => (
        <div className="bg-white text-black p-10 w-full h-full relative shadow-none font-sans text-xs">
            <div className="grid grid-cols-3 gap-4 border-b-2 border-black pb-4 mb-4">
                <div>
                    <h1 className="text-xl font-bold font-serif">{formData.hospitalName || 'Manipal Hospital'}</h1>
                    <p className="text-[10px] text-gray-600">LIFE'S ON</p>
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold uppercase tracking-widest border border-black inline-block px-4 py-1">Outpatient Record</h2>
                </div>
                <div className="text-right">
                    <div className="h-8 bg-repeat-x w-full opacity-70" style={{ backgroundImage: 'linear-gradient(90deg, black 1px, transparent 1px, black 3px, transparent 2px)' }}></div>
                    <p className="text-[10px] mt-1">URN: MH010816182</p>
                </div>
            </div>
            <div className="border border-black p-2 mb-6 grid grid-cols-2 gap-x-8 gap-y-1">
                <div className="flex"><span className="w-24 font-bold">Name:</span> <span>{formData.patientName.toUpperCase()}</span></div>
                <div className="flex"><span className="w-24 font-bold">Visit No:</span> <span>001002361562</span></div>
                <div className="flex"><span className="w-24 font-bold">Patient ID:</span> <span>{formData.patientId || 'MH1010816182'}</span></div>
                <div className="flex"><span className="w-24 font-bold">Age/Sex:</span> <span>{formData.age} Yrs / {formData.sex}</span></div>
                <div className="flex"><span className="w-24 font-bold">Doctor:</span> <span>DR. {formData.doctorName.toUpperCase()}</span></div>
                <div className="flex"><span className="w-24 font-bold">Date:</span> <span>{formData.date}</span></div>
            </div>
            <div className="space-y-4 font-serif text-sm leading-relaxed">
                <div className="mb-4">
                    <span className="font-bold underline uppercase text-xs mb-1 block">Clinical Vitals:</span>
                    <p>BP: {formData.vitals.bp || '--'} | Pulse: {formData.vitals.pulse || '--'} | Temp: {formData.vitals.temp || '--'} | Wt: {formData.vitals.weight || '--'}</p>
                </div>
                <div className="mb-4">
                    {formData.recordHistory && (
                        <>
                            <span className="font-bold underline uppercase text-xs mb-1 block">Presenting Complaint & History:</span>
                            <div className="whitespace-pre-line">{formData.recordHistory}</div>
                        </>
                    )}
                </div>
                <div>
                    {formData.recordAdvice && (
                        <>
                            <span className="font-bold underline uppercase text-xs mb-2 block">Advise & Plan:</span>
                            <div className="whitespace-pre-line border-l-2 border-gray-300 pl-2">{formData.recordAdvice}</div>
                        </>
                    )}
                </div>
                <div className="mt-8 border-t border-dashed border-gray-400 pt-4">
                    <span className="font-bold">Next Review:</span> After 5 days
                </div>
            </div>
            <div className="absolute bottom-10 left-10 right-10 border-t border-black pt-2 text-[10px]">
                <div className="font-bold mb-1">Dr. {formData.doctorName}</div>
                <div className="text-gray-600">MBBS, MD (Pulmonary Medicine), FIP(Fellowship Intervention)</div>
                <div className="mt-4 text-center text-gray-400">
                    Seek medical help if symptoms aggravate. For emergencies contact 080-25027100
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Fine Grid Background */}
            <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>

            {/* Top Bar / Logo */}
            <div className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-900/20 text-lg">
                            M
                        </div>
                        <h1 className="text-lg font-bold text-gray-100 tracking-tight">
                            Medical<span className="text-gray-500">OS</span>
                        </h1>
                        <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-400 border border-white/5">BETA</div>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-500 font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            SYSTEM ONLINE
                        </div>
                        <div>v2.4.0</div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
                <div className="grid grid-cols-12 gap-8 h-[calc(100vh-8rem)]">

                    {/* Left Column: Controls (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">

                        {/* Tab Switcher */}
                        <div className="p-1 rounded-lg bg-white/5 border border-white/5 flex gap-1">
                            {(['eye-record', 'prescription', 'record'] as TemplateType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveTemplate(type)}
                                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wide rounded-md transition-all ${activeTemplate === type
                                        ? 'bg-[#09090b] text-white shadow-sm border border-white/10'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    {type === 'eye-record' ? 'Eye Record' : type === 'prescription' ? 'Rx' : 'Clinical'}
                                </button>
                            ))}
                        </div>

                        {/* Main Input Form Card */}
                        <div className="rounded-xl border border-white/10 bg-[#09090b]/50 backdrop-blur-sm p-6 shadow-2xl relative group">
                            {/* Content */}
                            <div className="relative z-10 space-y-6">
                                <div className="border-b border-white/5 pb-4 mb-4">
                                    <h2 className="text-sm font-bold text-gray-100 uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-cyan-500" />
                                        Input Parameters
                                    </h2>
                                </div>

                                {/* Common Fields */}
                                <div className="space-y-4">
                                    <InputGroup label="Hospital Name" name="hospitalName" value={formData.hospitalName} onChange={handleChange} icon={MapPin} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} icon={User} />
                                        <InputGroup label="Age / Yrs" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 45" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Doctor Name" name="doctorName" value={formData.doctorName} onChange={handleChange} icon={Stethoscope} />
                                        <InputGroup label="Date" type="date" name="date" value={formData.date} onChange={handleChange} icon={Calendar} />
                                    </div>
                                    <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} icon={MapPin} />
                                </div>

                                <div className="h-px bg-white/5 w-full"></div>

                                {/* Template Specific */}
                                <div>
                                    {activeTemplate === 'eye-record' && renderEyeRecordForm()}
                                    {activeTemplate === 'prescription' && renderPrescriptionForm()}
                                    {activeTemplate === 'record' && renderRecordForm()}
                                </div>
                            </div>
                        </div>

                        {/* Download Action */}
                        <div className="sticky bottom-0 bg-[#030712] pt-4 border-t border-white/5">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`w-full group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 rounded-lg shadow-lg shadow-white/5 transition-all outline-none focus:ring-2 focus:ring-white/20 ${isDownloading ? 'opacity-70 cursor-wait' : 'hover:bg-gray-200 active:scale-[0.99]'
                                    }`}
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs uppercase tracking-widest">Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                        <span className="text-xs uppercase tracking-widest">Generate Report PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Preview (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col items-center bg-[#09090b] rounded-2xl border border-white/5 relative overflow-hidden">

                        {/* Toolbar */}
                        <div className="w-full px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500 font-mono uppercase">Preview Mode</span>
                                <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20">A4 ISO</div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                        </div>

                        {/* Preview Canvas */}
                        <div className="flex-1 w-full overflow-y-auto p-8 flex justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">
                            {/* Preview Container without heavy 3D for simpler, cleaner dev look - keeps PDF more stable too, though duplicate logic handles PDF */}
                            <div
                                className="relative bg-white shadow-2xl transition-all duration-300 animate-slideIn"
                                style={{ width: '595px', minHeight: '842px', height: 'fit-content' }}
                            >
                                <div ref={previewRef} className="w-full h-full bg-white">
                                    {activeTemplate === 'eye-record' && <EyeRecordPreview />}
                                    {activeTemplate === 'prescription' && <PrescriptionPreview />}
                                    {activeTemplate === 'record' && <RecordPreview />}
                                </div>
                            </div>
                        </div>

                        {/* Footer Video (Integrity Check) */}
                        <div className="absolute bottom-6 right-6 z-20 w-64">
                            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                                <div className="px-3 py-1.5 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 font-mono uppercase flex items-center gap-1.5">
                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                        System Integrity
                                    </span>
                                </div>
                                <video
                                    src={cheatingVideo}
                                    controls
                                    className="w-full h-32 object-cover opacity-80 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalReports;
