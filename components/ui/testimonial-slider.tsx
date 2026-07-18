"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  username: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  { 
    id: 1, 
    quote: "S Square Architects didn't just build a home; they constructed our family legacy. The way natural Punjab daylight fills the central double-height atrium in our estate is nothing short of spiritual. Their meticulous integration of modern architecture and Vastu Shastra is masterful.", 
    name: "Harmanpreet Singh Grewal", 
    username: "Industrialist, Grewal Industries", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=150&ixlib=rb-4.0.3" 
  },
  { 
    id: 2, 
    quote: "Designing our corporate headquarters required a balance of environmental performance and visual dominance. S Square Architects delivered an iconic glass-concrete tower that has become a landmark on Ferozepur Road. Their BIM process saved us millions in structural revisions.", 
    name: "Ananya Oswal", 
    username: "VP Operations, Oswal Retail Group", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=150&ixlib=rb-4.0.3" 
  },
  { 
    id: 3, 
    quote: "Their design team operates at a level of dedication rarely seen. They supervised every single concrete pouring phase on our resort project to ensure the shuttering board marks matched the visual plan exactly. A premium agency experience from blueprint to keys.", 
    name: "Rajiv Lamba", 
    username: "Owner, Lamba Hotels & Resorts", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=150&ixlib=rb-4.0.3" 
  }
];

const getVisibleCount = (width: number): number => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      const oldVisibleCount = getVisibleCount(windowWidth);
      const newVisibleCount = getVisibleCount(newWidth);
      
      if (oldVisibleCount !== newVisibleCount) {
        const maxIndexForNewWidth = testimonials.length - newVisibleCount;
        if (currentIndex > maxIndexForNewWidth) {
          setCurrentIndex(Math.max(0, maxIndexForNewWidth));
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        const visibleCount = getVisibleCount(windowWidth);
        const maxIndex = testimonials.length - visibleCount;

        if (currentIndex >= maxIndex) {
          setDirection(-1);
          setCurrentIndex((prev) => prev - 1);
        } else if (currentIndex <= 0) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex((prev) => prev + direction);
        }
      }, 5000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, windowWidth, direction]);

  const visibleCount = getVisibleCount(windowWidth);
  const maxIndex = testimonials.length - visibleCount;
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      pauseAutoPlay();
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      pauseAutoPlay();
    }
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleDragEnd = (event: any, info: any) => {
    const { offset } = info;
    const swipeThreshold = 30;

    if (offset.x < -swipeThreshold && canGoNext) {
      goNext();
    } else if (offset.x > swipeThreshold && canGoPrev) {
      goPrev();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  return (
    <div className="px-6 py-16 sm:py-24 bg-[#F5F2EB] dark:bg-[#111111] overflow-hidden transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="inline-block py-1 px-3 bg-[#C9A66B]/10 dark:bg-[#C9A66B]/15 text-[#C9A66B] font-medium text-xs sm:text-sm uppercase tracking-wider">
            Client Endorsements
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#111111] dark:text-[#F5F2EB] mt-3 sm:mt-4 px-4">
            Patrons of Our Space
          </h3>
          <div className="w-16 h-[1px] bg-[#C9A66B] mx-auto mt-6"></div>
        </motion.div>

        <div className="relative" ref={containerRef}>
          <div className="flex justify-center sm:justify-end sm:absolute sm:-top-20 right-0 space-x-3 mb-6 sm:mb-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              disabled={!canGoPrev}
              className={`p-3 border ${
                canGoPrev 
                  ? 'border-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#111111] text-[#C9A66B]' 
                  : 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              } transition-all duration-300`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              disabled={!canGoNext}
              className={`p-3 border ${
                canGoNext 
                  ? 'border-[#C9A66B] hover:bg-[#C9A66B] hover:text-[#111111] text-[#C9A66B]' 
                  : 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              } transition-all duration-300`}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>

          <div className="overflow-hidden relative px-2 sm:px-0">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{ 
                type: 'spring', 
                stiffness: 70, 
                damping: 20 
              }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className={`flex-shrink-0 w-full ${
                    visibleCount === 3 ? 'md:w-1/3' : 
                    visibleCount === 2 ? 'md:w-1/2' : 'w-full'
                  } p-3`}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                  style={{ cursor: 'grab' }}
                >
                  <motion.div 
                    className="relative overflow-hidden p-6 sm:p-8 h-full bg-[#ffffff] dark:bg-[#181818] border border-[#E5E0DA] dark:border-[#222222] transition-colors duration-500 shadow-sm"
                  >
                    <div className="absolute -top-4 -left-4 opacity-5 dark:opacity-10">
                      <Quote size={80} className="text-[#C9A66B]" />
                    </div>
                    
                    <div className="relative z-10 h-full flex flex-col">
                      <p className="font-serif text-base sm:text-lg text-[#333333] dark:text-[#CCCCCC] font-light italic mb-6 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-[#E5E0DA] dark:border-[#222222] transition-colors duration-500">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0">
                            <img
                              width={40}
                              height={40}
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#C9A66B]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100';
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-sans font-semibold text-sm sm:text-base text-[#111111] dark:text-[#F5F2EB]">{testimonial.name}</h4>
                            <p className="text-[#C9A66B] text-xs font-light tracking-wide">{testimonial.username}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
              
          <div className="flex justify-center mt-8">
            {Array.from({ length: testimonials.length - visibleCount + 1 }, (_: any, index: any) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative mx-1.5 focus:outline-none"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#C9A66B] scale-125' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
