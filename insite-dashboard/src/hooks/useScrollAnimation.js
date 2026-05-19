import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {string} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!hasTriggered || !triggerOnce)) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
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
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [elementRef, isVisible];
}

/**
 * Custom hook for staggered scroll animations
 * @param {number} itemCount - Number of items to animate
 * @param {number} delay - Delay between each item animation (ms)
 */
export function useStaggeredScrollAnimation(itemCount, delay = 100) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [elementRef, isVisible] = useScrollAnimation();

  useEffect(() => {
    if (isVisible && visibleItems.size === 0) {
      // Start staggered animation
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems(prev => new Set([...prev, i]));
        }, i * delay);
      }
    }
  }, [isVisible, itemCount, delay, visibleItems.size]);

  const isItemVisible = (index) => visibleItems.has(index);

  return [elementRef, isItemVisible];
}