'use client';

import { createContext, useContext, useState, useTransition, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface FilterContextType {
  isPending: boolean;
  navigate: (url: string) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (url: string) => {
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  };

  return (
    <FilterContext.Provider value={{ isPending, navigate }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
}
