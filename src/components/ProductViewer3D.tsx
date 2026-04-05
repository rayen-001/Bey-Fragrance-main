import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
}

interface ProductViewer3DProps {
  product: {
    name: string;
    image: string;
    price: number;
    description: string;
  };
  onClose: () => void;
}

export function ProductViewer3D({ product, onClose }: ProductViewer3DProps) {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const lastRotationY = useRef(0);
  const lastRotationX = useRef(0);

  // Hotspots للعطر - نقاط تفاعلية
  const hotspots: Hotspot[] = [
    {
      id: 'cap',
      x: 50,
      y: 15,
      label: 'Premium Cap',
      description: 'Handcrafted gold-plated cap with magnetic closure'
    },
    {
      id: 'bottle',
      x: 50,
      y: 45,
      label: 'Crystal Glass',
      description: 'French crystal glass with golden gradient finish'
    },
    {
      id: 'logo',
      x: 50,
      y: 55,
      label: 'Bey Signature',
      description: 'Embossed logo with 24K gold leaf detailing'
    },
    {
      id: 'base',
      x: 50,
      y: 85,
      label: 'Weighted Base',
      description: 'Heavy glass base for stability and luxury feel'
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    lastRotationY.current = rotationY;
    lastRotationX.current = rotationX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;
    
    setRotationY(lastRotationY.current + deltaX * 0.5);
    setRotationX(Math.max(-30, Math.min(30, lastRotationX.current - deltaY * 0.3)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    lastRotationY.current = rotationY;
    lastRotationX.current = rotationX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    
    setRotationY(lastRotationY.current + deltaX * 0.5);
    setRotationX(Math.max(-30, Math.min(30, lastRotationX.current - deltaY * 0.3)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(2.5, zoom + 0.25));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.75, zoom - 0.25));
  };

  const handleReset = () => {
    setRotationY(0);
    setRotationX(0);
    setZoom(1);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full max-w-7xl mx-auto p-4 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-sm border border-[#d4af37]/30">
            <h2 className="font-serif text-2xl lg:text-3xl text-white mb-1 gold-gradient-text">
              {product.name}
            </h2>
            <p className="text-[#d4af37] font-display text-sm tracking-wider">
              3D INTERACTIVE VIEW
            </p>
          </div>
          
          <motion.button
            onClick={onClose}
            className="bg-black/60 backdrop-blur-md p-3 rounded-sm border border-[#d4af37]/30 text-white hover:bg-[#d4af37]/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Main 3D Viewer */}
        <div className="h-full flex items-center justify-center pt-24 pb-32 lg:pb-24">
          <div className="relative w-full max-w-2xl aspect-square">
            
            {/* Ambient Glow */}
            <motion.div
              className="absolute inset-0 blur-[120px] opacity-40"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.6), transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* 3D Product Container */}
            <motion.div
              className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: rotationY,
                  rotateX: rotationX,
                  scale: zoom,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                {/* Product Image with Reflections */}
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Reflection Layer */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, rgba(212,175,55,0.3) 50%, transparent 60%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Main Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-4/5 h-4/5 object-contain relative z-10"
                    style={{
                      filter: 'drop-shadow(0 30px 60px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.2))',
                    }}
                    draggable={false}
                  />

                  {/* Light Flare */}
                  <motion.div
                    className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full opacity-50 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)',
                      filter: 'blur(20px)',
                    }}
                    animate={{
                      x: [0, 50, 0],
                      y: [0, -30, 0],
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Interactive Hotspots */}
                  {showHotspots && hotspots.map((hotspot, index) => (
                    <motion.div
                      key={hotspot.id}
                      className="absolute"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <motion.button
                        className="relative group"
                        onClick={() => setSelectedHotspot(selectedHotspot === hotspot.id ? null : hotspot.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* Pulse Ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#d4af37]"
                          animate={{
                            scale: [1, 2, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        />
                        
                        {/* Hotspot Dot */}
                        <div className="w-4 h-4 rounded-full bg-[#d4af37] shadow-lg shadow-[#d4af37]/50 relative z-10" />
                        
                        {/* Tooltip */}
                        {selectedHotspot === hotspot.id && (
                          <motion.div
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-64 bg-black/90 backdrop-blur-md border border-[#d4af37]/30 rounded-sm p-4 pointer-events-none"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="text-[#d4af37] font-display text-xs tracking-wider mb-1">
                              {hotspot.label}
                            </div>
                            <div className="text-white/70 text-sm leading-relaxed">
                              {hotspot.description}
                            </div>
                            {/* Arrow */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#d4af37]/30" />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-sm border border-[#d4af37]/30 flex items-center gap-6">
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleZoomOut}
                className="p-2 text-white hover:text-[#d4af37] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={zoom <= 0.75}
              >
                <ZoomOut className="w-5 h-5" />
              </motion.button>
              
              <div className="text-white/70 font-display text-sm min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </div>
              
              <motion.button
                onClick={handleZoomIn}
                className="p-2 text-white hover:text-[#d4af37] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={zoom >= 2.5}
              >
                <ZoomIn className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="w-px h-8 bg-white/10" />

            {/* Reset Button */}
            <motion.button
              onClick={handleReset}
              className="p-2 text-white hover:text-[#d4af37] transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-display text-sm hidden lg:block">Reset</span>
            </motion.button>

            <div className="w-px h-8 bg-white/10" />

            {/* Toggle Hotspots */}
            <motion.button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`p-2 transition-colors flex items-center gap-2 ${
                showHotspots ? 'text-[#d4af37]' : 'text-white hover:text-[#d4af37]'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info className="w-5 h-5" />
              <span className="font-display text-sm hidden lg:block">
                {showHotspots ? 'Hide' : 'Show'} Details
              </span>
            </motion.button>
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/40 text-sm font-display tracking-wider text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="hidden lg:block">DRAG TO ROTATE • SCROLL TO ZOOM • CLICK HOTSPOTS FOR DETAILS</p>
          <p className="lg:hidden">SWIPE TO ROTATE • PINCH TO ZOOM • TAP DOTS FOR DETAILS</p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-[#d4af37]/10 text-9xl font-serif pointer-events-none hidden xl:block">
          ✦
        </div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-[#d4af37]/10 text-9xl font-serif pointer-events-none hidden xl:block">
          ✦
        </div>
      </div>
    </motion.div>
  );
}
