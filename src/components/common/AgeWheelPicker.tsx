import React, { useRef, useEffect, UIEvent } from 'react';

interface AgeWheelPickerProps {
  value: number;
  onChange: (age: number) => void;
  min?: number;
  max?: number;
}

export const AgeWheelPicker: React.FC<AgeWheelPickerProps> = ({
  value,
  onChange,
  min = 12,
  max = 99
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  const slotHeight = 72; // Height of each number row in pixels
  const visibleHeight = 360; // 5 visible slots: 2 above, 1 selected, 2 below
  const paddingY = (visibleHeight - slotHeight) / 2; // 144px

  // Center the initial value on mount or when min/max change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targetPos = (value - min) * slotHeight;
    el.scrollTop = targetPos;

    // Second check after render/font loading
    const timer = setTimeout(() => {
      if (el) el.scrollTop = (value - min) * slotHeight;
    }, 50);

    return () => clearTimeout(timer);
  }, [min, max]);

  // Keep scroll in sync if value changed externally (and user is not currently dragging/scrolling)
  useEffect(() => {
    if (isScrollingRef.current || isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const targetPos = (value - min) * slotHeight;
    if (Math.abs(el.scrollTop - targetPos) > 4) {
      el.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  }, [value, min]);

  // Handle native vertical scrolling (touch swipe, wheel, drag, snap)
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    let index = Math.round(scrollTop / slotHeight);

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

  // Mouse Drag on Desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isMouseDown = false;
    let startY = 0;
    let startScrollTop = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isMouseDown = true;
      isDraggingRef.current = true;
      startY = e.clientY;
      startScrollTop = el.scrollTop;
      el.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const delta = startY - e.clientY;
      el.scrollTop = startScrollTop + delta;
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
  }, [min, max]);

  return (
    <div dir="ltr" className="relative w-full max-w-xs mx-auto flex flex-col items-center justify-center select-none">
      
      {/* Container with wheel height */}
      <div className="relative w-full h-[360px] flex items-center justify-center overflow-hidden">
        
        {/* Top Fading Mask */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-20 pointer-events-none" />

        {/* Bottom Fading Mask */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-20 pointer-events-none" />

        {/* Active Pill / Capsule Frame in Glowing Emerald */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-[280px] h-[78px] rounded-full border-2 border-accent-emerald bg-accent-emerald/10 shadow-[0_0_25px_rgba(52,211,153,0.25)] pointer-events-none z-10 transition-all duration-300 ring-1 ring-accent-emerald/30"
        />

        {/* Vertical Scroll Wheel Area */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide relative z-10 cursor-grab active:cursor-grabbing"
          style={{
            paddingTop: `${paddingY}px`,
            paddingBottom: `${paddingY}px`,
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {items.map(num => {
            const distance = Math.abs(num - value);
            const isSelected = distance === 0;

            return (
              <div
                key={num}
                onClick={() => {
                  onChange(num);
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      top: (num - min) * slotHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="flex items-center justify-center cursor-pointer transition-all duration-150"
                style={{
                  height: `${slotHeight}px`,
                  scrollSnapAlign: 'center',
                }}
              >
                <span
                  className={`font-mono transition-all duration-200 ${
                    isSelected
                      ? 'text-6xl sm:text-7xl font-black text-accent-emerald scale-110 tracking-tight drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : distance === 1
                      ? 'text-3xl sm:text-4xl font-bold text-slate-300 opacity-60 scale-95'
                      : distance === 2
                      ? 'text-2xl font-bold text-slate-500 opacity-35 scale-85'
                      : 'text-lg font-medium text-slate-600 opacity-15 scale-75'
                  }`}
                >
                  {num}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
