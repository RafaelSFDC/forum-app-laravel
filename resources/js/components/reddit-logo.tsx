import { SVGAttributes } from 'react';

export default function RedditLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {/* Cabeça do Snoo */}
            <circle cx="12" cy="12" r="10" fill="#FF4500"/>
            <circle cx="12" cy="12" r="8" fill="white"/>

            {/* Antenas */}
            <circle cx="8" cy="6" r="1.5" fill="#FF4500"/>
            <circle cx="16" cy="6" r="1.5" fill="#FF4500"/>
            <line x1="9" y1="7" x2="10.5" y2="9" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="15" y1="7" x2="13.5" y2="9" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round"/>

            {/* Olhos */}
            <circle cx="9.5" cy="10.5" r="1.2" fill="#FF4500"/>
            <circle cx="14.5" cy="10.5" r="1.2" fill="#FF4500"/>

            {/* Boca sorrindo */}
            <path d="M8.5 14.5c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5" stroke="#FF4500" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
    );
}
