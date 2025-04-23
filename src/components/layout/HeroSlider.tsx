"use client"

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    image: '/hero-slide-1.jpg',
    alt: 'Marketplace hero image',
    title: 'Welcome to Going',
    subtitle: 'Your marketplace with cryptocurrency payments',
    html: (index: number, currentSlide: number) =>
      <section key={currentSlide} className={`absolute w-full h-full flex bg-black items-center justify-center transition-all ease-in-out duration-1500 ${index === currentSlide
        ? 'opacity-100 scale-100'
        : 'opacity-0 scale-105'
        }`}>
        {/* Overlay pattern inspired by the logo */}
        <div className=" dot-pattern pointer-events-none"></div>

        {/* Hero Content */}
        <div className=" flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              <span className="text-gradient-brand">Going</span> Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              The next generation marketplace with cryptocurrency support
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="btn-primary">
                Explore Products
              </Link>
              <Link href="/categories" className="btn-secondary">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

  },
  {
    id: 2,
    image: '/hero-slide-2.jpg',
    alt: 'Shopping experience',
    title: 'Buy and sell easily',
    subtitle: 'With the security of the Solana blockchain',
  },
  {
    id: 3,
    image: '/hero-slide-3.jpg',
    alt: 'Crypto payments',
    title: 'Instant payments',
    subtitle: 'Directly to the seller\'s wallet',
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        changeSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Handle slide change with animation state
  const changeSlide = (getNextIndex: (prev: number) => number) => {
    setIsAnimating(true);
    setCurrentSlide(getNextIndex);

    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // Manual navigation
  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      changeSlide(() => index);
    }
  };

  const nextSlide = () => {
    if (!isAnimating) {
      changeSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      changeSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden  bg-gradient-to-r from-primary/70 to-secondary/70">
      {/* Overlay gradient */}
      {/* <div className=" bg-gradient-to-r from-primary/70 to-secondary/70">
      </div> */}

      {/* Slides */}
      {slides.map((slide, index) => (
        slide.html ?
          slide.html(index, currentSlide) 
          :
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all ease-in-out duration-1500 ${index
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
              }`}
          >
            {/* Image placeholder - replace with actual images when available */}
            <div className="w-full h-full">
              {/* Uncomment when you have actual images */}
              {/* <Image 
              src={slide.image} 
              alt={slide.alt} 
              fill 
              className="object-cover"
              priority={index === 0}
            /> */}
            </div>

            {/* Slide content */}
            <div
              className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4 transition-all duration-1500 ${index === currentSlide
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl max-w-2xl">{slide.subtitle}</p>
            </div>
          </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-300"
        aria-label="Previous slide"
        disabled={isAnimating}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-300"
        aria-label="Next slide"
        disabled={isAnimating}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  );
}
