import React from 'react'

interface HangingSpiderProps {
  className?: string
  whatsappNumber?: string // optional international number e.g. '15551234567'
  align?: 'left' | 'center' | 'right'
}

const HangingSpider: React.FC<HangingSpiderProps> = ({ className = '', whatsappNumber, align = 'center' }) => {
  const waHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined
  // bubble alignment classes
  const bubblePosClass = align === 'right' ? '-translate-x-6 text-right' : align === 'left' ? 'translate-x-6 text-left' : 'text-center'

  return (
    <div className={`pointer-events-auto ${className}`} aria-hidden={false} role="img" aria-label="Hanging spider with a speech bubble saying: hiii whatsapp message">
      <div className="relative flex items-center justify-center">
        {/* Web line (now extends/retracts with animation) */}
        <div className="absolute top-0 w-px bg-gray-300 dark:bg-gray-700 left-1/2 -translate-x-1/2 web-extend animate-swing-origin"></div>

        {/* Spider + speech bubble container (descends with animation) */}
        <div className={`relative -mt-6 flex flex-col items-center gap-1 animate-descend ${align === 'right' ? 'items-end' : align === 'left' ? 'items-start' : 'items-center'}`}>
          <div className={`bg-white/95 dark:bg-gray-900/95 px-3 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white select-none ${bubblePosClass} max-w-xs`}> 
            {waHref ? (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="underline">hiii whatsapp message</a>
            ) : (
              <span>hiii whatsapp message</span>
            )}
          </div>

          {/* Sticker-style spider graphic (bigger, not clipped) */}
          <div className="relative mt-1 -mb-2 w-[96px] h-[96px] overflow-visible">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-swing w-[96px] h-[96px] drop-shadow-lg">
              {/* web line to the top of the page - drawn within svg to keep smooth */}
              <line x1="48" y1="0" x2="48" y2="30" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />

              {/* sticker background */}
              <rect x="8" y="22" width="80" height="64" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" className="dark:fill-gray-900 dark:stroke-gray-700" />

              {/* spider body */}
              <ellipse cx="48" cy="48" rx="14" ry="18" fill="#0f172a" />
              <circle cx="48" cy="38" r="10" fill="#0f172a" />

              {/* eyes (stylized) */}
              <path d="M42 36c0 0 2-4 6-4s6 4 6 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" />

              {/* legs - left */}
              <path d="M36 46 C30 44, 26 40, 22 36" stroke="#0b1220" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M36 52 C30 52, 26 56, 22 60" stroke="#0b1220" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M34 58 C28 60, 24 68, 20 72" stroke="#0b1220" strokeWidth="2" strokeLinecap="round" />

              {/* legs - right */}
              <path d="M60 46 C66 44, 70 40, 74 36" stroke="#0b1220" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M60 52 C66 52, 70 56, 74 60" stroke="#0b1220" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M62 58 C68 60, 72 68, 76 72" stroke="#0b1220" strokeWidth="2" strokeLinecap="round" />

              {/* abdomen pattern */}
              <path d="M48 56 C44 56, 40 58, 38 62 C46 64, 50 66, 58 62 C56 58, 52 56, 48 56 Z" fill="#111827" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HangingSpider
