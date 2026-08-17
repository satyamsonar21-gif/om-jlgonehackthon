import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header 
      className="h-16 flex items-center justify-between px-6 sm:px-8 border-b sticky top-0 z-20 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      <div>
        <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          className="p-2 rounded-xl border transition-colors cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface-muted, var(--bg))',
            color: 'var(--text)',
          }}
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        
        <button 
          className="relative p-2 rounded-xl border transition-colors cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface-muted, var(--bg))',
            color: 'var(--text)',
          }}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" 
            style={{ backgroundColor: 'var(--highlights, var(--cta))' }}
          />
        </button>
      </div>
    </header>
  );
}

export default Header;
