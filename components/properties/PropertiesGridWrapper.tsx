'use client';

import { ReactNode } from 'react';
import { useFilterContext } from './FilterContext';
import { PropertySkeletonGrid } from './PropertySkeleton';

interface PropertiesGridWrapperProps {
  children: ReactNode;
}

export default function PropertiesGridWrapper({ children }: PropertiesGridWrapperProps) {
  const { isPending } = useFilterContext();

  if (isPending) {
    return <PropertySkeletonGrid count={6} />;
  }

  return <>{children}</>;
}
