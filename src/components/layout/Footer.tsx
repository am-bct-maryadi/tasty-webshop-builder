import React from 'react';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export const Footer: React.FC = () => {
  const { brandSettings, branches, isLoadingBrandSettings } = useAdmin();

  // Don't render if brand settings are still loading
  if (isLoadingBrandSettings) {
    return null;
  }

  const socialLinks = [
    { name: 'Facebook', url: brandSettings.socialMedia.facebook, icon: Facebook },
    { name: 'Twitter', url: brandSettings.socialMedia.twitter, icon: Twitter },
    { name: 'Instagram', url: brandSettings.socialMedia.instagram, icon: Instagram },
    { name: 'LinkedIn', url: brandSettings.socialMedia.linkedin, icon: Linkedin },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Brand Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 justify-center">
            {brandSettings.logo ? (
              <img 
                src={brandSettings.logo} 
                alt={brandSettings.companyName} 
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {brandSettings.companyName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-bold text-lg">{brandSettings.companyName}</span>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {brandSettings.tagline}
          </p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {brandSettings.footerText}
          </p>
        </div>

        {/* Branches Grid */}
        <div className={`grid gap-8 mb-8 ${branches.length === 1 ? 'grid-cols-1' : branches.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {branches.map((branch) => (
            <div key={branch.id} className="space-y-4">
              <h3 className="font-semibold text-center">{branch.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 justify-center">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-center">{branch.address}</span>
                </div>
                {branch.whatsappNumber && (
                  <div className="flex items-center gap-3 justify-center">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a 
                      href={`tel:${branch.whatsappNumber}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {branch.whatsappNumber}
                    </a>
                  </div>
                )}
                {brandSettings.email && (
                  <div className="flex items-center gap-3 justify-center">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a 
                      href={`mailto:${brandSettings.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {brandSettings.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div className="flex justify-center mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Follow Us</h3>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                if (!social.url) return null;
                
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Stay connected for the latest updates and offers!
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            {brandSettings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};