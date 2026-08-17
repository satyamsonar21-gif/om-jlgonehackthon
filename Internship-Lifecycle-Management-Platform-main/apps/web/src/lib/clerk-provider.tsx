import React from 'react';

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SafeUserButton({ role = 'U' }: { role?: string }) {
  const initial = role ? role[0].toUpperCase() : 'U';

  return (
    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
      {initial}
    </div>
  );
}
