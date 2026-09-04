export function BudgieLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-mark" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#5eead4" />
          <stop offset="0.55" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="tail-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d9488" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="wing-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      <path
        d="M 118 122 C 150 128 172 140 182 162 C 164 158 146 156 128 150 C 118 146 112 136 118 122 Z"
        fill="url(#tail-mark)"
      />
      <ellipse cx="98" cy="118" rx="46" ry="40" fill="url(#bg-mark)" />
      <path
        d="M 84 96 C 108 94 128 108 130 132 C 128 140 118 146 104 144 C 88 142 76 128 78 110 C 79 104 80 99 84 96 Z"
        fill="url(#wing-mark)"
        opacity="0.9"
      />
      <path
        d="M 92 108 C 104 108 114 116 116 128"
        stroke="#134e4a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M 88 120 C 98 121 106 128 108 138"
        stroke="#134e4a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <circle cx="68" cy="80" r="32" fill="url(#bg-mark)" />
      <circle cx="54" cy="90" r="11" fill="#fbbf24" opacity="0.95" />
      <path d="M 40 78 C 32 80 28 85 27 90 C 33 91 40 90 45 86 Z" fill="#f59e0b" />
      <circle cx="60" cy="74" r="6.5" fill="#0c2b28" />
      <circle cx="62.3" cy="71.6" r="2" fill="#f0fdfa" />
      <path d="M 88 154 L 86 168" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <path d="M 104 156 L 106 168" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <rect x="60" y="168" width="80" height="9" rx="4.5" fill="#92400e" />
    </svg>
  );
}
