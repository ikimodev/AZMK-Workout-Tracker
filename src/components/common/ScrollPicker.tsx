import React, { useRef, useEffect, UIEvent } from 'react';

interface ScrollPickerProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  orientation?: 'vertical' | 'horizontal';
  majorTickInterval?: number;
  mediumTickInterval?: number;
}

export const ScrollPicker: React.FC<ScrollPickerProps> = ({
  min, max, value, onChange, orientation = 'vertical', majorTickInterval = 10, mediumTickInterval = 5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  const itemSize = 12; // pixels per tick

  // Set initial scroll position on mount or when unit/range changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const scrollPos = (value - min) * itemSize;
      if (orientation === 'vertical') {
        el.scrollTop = scrollPos;
      } else {
        el.scrollLeft = scrollPos;
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [min, max, orientation]);

  // Keep scroll position in sync when value changes from outside
  useEffect(() => {
    if (isScrollingRef.current || isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const scrollPos = (value - min) * itemSize;
    if (orientation === 'vertical') {
      if (Math.abs(el.scrollTop - scrollPos) > 3) {
        el.scrollTop = scrollPos;
      }
    } else {
      if (Math.abs(el.scrollLeft - scrollPos) > 3) {
        el.scrollLeft = scrollPos;
      }
    }
  }, [value, min, orientation]);

  // Native non-passive Wheel & Trackpad scroll listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (orientation === 'horizontal') {
        // Prevent parent page vertical scroll so wheel moves the picker
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        el.scrollLeft += delta;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [orientation]);

  // Mouse Drag / Scrub listener on desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isMouseDown = false;
    let startPos = 0;
    let startScroll = 0;

    const onMouseDown = (e: MouseEvent) => {
      // Only handle left click
      if (e.button !== 0) return;
      isMouseDown = true;
      isDraggingRef.current = true;
      startPos = orientation === 'vertical' ? e.clientY : e.clientX;
      startScroll = orientation === 'vertical' ? el.scrollTop : el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const currentPos = orientation === 'vertical' ? e.clientY : e.clientX;
      const delta = startPos - currentPos;
      if (orientation === 'vertical') {
        el.scrollTop = startScroll + delta;
      } else {
        el.scrollLeft = startScroll + delta;
      }
    };

    const onMouseUp = () => {
      if (isMouseDown) {
        isMouseDown = false;
        el.style.cursor = 'grab';
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 60);
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [orientation]);

  // Handle native scroll updates (works for Touch swipe, Mouse wheel, Trackpad, and Drag)
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollPos = orientation === 'vertical' ? e.currentTarget.scrollTop : e.currentTarget.scrollLeft;
    let index = Math.round(scrollPos / itemSize);

    if (index < 0) index = 0;
    if (index > items.length - 1) index = items.length - 1;

    const newVal = min + index;

    isScrollingRef.current = true;

    if (newVal !== value) {
      onChange(newVal);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 120);
  };

  return (
    <div dir="ltr" className="relative w-full overflow-hidden select-none">
      {orientation === 'vertical' ? (
        <div className="relative w-full h-[300px] flex items-center">
          {/* Fading Gradients */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0A0A0B] to-transparent z-10 pointer-events-none" />

          {/* Center Green Indicator Line */}
          <div className="absolute left-0 right-0 flex items-center justify-end pointer-events-none z-20">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#34D399] to-[#34D399] shadow-[0_0_8px_#34D399]" />
          </div>

          {/* Scroll Area */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide relative z-0 cursor-grab active:cursor-grabbing"
            style={{
              paddingTop: `calc(150px - ${itemSize / 2}px)`,
              paddingBottom: `calc(150px - ${itemSize / 2}px)`,
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {items.map(val => {
              const isMajor = val % majorTickInterval === 0;
              const isMedium = val % mediumTickInterval === 0;
              return (
                <div
                  key={val}
                  onClick={() => {
                    onChange(val);
                    if (containerRef.current) {
                      containerRef.current.scrollTo({ top: (val - min) * itemSize, behavior: 'smooth' });
                    }
                  }}
                  className="flex justify-end items-center cursor-pointer"
                  style={{ height: itemSize }}
                >
                  <div
                    className={`bg-slate-500 rounded-l-full transition-all duration-150 ${
                      isMajor ? 'w-10 h-[3px] bg-slate-300' : isMedium ? 'w-6 h-[2px] bg-slate-400' : 'w-3 h-[2px]'
                    } ${value === val ? '!bg-[#34D399] w-12 h-[3px] shadow-[0_0_6px_#34D399]' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[120px] flex flex-col justify-end">
          {/* Fading Gradients */}
          <div className="absolute top-0 bottom-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10 pointer-events-none" />

          {/* Center Green Indicator Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-start pointer-events-none z-20">
            <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-[#34D399] to-[#34D399] shadow-[0_0_8px_#34D399]" />
          </div>

          {/* Scroll Area */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-x-scroll overflow-y-hidden scrollbar-hide flex items-center relative z-0 cursor-grab active:cursor-grabbing"
            style={{
              paddingLeft: `calc(50% - ${itemSize / 2}px)`,
              paddingRight: `calc(50% - ${itemSize / 2}px)`,
              touchAction: 'pan-x',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {items.map(val => {
              const isMajor = val % majorTickInterval === 0;
              const isMedium = val % mediumTickInterval === 0;
              return (
                <div
                  key={val}
                  onClick={() => {
                    onChange(val);
                    if (containerRef.current) {
                      containerRef.current.scrollTo({ left: (val - min) * itemSize, behavior: 'smooth' });
                    }
                  }}
                  className="flex flex-col justify-center items-center flex-shrink-0 cursor-pointer select-none"
                  style={{ width: itemSize, height: '100%' }}
                >
                  <div
                    className={`bg-slate-500 rounded-full transition-all duration-150 ${
                      isMajor ? 'w-[3px] h-10 bg-slate-300' : isMedium ? 'w-[2px] h-6 bg-slate-400' : 'w-[2px] h-3'
                    } ${value === val ? '!bg-[#34D399] w-[3px] h-12 shadow-[0_0_6px_#34D399]' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
