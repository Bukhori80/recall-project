import React, { useState, useEffect, ReactNode } from 'react';

// Tooltip Component
export const Tooltip = ({ children, content }: { children?: ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-lg shadow-xl opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none animate-fade-up" style={{ animationDuration: '0.2s' }}>
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
        </div>
      )}
    </div>
  );
};

// CountUp Component
export const CountUp = ({ value, duration = 1500 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Basic parsing to extract the first number sequence found
  // e.g. "IDR 250K" -> match "250"
  // e.g. "25.4 GB" -> match "25.4"
  // e.g. "2-3 jam" -> match "2"
  const match = value.match(/(\d+(?:[.,]\d+)?)/);

  if (!match) {
    return <span>{value}</span>;
  }

  const rawNumber = match[0];
  // Standardize number (handle standard JS float)
  // If comma is used as decimal separator like in ID locale (e.g. 75,000 or 75,5), simple parseFloat might cut it off or work depending on input. 
  // For this demo, we assume dot is decimal or simple integer.
  // We'll strip commas if they look like thousands separators (simple heuristic: if followed by 3 digits).
  // But let's keep it simple: just parse what we found.
  const num = parseFloat(rawNumber.replace(/,/g, ''));

  const prefix = value.substring(0, match.index);
  const suffix = value.substring((match.index || 0) + rawNumber.length);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease out quart
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(easeProgress * num);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [num, duration]);

  // Formatting logic to reconstruct the number
  const isFloat = rawNumber.includes('.');
  const decimals = isFloat ? rawNumber.split('.')[1].length : 0;

  let formattedNumber = displayValue.toFixed(decimals);

  // If the original had comma as thousands separator or dot as thousands separator, this simple logic won't replicate it perfectly 
  // without a locale library. We will just render the interpolated number.

  return (
    <span>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
};

// ScrollReveal Component
export const ScrollReveal = ({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Typewriter Component
export const Typewriter = ({ texts, speed = 100, pause = 2000 }: { texts: string[]; speed?: number; pause?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index >= texts.length) return; // Should not happen with current logic

    const timeout = setTimeout(() => {
      // Writing
      if (!reverse) {
        if (subIndex < texts[index].length) {
          setDisplayText(prev => prev + texts[index][subIndex]);
          setSubIndex(prev => prev + 1);
        } else {
          // Finished writing, wait then reverse
          setTimeout(() => setReverse(true), pause);
        }
      }
      // Deleting
      else {
        if (subIndex > 0) {
          setDisplayText(prev => prev.slice(0, -1));
          setSubIndex(prev => prev - 1);
        } else {
          // Finished deleting, move to next text
          setReverse(false);
          setIndex(prev => (prev + 1) % texts.length);
        }
      }
    }, reverse ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts, speed, pause]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse border-r-2 border-primary ml-1 h-full">&nbsp;</span>
    </span>
  );
};

// Floating Element (Parallax-ish)
export const FloatingElement = ({ children, depth = 1 }: { children: ReactNode; depth?: number }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth - e.pageX * depth) / 100;
      const y = (window.innerHeight - e.pageY * depth) / 100;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [depth]);

  return (
    <div
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: 'transform 0.1s ease-out' }}
    >
      {children}
    </div>
  );
};