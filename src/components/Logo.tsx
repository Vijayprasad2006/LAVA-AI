const Logo = ({ className = "h-8 w-8" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="diceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="diceFaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f5f5f5" />
        </linearGradient>
      </defs>
      
      {/* Rolling Dice with 3D perspective */}
      <g transform="translate(50, 50)">
        <g className="animate-roll-dice">
          {/* Main dice face - always visible */}
          <rect x="-30" y="-30" width="60" height="60" rx="6" fill="url(#diceFaceGradient)" stroke="url(#diceGradient)" strokeWidth="2.5" />
          
          {/* Top shadow face (for 3D effect) */}
          <path d="M -30 -30 L -24 -36 L 36 -36 L 30 -30 Z" fill="url(#diceFaceGradient)" stroke="url(#diceGradient)" strokeWidth="2.5" />
          
          {/* Right shadow face (for 3D effect) */}
          <path d="M 30 -30 L 36 -36 L 36 24 L 30 30 Z" fill="url(#diceGradient)" opacity="0.3" stroke="url(#diceGradient)" strokeWidth="2.5" />
          
          {/* Dice Face 1 - Center dot */}
          <g className="dice-face dice-face-1">
            <circle cx="0" cy="0" r="5" fill="url(#diceGradient)" />
          </g>
          
          {/* Dice Face 2 - Top-left and bottom-right */}
          <g className="dice-face dice-face-2">
            <circle cx="-15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="15" r="5" fill="url(#diceGradient)" />
          </g>
          
          {/* Dice Face 3 - Diagonal line */}
          <g className="dice-face dice-face-3">
            <circle cx="-15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="0" cy="0" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="15" r="5" fill="url(#diceGradient)" />
          </g>
          
          {/* Dice Face 4 - Four corners */}
          <g className="dice-face dice-face-4">
            <circle cx="-15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="-15" cy="15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="15" r="5" fill="url(#diceGradient)" />
          </g>
          
          {/* Dice Face 5 - Four corners + center */}
          <g className="dice-face dice-face-5">
            <circle cx="-15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="0" cy="0" r="5" fill="url(#diceGradient)" />
            <circle cx="-15" cy="15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="15" r="5" fill="url(#diceGradient)" />
          </g>
          
          {/* Dice Face 6 - Two columns of three */}
          <g className="dice-face dice-face-6">
            <circle cx="-15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="-15" cy="0" r="5" fill="url(#diceGradient)" />
            <circle cx="-15" cy="15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="-15" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="0" r="5" fill="url(#diceGradient)" />
            <circle cx="15" cy="15" r="5" fill="url(#diceGradient)" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Logo
