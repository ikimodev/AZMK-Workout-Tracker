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
  const startPosRef = useRef(0);
  const startScrollRef = useRef(0);

  const itemSize = 12; // pixels per tick

  // Initialize scroll position when mounted
  useEffect(() => {
    if (containerRef.current) {
      const scrollPos = (value - min) * itemSize;
      if (orientation === 'vertical') {
        containerRef.current.scrollTop = scrollPos;
      } else {
        containerRef.current.scrollLeft = scrollPos;
      }
    }
  }, []);

  // When value changes from outside, smooth scroll there
  useEffect(() => {
    if (isScrollingRef.current) return;
    
    if (containerRef.current) {
      const scrollPos = (value - min) * itemSize;
      if (orientation === 'vertical') {
        containerRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' });
      } else {
        containerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, [value, min, orientation]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
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
      const exactScrollPos = index * itemSize;
      if (orientation === 'vertical') {
        containerRef.current?.scrollTo({ top: exactScrollPos, behavior: 'smooth' });
      } else {
        containerRef.current?.scrollTo({ left: exactScrollPos, behavior: 'smooth' });
      }
    }, 150);
  };

  // Pointer drag support for effortless desktop & mobile scrubbing
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    startPosRef.current = orientation === 'vertical' ? e.clientY : e.clientX;
    startScrollRef.current = orientation === 'vertical' ? containerRef.current.scrollTop : containerRef.current.scrollLeft;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const currentPos = orientation === 'vertical' ? e.clientY : e.clientX;
    const delta = startPosRef.current - currentPos;
    if (orientation === 'vertical') {
      containerRef.current.scrollTop = startScrollRef.current + delta;
    } else {
      containerRef.current.scrollLeft = startScrollRef.current + delta;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  return (
    <div className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing">
      {orientation === 'vertical' ? (
        <div 
          className="relative w-full h-[300px] flex items-center touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Fading Gradients */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
          
          {/* Center Green Line */}
          <div className="absolute left-0 right-0 flex items-center justify-end pointer-events-none z-20">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#34D399] to-[#34D399] shadow-[0_0_8px_#34D399]" />
          </div>

          {/* Scroll Area */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide relative z-0"
            style={{
              paddingTop: `calc(150px - ${itemSize / 2}px)`,
              paddingBottom: `calc(150px - ${itemSize / 2}px)`,
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
                  className="flex justify-end items-center"
                  style={{ height: itemSize }}
                >
                  <div 
                    className={`bg-slate-500 rounded-l-full transition-all duration-150 ${
                      isMajor ? 'w-10 h-[3px] bg-slate-300' : isMedium ? 'w-6 h-[2px] bg-slate-400' : 'w-3 h-[2px]'
                    } ${value === val ? '!bg-[#34D399] w-12 h-[3px]' : ''}`} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div 
          className="relative w-full h-[120px] flex flex-col justify-end touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Fading Gradients */}
          <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-1/3 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
          
          {/* Center Green Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-start pointer-events-none z-20">
            <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-[#34D399] to-[#34D399] shadow-[0_0_8px_#34D399]" />
          </div>

          {/* Scroll Area */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center relative z-0"
            style={{
              paddingLeft: `calc(50% - ${itemSize / 2}px)`,
              paddingRight: `calc(50% - ${itemSize / 2}px)`,
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
                  className="flex flex-col justify-center items-center flex-shrink-0"
                  style={{ width: itemSize, height: '100%' }}
                >
                  <div 
                    className={`bg-slate-500 rounded-full transition-all duration-150 ${
                      isMajor ? 'w-[3px] h-10 bg-slate-300' : isMedium ? 'w-[2px] h-6 bg-slate-400' : 'w-[2px] h-3'
                    } ${value === val ? '!bg-[#34D399] w-[3px] h-12' : ''}`} 
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
