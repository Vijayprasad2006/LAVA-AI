import React from 'react'

interface FlyingHeroProps {
  className?: string
  whatsappNumber?: string
}

const FlyingHero: React.FC<FlyingHeroProps> = ({ className = '', whatsappNumber }) => {
  const waHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined
  return (
    <div className={`pointer-events-auto ${className}`} aria-hidden={false} role="img" aria-label="Flying armored hero with a message bubble">
      <div className="relative flex items-center justify-center">
        {/* The hero will be an original stylized armored character (not a copyrighted character) */}
        <div className="relative flex flex-col items-center gap-2">
          <div className="bg-white/95 dark:bg-gray-900/95 px-3 py-1 rounded-full shadow-md border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white select-none">
            {waHref ? (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="underline">hiii whatsapp message</a>
            ) : (
              <span>hiii whatsapp message</span>
            )}
          </div>

          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-fly w-[120px] h-[120px]">
            {/* jet trail */}
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <g>
              {/* subtle shadow */}
              <ellipse cx="60" cy="90" rx="26" ry="6" fill="#000" opacity="0.08" />

              {/* hero body (stylized armor) */}
              <g transform="translate(30,20)">
                <rect x="18" y="10" rx="8" ry="8" width="54" height="54" fill="#b91c1c" />
                <rect x="26" y="16" rx="6" ry="6" width="40" height="36" fill="#f59e0b" />
                <circle cx="50" cy="22" r="6" fill="#fff" opacity="0.95" />
                <path d="M36 46 L24 64" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                <path d="M74 46 L86 64" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                {/* boosters */}
                <rect x="18" y="54" width="8" height="8" rx="2" fill="#f97316" />
                <rect x="64" y="54" width="8" height="8" rx="2" fill="#f97316" />
                <path d="M26 62 C22 76, 18 86, 12 92" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                <path d="M86 62 C90 76, 94 86, 100 92" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default FlyingHero
