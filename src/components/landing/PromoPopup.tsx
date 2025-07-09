import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto bg-gradient-hero border-0 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Gift className="h-6 w-6" />
              Special Offer!
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">🎉 Welcome Bonus!</h3>
            <p className="text-lg mb-4">Get 20% OFF on your first order</p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-sm opacity-90">Use code:</p>
              <p className="text-2xl font-bold tracking-wider">WELCOME20</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-white text-primary hover:bg-white/90"
              onClick={onClose}
            >
              Claim Offer
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};