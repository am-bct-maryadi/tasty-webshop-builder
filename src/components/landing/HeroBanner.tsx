import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import heroImage from '@/assets/hero-food-banner.jpg';

const bannerSlides = [
  {
    id: 1,
    title: "Delicious Food, Delivered Fresh",
    subtitle: "Choose your nearest branch and start ordering",
    image: heroImage,
    cta: "Order Now"
  },
  {
    id: 2,
    title: "Fresh Ingredients Daily",
    subtitle: "Farm to table, quality guaranteed",
    image: heroImage,
    cta: "View Menu"
  },
  {
    id: 3,
    title: "Fast & Reliable Delivery",
    subtitle: "Hot food delivered to your doorstep",
    image: heroImage,
    cta: "Track Order"
  }
];

export const HeroBanner: React.FC = () => {
  const { brandSettings } = useAdmin();

  return (
    <div className="relative w-full">
      <Carousel className="w-full" opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {bannerSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative min-h-[50vh] bg-gradient-hero text-white overflow-hidden">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Content */}
                <div className="relative flex items-center justify-center h-full px-6 py-12">
                  <div className="text-center max-w-2xl">
                    {/* Brand Logo */}
                    {brandSettings.logo && (
                      <div className="flex justify-center mb-6">
                        <img 
                          src={brandSettings.logo} 
                          alt={brandSettings.companyName} 
                          className="h-16 md:h-20 w-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    {!brandSettings.logo && (
                      <div className="flex justify-center mb-6">
                        <div className="h-16 md:h-20 w-20 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {brandSettings.companyName.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 mb-6 animate-fade-in">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 text-white border-white/30 hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 text-white border-white/30 hover:bg-white/30" />
      </Carousel>
    </div>
  );
};