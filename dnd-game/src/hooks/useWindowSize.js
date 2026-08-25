import { useState, useEffect } from 'react';
export function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return { ...size, isMobile: size.w < 640, isTablet: size.w < 1024, isDesktop: size.w >= 1024 };
}
