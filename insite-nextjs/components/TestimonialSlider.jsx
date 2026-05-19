'use client'
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSlider = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="relative">
      {/* Main testimonial display */}
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mx-auto max-w-4xl">
        <div className="text-center">
          {/* Quote Icon */}
          <div className="text-6xl text-insite-blue/20 mb-6">"</div>
          
          {/* Testimonial Text */}
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
            {testimonials[currentSlide]?.testimonial}
          </p>
          
          {/* Rating */}
          <div className="flex justify-center mb-6">
            {renderStars(testimonials[currentSlide]?.rating || 5)}
          </div>
          
          {/* Author Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <img 
              src={testimonials[currentSlide]?.image} 
              alt={testimonials[currentSlide]?.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-insite-blue/20"
            />
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-gray-900">
                {testimonials[currentSlide]?.name}
              </h4>
              <p className="text-insite-blue font-medium">
                {testimonials[currentSlide]?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-insite-blue hover:bg-insite-blue hover:text-white transition-colors z-10"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-insite-blue hover:bg-insite-blue hover:text-white transition-colors z-10"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-insite-blue' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Alternative: Show all testimonials in a grid on larger screens */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-16">
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id}
            className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
              index === currentSlide ? 'ring-2 ring-primary transform scale-105' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex mb-4">
              {renderStars(testimonial.rating)}
            </div>
            
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              "{testimonial.testimonial.substring(0, 120)}..."
            </p>
            
            <div className="flex items-center">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h5 className="font-semibold text-gray-900 text-sm">
                  {testimonial.name}
                </h5>
                <p className="text-insite-blue text-xs">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
