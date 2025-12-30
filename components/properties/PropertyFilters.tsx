'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFilterContext } from './FilterContext';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  DollarSign,
  Ruler,
  BedDouble,
  Bath,
  Calendar,
  Sofa,
  Sparkles
} from 'lucide-react';

const PROPERTY_TYPES = [
  'apartment',
  'villa',
  'house',
  'penthouse',
  'studio',
  'duplex',
  'land',
  'commercial',
  'office'
];

const AMENITIES_LIST = [
  'pool',
  'gym',
  'parking',
  'security',
  'elevator',
  'balcony',
  'garden',
  'sea_view',
  'city_view',
  'air_conditioning',
  'heating',
  'storage'
];

export default function PropertyFilters() {
  const t = useTranslations('properties');
  const searchParams = useSearchParams();
  const { isPending, navigate } = useFilterContext();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current filter values from URL
  const currentFilters = {
    type: searchParams.get('type') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    furnished: searchParams.get('furnished') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || []
  };

  const [filters, setFilters] = useState(currentFilters);

  const updateFilter = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.type) params.set('type', filters.type);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minArea) params.set('minArea', filters.minArea);
    if (filters.maxArea) params.set('maxArea', filters.maxArea);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);
    if (filters.minYear) params.set('minYear', filters.minYear);
    if (filters.maxYear) params.set('maxYear', filters.maxYear);
    if (filters.furnished) params.set('furnished', filters.furnished);
    if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));

    // Reset to page 1 when filters change
    params.set('page', '1');

    navigate(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      bedrooms: '',
      bathrooms: '',
      minYear: '',
      maxYear: '',
      furnished: '',
      amenities: []
    });
    navigate('?page=1');
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'amenities') return (value as string[]).length > 0;
    return value !== '';
  });

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'amenities') return count + (value as string[]).length;
    return count + (value ? 1 : 0);
  }, 0);

  return (
    <div className="bg-white dark:bg-[#13102b] rounded-xl shadow-sm border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
      {/* Main Filter Bar */}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          {/* Sale Type */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
            >
              <option value="">{t('filters.allTypes')}</option>
              <option value="sale">{t('filters.forSale')}</option>
              <option value="rent">{t('filters.forRent')}</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Property Type */}
          <div className="relative">
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
            >
              <option value="">{t('filters.allPropertyTypes')}</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{t(`filters.propertyTypes.${type}`)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder={t('filters.minPrice')}
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-24 bg-slate-50 dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg pl-7 pr-2 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
            <span className="text-slate-400 text-sm">-</span>
            <input
              type="number"
              placeholder={t('filters.maxPrice')}
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-24 bg-slate-50 dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-2 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          {/* Area Range - hidden on smaller screens */}
          <div className="hidden xl:flex items-center gap-1">
            <div className="relative">
              <Ruler className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder={t('filters.minArea')}
                value={filters.minArea}
                onChange={(e) => updateFilter('minArea', e.target.value)}
                className="w-20 bg-slate-50 dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg pl-7 pr-2 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
            <span className="text-slate-400 text-sm">-</span>
            <input
              type="number"
              placeholder={t('filters.maxArea')}
              value={filters.maxArea}
              onChange={(e) => updateFilter('maxArea', e.target.value)}
              className="w-20 bg-slate-50 dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-2 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            <span className="text-slate-400 text-xs">m²</span>
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isExpanded || activeFilterCount > 4
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-100 dark:bg-[#1a1735] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#231f42]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{t('filters.moreFilters')}</span>
            {activeFilterCount > 4 && (
              <span className="bg-slate-900 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount - 4}
              </span>
            )}
          </button>

          {/* Apply & Clear Buttons - always on same row */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                disabled={isPending}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title={t('filters.clear')}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={applyFilters}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t('filters.search')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-[#2d2a4a] p-4 bg-slate-50/50 dark:bg-[#0c0a1d]/50">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Area Range - shown in expanded on smaller screens */}
            <div className="xl:hidden">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Ruler className="w-4 h-4 text-amber-500" />
                Area (m²)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t('filters.minArea')}
                  value={filters.minArea}
                  onChange={(e) => updateFilter('minArea', e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder={t('filters.maxArea')}
                  value={filters.maxArea}
                  onChange={(e) => updateFilter('maxArea', e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <BedDouble className="w-4 h-4 text-amber-500" />
                {t('filters.bedrooms')}
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => updateFilter('bedrooms', e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                <option value="">{t('filters.any')}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Bath className="w-4 h-4 text-amber-500" />
                {t('filters.bathrooms')}
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => updateFilter('bathrooms', e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                <option value="">{t('filters.any')}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Year Built Range */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                {t('filters.yearBuilt')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t('filters.from')}
                  value={filters.minYear}
                  onChange={(e) => updateFilter('minYear', e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder={t('filters.to')}
                  value={filters.maxYear}
                  onChange={(e) => updateFilter('maxYear', e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Furnished */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Sofa className="w-4 h-4 text-amber-500" />
                {t('filters.furnished')}
              </label>
              <select
                value={filters.furnished}
                onChange={(e) => updateFilter('furnished', e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a] rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                <option value="">{t('filters.any')}</option>
                <option value="true">{t('filters.furnishedYes')}</option>
                <option value="false">{t('filters.furnishedNo')}</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t('filters.amenities')}
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    filters.amenities.includes(amenity)
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#231f42]'
                  }`}
                >
                  {t(`filters.amenitiesList.${amenity}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && !isExpanded && (
        <div className="border-t border-slate-200 dark:border-[#2d2a4a] px-4 py-2 flex flex-wrap gap-2 bg-slate-50/50 dark:bg-[#0c0a1d]/50">
          {filters.type && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              {filters.type === 'sale' ? t('filters.forSale') : t('filters.forRent')}
              <button onClick={() => updateFilter('type', '')} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.propertyType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              {t(`filters.propertyTypes.${filters.propertyType}`)}
              <button onClick={() => updateFilter('propertyType', '')} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
              <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(filters.minArea || filters.maxArea) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              {filters.minArea || '0'} - {filters.maxArea || '∞'} m²
              <button onClick={() => { updateFilter('minArea', ''); updateFilter('maxArea', ''); }} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.bedrooms && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              {filters.bedrooms}+ {t('filters.bedrooms')}
              <button onClick={() => updateFilter('bedrooms', '')} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.bathrooms && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              {filters.bathrooms}+ {t('filters.bathrooms')}
              <button onClick={() => updateFilter('bathrooms', '')} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.amenities.map(amenity => (
            <span key={amenity} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-xs">
              {t(`filters.amenitiesList.${amenity}`)}
              <button onClick={() => toggleAmenity(amenity)} className="hover:text-amber-900 dark:hover:text-amber-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
