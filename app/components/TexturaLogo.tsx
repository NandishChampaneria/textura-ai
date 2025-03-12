interface TexturaLogoProps {
  className?: string;
}

export default function TexturaLogo({ className = "w-8 h-8" }: TexturaLogoProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Ring with Gradient */}
      <circle 
        cx="16" 
        cy="16" 
        r="15" 
        className="stroke-current" 
        strokeWidth="1.5" 
        strokeOpacity="1"
      />

      {/* Abstract T Shape */}
      <path 
        d="M10 8H22M16 8V20" 
        className="stroke-current" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeOpacity="1"
      />

      {/* Creative Elements */}
      <path 
        d="M8 16C8 16 10 14 12 14C14 14 16 18 18 18C20 18 22 16 22 16" 
        className="stroke-current" 
        strokeWidth="2" 
        strokeLinecap="round"
        strokeOpacity="1"
      />

      {/* Decorative Dots */}
      <circle cx="8" cy="16" r="1.5" className="fill-current" fillOpacity="1"/>
      <circle cx="22" cy="16" r="1.5" className="fill-current" fillOpacity="1"/>
      
      {/* Dynamic Element */}
      <path 
        d="M12 24L16 20L20 24" 
        className="stroke-current" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity="1"
      />
    </svg>
  );
} 