"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  /** The final target number to count up to */
  end: number;
  /** Starting number, defaults to 0 */
  start?: number;
  /** Animation duration in milliseconds, default 2000 */
  duration?: number;
  /** String prepended to the number (e.g. "$") */
  prefix?: string;
  /** String appended to the number (e.g. "+", "%") */
  suffix?: string;
  /** Decimal places to show, defaults to 0 */
  decimals?: number;
  /** Custom formatter function (optional) */
  formatter?: (val: number) => string;
  /** CSS class names */
  className?: string;
  /** Whether to re-trigger when scrolling back into view, default true */
  replayOnScroll?: boolean;
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2200,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
  className = "",
  replayOnScroll = false,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(end);
  const [isClient, setIsClient] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    setDisplayValue(start);
  }, [start]);

  const formatNumber = (num: number): string => {
    if (formatter) return formatter(num);
    const fixed = num.toFixed(decimals);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${prefix}${parts.join(".")}${suffix}`;
  };

  useEffect(() => {
    if (!isClient) return;

    const element = elementRef.current;
    if (!element) return;

    // Ease-out exponential curve: counts rapidly at first, then decelerates smoothly to the target
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const runCountAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setIsCounting(true);
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);

        const currentVal = start + (end - start) * easedProgress;
        setDisplayValue(currentVal);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(end);
          setIsCounting(false);
          setHasAnimated(true);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountAnimation();
            if (!replayOnScroll) {
              observer.unobserve(entry.target);
            }
          } else if (replayOnScroll) {
            setDisplayValue(start);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient, end, start, duration, replayOnScroll]);

  return (
    <span
      ref={elementRef}
      className={`tabular-nums inline-block transition-transform duration-300 ${
        isCounting ? "scale-[1.02] text-opacity-95" : "scale-100"
      } ${className}`}
    >
      {formatNumber(displayValue)}
    </span>
  );
}
