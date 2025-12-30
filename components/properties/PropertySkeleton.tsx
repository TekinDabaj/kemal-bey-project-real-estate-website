export default function PropertySkeleton() {
  return (
    <div className="bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm border border-slate-100 dark:border-[#2d2a4a] animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/50 dark:via-[#2d2a4a]/50 to-transparent skeleton-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-slate-200 dark:bg-[#1a1735] rounded w-3/4" />

        {/* Location */}
        <div className="h-3 bg-slate-200 dark:bg-[#1a1735] rounded w-1/2" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-[#1a1735] rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-[#1a1735] rounded w-5/6" />
        </div>

        {/* Features */}
        <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-[#2d2a4a]">
          <div className="h-4 bg-slate-200 dark:bg-[#1a1735] rounded w-16" />
          <div className="h-4 bg-slate-200 dark:bg-[#1a1735] rounded w-16" />
          <div className="h-4 bg-slate-200 dark:bg-[#1a1735] rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function PropertySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertySkeleton key={i} />
      ))}
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="bg-white dark:bg-[#13102b] rounded-xl shadow-sm border border-slate-200 dark:border-[#2d2a4a] p-4 animate-pulse">
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-32" />
        <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-36" />
        <div className="flex items-center gap-2">
          <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-28" />
          <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-28" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-24" />
          <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-24" />
        </div>
        <div className="h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-32" />
        <div className="ml-auto h-10 bg-slate-200 dark:bg-[#1a1735] rounded-lg w-24" />
      </div>
    </div>
  );
}
