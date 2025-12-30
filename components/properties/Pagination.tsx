'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage }: PaginationProps) {
  const t = useTranslations('properties');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: true });
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Results info */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('pagination.showing')} <span className="font-medium text-slate-700 dark:text-slate-200">{startItem}</span>-<span className="font-medium text-slate-700 dark:text-slate-200">{endItem}</span> {t('pagination.of')} <span className="font-medium text-slate-700 dark:text-slate-200">{totalItems}</span> {t('pagination.properties')}
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1 || isPending}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1735] disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={t('pagination.first')}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1735] disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => goToPage(page)}
                disabled={isPending}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition ${
                  page === currentPage
                    ? 'bg-amber-500 text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1735]'
                } disabled:opacity-50`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-slate-400 dark:text-slate-500">
                {page}
              </span>
            )
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1735] disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={t('pagination.next')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages || isPending}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1735] disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={t('pagination.last')}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="fixed top-4 right-4 bg-white dark:bg-[#13102b] shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 border border-slate-200 dark:border-[#2d2a4a] z-50">
          <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-600 dark:text-slate-400">{t('pagination.loading')}</span>
        </div>
      )}
    </div>
  );
}
