import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {/* Círculo principal */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>

            {/* Cabeça do mascote */}
            <circle cx="12" cy="10" r="6" fill="currentColor"/>

            {/* Antenas */}
            <circle cx="8.5" cy="5.5" r="1" fill="currentColor"/>
            <circle cx="15.5" cy="5.5" r="1" fill="currentColor"/>
            <line x1="9" y1="6" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="15" y1="6" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>

            {/* Olhos */}
            <circle cx="9.5" cy="9" r="0.8" fill="white"/>
            <circle cx="14.5" cy="9" r="0.8" fill="white"/>
            <circle cx="9.5" cy="9" r="0.4" fill="currentColor"/>
            <circle cx="14.5" cy="9" r="0.4" fill="currentColor"/>

            {/* Boca sorrindo */}
            <path d="M9 11.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

            {/* Corpo/base */}
            <ellipse cx="12" cy="18" rx="4" ry="2" fill="currentColor" opacity="0.6"/>
        </svg>
    );
}
