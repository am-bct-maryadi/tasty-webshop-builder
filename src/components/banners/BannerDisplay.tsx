import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  position: string;
  is_active: boolean;
  display_order: number;
  branch_id: string;
  start_date: string;
  end_date: string;
}

interface BannerDisplayProps {
  position: 'hero' | 'sidebar' | 'footer' | 'popup' | 'after_branch_selection';
  branchId?: string;
  className?: string;
}

export const BannerDisplay: React.FC<BannerDisplayProps> = ({ position, branchId, className = '' }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBanners();
  }, [position, branchId]);

  const loadBanners = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('banners')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString().split('T')[0])
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('display_order', { ascending: true });

      // Filter by branch if specified
      if (branchId) {
        query = query.or(`branch_id.eq.${branchId},branch_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setBanners(data || []);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      if (banner.link_url.startsWith('http')) {
        window.open(banner.link_url, '_blank');
      } else {
        window.location.href = banner.link_url;
      }
    }
  };

  const handleCloseBanner = (bannerId: string) => {
    setClosedBanners(prev => new Set([...prev, bannerId]));
  };

  if (loading || banners.length === 0) {
    return null;
  }

  // Filter out closed banners
  const visibleBanners = banners.filter(banner => !closedBanners.has(banner.id));

  if (visibleBanners.length === 0) {
    return null;
  }

  const renderBanner = (banner: Banner) => {
    const isClickable = !!banner.link_url;

    return (
      <Card 
        key={banner.id} 
        className={`relative overflow-hidden ${
          isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
        } ${className}`}
        onClick={() => isClickable && handleBannerClick(banner)}
      >
        {position === 'popup' && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseBanner(banner.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <CardContent className="p-0">
          {banner.image_url && (
            <div className="relative">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-auto object-cover"
                style={{ 
                  maxHeight: position === 'hero' ? '400px' : 
                           position === 'sidebar' ? '200px' : 
                           position === 'after_branch_selection' ? '300px' : '150px' 
                }}
              />
              {(banner.title || banner.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  {banner.title && (
                    <h3 className="text-white font-semibold text-lg mb-1">{banner.title}</h3>
                  )}
                  {banner.description && (
                    <p className="text-white/90 text-sm">{banner.description}</p>
                  )}
                  {isClickable && (
                    <div className="flex items-center gap-1 mt-2 text-white/90">
                      <ExternalLink className="h-3 w-3" />
                      <span className="text-xs">Click to learn more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {!banner.image_url && (banner.title || banner.description) && (
            <div className="p-4">
              {banner.title && (
                <h3 className="font-semibold text-lg mb-2">{banner.title}</h3>
              )}
              {banner.description && (
                <p className="text-muted-foreground">{banner.description}</p>
              )}
              {isClickable && (
                <div className="flex items-center gap-1 mt-2 text-primary">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs">Click to learn more</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // For popup position, show banners one at a time with overlay
  if (position === 'popup') {
    const currentBanner = visibleBanners[0];
    if (!currentBanner) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="max-w-md w-full">
          {renderBanner(currentBanner)}
        </div>
      </div>
    );
  }

  // For other positions, show all banners
  return (
    <div className={`space-y-4 ${className}`}>
      {visibleBanners.map(renderBanner)}
    </div>
  );
};