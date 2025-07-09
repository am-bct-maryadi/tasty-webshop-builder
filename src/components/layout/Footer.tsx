import React from 'react';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export const Footer: React.FC = () => {
  const { brandSettings } = useAdmin();

  const socialLinks = [
    { name: 'Facebook', url: brandSettings.socialMedia.facebook, icon: Facebook },
    { name: 'Twitter', url: brandSettings.socialMedia.twitter, icon: Twitter },
    { name: 'Instagram', url: brandSettings.socialMedia.instagram, icon: Instagram },
    { name: 'LinkedIn', url: brandSettings.socialMedia.linkedin, icon: Linkedin },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
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
            <p className="text-sm text-muted-foreground">
              {brandSettings.tagline}
            </p>
            <p className="text-sm text-muted-foreground">
              {brandSettings.footerText}
            </p>
          </div>


          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{brandSettings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a 
                  href={`tel:${brandSettings.phone}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {brandSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a 
                  href={`mailto:${brandSettings.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {brandSettings.email}
                </a>
              </div>
              {brandSettings.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a 
                    href={brandSettings.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {brandSettings.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold">Follow Us</h3>
            <div className="flex gap-3">
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
            <p className="text-xs text-muted-foreground">
              Stay connected for the latest updates and offers!
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            {brandSettings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};