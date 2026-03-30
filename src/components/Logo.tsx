import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Livro Aberto (Open Book) */}
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      
      {/* Espada (Sword) - Posicionada no centro do livro */}
      <path d="M12 2v16" /> {/* Lâmina e Cabo */}
      <path d="M9 7h6" />   {/* Guarda (Crossguard) */}
      <path d="M10 2h4" />  {/* Pomo (Pommel) */}
    </svg>
  );
}
