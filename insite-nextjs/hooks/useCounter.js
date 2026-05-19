import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animated number counting
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} start - Starting number (default: 0)
 * @param {function} easing - Easing function for animation
 */
export function useCounter(end, duration = 2000, start = 0, easing = easeOutExpo) {
  const [count, setCount] = useState(start);
  const [isActive, setIsActive] = useState(false);
  const frameRef = useRef();

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    const change = endValue - startValue;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easing(progress);
      const currentCount = Math.floor(startValue + change * easedProgress);
      
      setCount(currentCount);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(updateCount);
      }
    };

    frameRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isActive, end, duration, start, easing]);

  const startCounting = () => setIsActive(true);
  const resetCounter = () => {
    setIsActive(false);
    setCount(start);
  };

  return { count, startCounting, resetCounter, isActive };
}

/**
 * Custom hook that combines counter with scroll animation
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {Object} scrollOptions - Options for scroll animation
 */
export function useScrollTriggeredCounter(end, duration = 2000, scrollOptions = {}) {
  const { count, startCounting, resetCounter } = useCounter(end, duration);
  const [elementRef, isVisible] = useScrollAnimation(scrollOptions);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isVisible && !hasStarted) {
      startCounting();
      setHasStarted(true);
    }
  }, [isVisible, hasStarted, startCounting]);

  return { count, elementRef, isVisible, resetCounter };
}

// Easing functions
export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Hook for scroll animation without counter functionality
function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
}