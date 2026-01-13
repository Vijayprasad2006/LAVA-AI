

import { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { FileText, Star } from 'lucide-react'

const Extract = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                window.location.hash = 'signin'
            } else {
                setUser(u);
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    const templates = [
        { id: 1, name: 'Best Report Template', type: 'Report', rating: 3500, file: 'best_report.docx', link: 'https://drive.google.com/file/d/1HXMvFlfv3e6KKuLPb8UM2-irfIXelIs1/view?usp=sharing' },
        { id: 2, name: 'Comprehensive Research Format', type: 'Research', rating: 3200, file: 'research_fmt.docx', link: 'https://docs.google.com/document/d/1ZsDh7X49Kbmvu18s-V7u8ynW1uWu8Nde/edit?usp=drive_link&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 3, name: 'Minor Project Standard', type: 'Project', rating: 1600, file: 'minor_proj.docx', link: 'https://drive.google.com/file/d/1uZ8F3tMGOjhDLlOhMoIjPNMBYCiFfzuU/view?usp=sharing' },
        { id: 4, name: 'Front Page Format', type: 'Format', rating: 800, file: 'front_page.docx', link: 'https://docs.google.com/document/d/1jC1J9bTG5-rJTFxKle1EG6zfP_qqhY2e/edit?usp=sharing&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 5, name: 'Biology Lab Manual', type: 'Lab', rating: 1200, file: 'bio_lab.docx', link: 'https://docs.google.com/document/d/1ySbzFlZ6tGNlePs5lN0dSmz0unEfmL-U/edit?usp=sharing&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 6, name: 'Basic Template 01', type: 'Standard', rating: 1000, file: 'temp_01.docx', link: 'https://docs.google.com/document/d/1gSvqJEpkZ3SAI9ajPJMfigLLJfsfsqtJ/edit?usp=sharing&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 7, name: 'Advanced Template 02', type: 'Standard', rating: 2100, file: 'temp_02.docx', link: 'https://docs.google.com/document/d/1IBH_KL-m-EP1hCIjvNcFL50gMJY_ob47/edit?usp=sharing&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 8, name: 'Draft Template 03', type: 'Draft', rating: 1400, file: 'temp_03.docx', link: 'https://docs.google.com/document/d/1EJDF7KrpKrvMhkCWsCpmhptfuY6yp47U/edit?usp=drive_link&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 9, name: 'Simple Template 04', type: 'Simple', rating: 900, file: 'temp_04.docx', link: 'https://drive.google.com/file/d/1t_98eh-W1X43oCv4OzZmn8U6MArnygr5/view?usp=drive_link' },
        { id: 10, name: 'Professional Template 05', type: 'Pro', rating: 2400, file: 'temp_05.docx', link: 'https://docs.google.com/document/d/1EdzY4mSv7SZBPixaFXFSwkULfdh_4byl/edit?usp=drive_link&ouid=100837573585871062025&rtpof=true&sd=true' },
        { id: 11, name: 'Legacy Template 06', type: 'Legacy', rating: 1100, file: 'temp_06.docx', link: 'https://docs.google.com/document/d/1O1ahMHfIM4NX47ZZ1e1GJDbxGZJxYqwv/edit?usp=drive_link&ouid=100837573585871062025&rtpof=true&sd=true' },
    ]

    // Codeforces styling constants
    const RATING_COLORS = (rating: number) => {
        if (rating >= 3000) return 'text-red-600 font-bold'; // Legendary Grandmaster
        if (rating >= 2400) return 'text-red-500'; // Grandmaster
        if (rating >= 2100) return 'text-orange-500 font-semibold'; // Master
        if (rating >= 1900) return 'text-violet-600 font-semibold'; // Candidate Master
        if (rating >= 1600) return 'text-blue-600 pointer-events-none'; // Expert
        if (rating >= 1400) return 'text-cyan-600'; // Specialist
        if (rating >= 1200) return 'text-green-600'; // Pupil
        return 'text-gray-500'; // Newbie
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="text-blue-800 text-xl font-bold mb-2">Codeforces</div>
                    <div className="text-gray-600">Loading data...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F0F0F0] font-verdana text-sm text-[#181818]">
            {/* Header / Menu mimic */}
            <div className="bg-white border-b border-gray-300 mb-4 sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col leading-none">
                            <span className="text-red-600 font-bold text-xl">LAVA-FORCES</span>
                            <span className="text-xs text-gray-500">presents report templates</span>
                        </div>
                    </div>
                    <div>
                        {user && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Welcome,</span>
                                <span className={RATING_COLORS(1500) + " font-bold"}>{user.email?.split('@')[0] || 'Guest'}</span>
                                <span className="text-gray-400">|</span>
                                <a href="#signin" className="text-gray-500 hover:text-blue-700">Logout</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Main Content Area */}
                <div className="md:col-span-3">
                    <div className="bg-white border border-[#E1E1E1] rounded-sm p-4 mb-4">
                        <div className="border-b border-[#E1E1E1] mb-4 pb-2">
                            <h2 className="text-[#0E2F5A] text-lg font-normal">Templates Available</h2>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[#585858] text-[13px]">
                                        <th className="p-2 w-10 text-center">#</th>
                                        <th className="p-2">Name</th>
                                        <th className="p-2 text-center">Type</th>
                                        <th className="p-2 text-center w-20">Difficulty</th>
                                        <th className="p-2 text-center w-20"><Star size={12} className="inline" /></th>
                                        <th className="p-2 text-center w-32">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.map((t, idx) => (
                                        <tr key={t.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'} hover:bg-[#EAF3FF] border-t border-gray-100`}>
                                            <td className="p-2 text-center text-gray-500 font-medium">{t.id}A</td>
                                            <td className="p-2">
                                                <div className="flex flex-col">
                                                    <a
                                                        href={t.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-800 hover:underline font-semibold text-[14px]"
                                                    >
                                                        {t.name}
                                                    </a>
                                                    <div className="flex gap-1 mt-1">
                                                        <span className="bg-[#E0E0E0] text-[10px] text-gray-600 px-1 rounded-sm">math</span>
                                                        <span className="bg-[#E0E0E0] text-[10px] text-gray-600 px-1 rounded-sm">implementation</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-2 text-center text-gray-600 text-xs italic">{t.type}</td>
                                            <td className="p-2 text-center">
                                                <span className={`${RATING_COLORS(t.rating)} font-bold text-xs`}>{t.rating}</span>
                                            </td>
                                            <td className="p-2 text-center text-xs text-gray-400">
                                                {t.rating > 2000 ? 'x153' : 'x4291'}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => {
                                                        if (t.link && t.link !== '#') window.open(t.link, '_blank');
                                                        else alert(`Downloading ${t.file}...`);
                                                    }}
                                                    className="inline-flex items-center gap-1 bg-[#E1F0FF] hover:bg-[#D4E6FC] border border-[#B9D3EE] text-[#000000] px-2 py-1 rounded-[3px] text-xs transition-colors"
                                                >
                                                    <FileText size={12} className="text-green-600" />
                                                    <span>Open</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-4">


                    {/* Footer Area */}
                    <div className="p-4 bg-transparent text-[11px] text-center text-gray-400">
                        <p>ReportAI &copy; 2026</p>
                        <p className="mt-1">Server time: <span className="text-gray-500">10:00:42</span></p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Extract

