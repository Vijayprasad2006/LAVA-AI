import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const MedicalCertificate = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        hospitalName: '',
        reason: '',
        fromDate: '',
        days: '',
        doctorName: '',
    });

    const certificateRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f3f4f6', // Light gray background like paper
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('medical_certificate.pdf');
        } catch (error) {
            console.error('Error generating certificate:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Input Form */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                    <h2 className="text-3xl font-bold mb-6 text-orange-500">Certificate Details</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Patient Name</label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Hospital Name</label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="e.g. City General Hospital"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Reason for Leave</label>
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="e.g. Viral Fever"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">From Date</label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Days</label>
                                <input
                                    type="number"
                                    name="days"
                                    value={formData.days}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="e.g. 3"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Doctor Name</label>
                            <input
                                type="text"
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="e.g. Dr. Smith"
                            />
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] hover:shadow-orange-500/20 active:scale-[0.98]"
                        >
                            Download Certificate
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-6 text-gray-400">Live Preview</h2>

                    {/* The Certificate Paper */}
                    <div
                        ref={certificateRef}
                        className="bg-[#f0f0f0] text-black p-12 w-full max-w-[600px] aspect-[1/1.3] relative shadow-2xl skew-x-1 skew-y-1 rotate-1 transform transition-all duration-500 hover:rotate-0 hover:skew-x-0 hover:skew-y-0"
                        style={{
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                            boxShadow: '10px 10px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8 border-b-2 border-blue-900 pb-4">
                            <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">Medical Certificate For Leave of Extension</h1>
                            <h2 className="text-xl font-bold text-blue-900 underline mt-1">Commutation of Leave</h2>
                        </div>

                        {/* Body Content */}
                        <div className="space-y-6 text-lg leading-relaxed font-serif relative z-10">

                            <div className="flex items-end">
                                <span className="whitespace-nowrap">Signature of the applicant</span>
                                <div className="border-b border-black flex-grow ml-2 h-6"></div>
                            </div>

                            <div className="leading-loose">
                                I Dr. <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 mx-2 transform -rotate-2 inline-block">{formData.doctorName || '_______________'}</span>
                                after careful personal examination of the case hereby certify that Thiru. / Selvi / Thirumathi
                                <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 mx-2 transform rotate-1 inline-block border-b border-gray-400 min-w-[150px] text-center">{formData.patientName || '_______________'}</span>
                                whose signature is given above is / was suffering from
                                <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 mx-2 transform -rotate-2 inline-block border-b border-gray-400 min-w-[200px] text-center">{formData.reason || '_______________'}</span>
                                based on clinical condition and investigation done as is given _______________ and I consider
                                that a period of absence from duty for
                                <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 mx-2 inline-block border-b border-gray-400 transform rotate-2 min-w-[50px] text-center">{formData.days || '__'}</span>
                                days with effect from
                                <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-gray-900 mx-2 inline-block border-b border-gray-400 transform -rotate-1 min-w-[120px] text-center">{formData.fromDate || '__/__/____'}</span>
                                is absolutely necessary for the restoration of his / her health.
                            </div>

                        </div>

                        {/* Footer / Signatures */}
                        <div className="mt-16 flex justify-between items-end relative z-10">
                            <div>
                                <div className="flex mb-2">
                                    <span className="font-bold w-20">Station :</span>
                                    <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-black ml-2 transform -rotate-2">{formData.hospitalName ? formData.hospitalName.split(' ')[0] : '_______'}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-bold w-20">Date :</span>
                                    <span className="font-['Nothing_You_Could_Do',cursive] text-2xl text-black ml-2 transform rotate-1">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="h-16 flex items-end justify-center mb-2">
                                    <span className="font-['Nothing_You_Could_Do',cursive] text-3xl text-gray-900 transform -rotate-6 border-b-2 border-blue-900/30 px-4">{formData.doctorName ? `Dr. ${formData.doctorName.split(' ')[0]}` : 'Signature'}</span>
                                </div>
                                <p className="text-sm font-bold">Authorised Medical Attendant or</p>
                                <div className="text-xs text-blue-900 font-bold mt-2 leading-tight">
                                    <p>Reg No. 46850</p>
                                    <p>Dr. {formData.doctorName ? formData.doctorName.toUpperCase() : 'DOCTOR NAME'}</p>
                                    <p>Consultant Surgeon</p>
                                    <p>{formData.hospitalName || 'HOSPITAL NAME'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stamp Effect */}
                        <div className="absolute bottom-12 right-8 w-32 h-32 border-4 border-blue-900 rounded-full opacity-60 pointer-events-none transform -rotate-12 flex items-center justify-center text-center p-2 z-0">
                            <div className="text-[10px] font-bold text-blue-900 uppercase leading-none">
                                {formData.hospitalName || 'Hospital Name'}
                                <br />
                                <br />
                                Verified
                            </div>
                        </div>

                        {/* Paper textures/imperfections */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-100/20 to-transparent pointer-events-none"></div>
                        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalCertificate;
