import * as React from "react";
import { createPortal } from "react-dom";

interface ImageZoomProps {
  src: string;
  alt?: string;
  className?: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  React.useEffect(() => {
    if (!isZoomed) return;

    const handleScroll = () => {
      setIsZoomed(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    // Prevent body scroll when zoomed
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isZoomed]);

  const ZoomOverlay = () => (
    <div 
      className="fixed inset-0 bg-black cursor-zoom-out flex items-center justify-center"
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={() => setIsZoomed(false)}
    >
      <img 
        src={src} 
        alt={alt} 
        className="max-w-[90%] max-h-[90%] object-contain"
      />
    </div>
  );

  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        className={`cursor-zoom-in ${className || ''}`}
        onClick={() => setIsZoomed(true)}
      />
      {isZoomed && createPortal(<ZoomOverlay />, document.body)}
    </>
  );
}; 