import React, { useEffect, useState } from 'react';
import { BannerDisplay } from './BannerDisplay';

interface BranchSelectionBannerProps {
  selectedBranch: string | null;
  className?: string;
}

export const BranchSelectionBanner: React.FC<BranchSelectionBannerProps> = ({ 
  selectedBranch, 
  className = '' 
}) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (selectedBranch) {
      // Show banner after branch selection with a small delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [selectedBranch]);

  if (!showBanner || !selectedBranch) {
    return null;
  }

  return (
    <div className={`animate-fade-in ${className}`}>
      <BannerDisplay 
        position="after_branch_selection" 
        branchId={selectedBranch}
        className="mb-6"
      />
    </div>
  );
};