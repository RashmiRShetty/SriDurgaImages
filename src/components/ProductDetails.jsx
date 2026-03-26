import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import ProductCard from './ProductCard';
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Hash, Tag, ZoomIn, X, ZoomOut, Maximize2, Share2 } from 'lucide-react';

const ImageModal = ({ isOpen, images, activeIndex, onIndexChange, onClose, formattedId, productName }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!isOpen || !images || images.length === 0) return null;

  const currentImageUrl = images[activeIndex]?.image_url;

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Check out this furniture: ${productName} (ID: ${formattedId})`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) setPosition({ x: 0, y: 0 });
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    onIndexChange((activeIndex + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    onIndexChange((activeIndex - 1 + images.length) % images.length);
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none"
      onMouseUp={handleMouseUp}
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleShare}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/20 transition-all shadow-xl flex items-center gap-2"
          title="Share"
        >
          <Share2 size={20} />
        </button>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <button 
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-white text-xs font-black min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl transition-all shadow-xl"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && zoomLevel === 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110"
          >
            <ChevronLeft size={40} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}

      {/* Image Wrapper */}
      <div 
        className={`relative max-w-full max-h-full overflow-hidden ${zoomLevel > 1 ? 'cursor-move' : 'cursor-default'} ${isDragging ? 'scale-[1.02]' : ''} transition-transform duration-300`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImageUrl}
          alt="Full size view"
          className="max-w-[90vw] max-h-[85vh] object-contain select-none pointer-events-none transition-transform duration-200"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          }}
        />
      </div>

      {/* Bottom Info & Thumbnails */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-6 z-[110]" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <div className="flex gap-3 px-4 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-[90vw] overflow-x-auto scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  setZoomLevel(1);
                  setPosition({ x: 0, y: 0 });
                  onIndexChange(idx);
                }}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                  activeIndex === idx ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img.image_url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
          {zoomLevel > 1 ? 'Drag to move around' : `Image ${activeIndex + 1} of ${images.length}`}
        </div>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (*),
            categories (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse">Fetching details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-gray-800">Product not found</h3>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const images = product.product_images || [];
  
  const categoryPrefix = product.categories?.name?.substring(0, 3).toUpperCase() || 'PRD';
  const formattedId = `${categoryPrefix}-${product.display_id || product.id.slice(0, 4)}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this furniture: ${product.name} (ID: ${formattedId})`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <button 
          onClick={handleShare}
          className="p-2.5 bg-white border border-gray-100 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-black text-[10px] tracking-widest uppercase"
        >
          <Share2 size={16} /> SHARE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-100 shadow-sm group/image cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
          >
            {images.length > 0 ? (
              <img
                src={images[activeImageIndex]?.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover/image:scale-105"
              />
            ) : (
              <img src="https://via.placeholder.com/600" alt="No image" className="w-full h-full object-cover" />
            )}

            {/* Zoom Overlay Hint */}
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/image:opacity-100 duration-300">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl scale-75 group-hover/image:scale-100 transition-transform duration-500">
                <Maximize2 size={32} className="text-indigo-600" />
              </div>
            </div>

            {/* Navigation arrows for main image */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-30"
                >
                  <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-30"
                >
                  <ChevronRight size={24} className="text-gray-800" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent hover:border-indigo-300'
                  }`}
                >
                  <img src={img.image_url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                <Hash size={12} /> ID: {formattedId}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-extrabold text-indigo-600">₹{product.discount_price}</span>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                    SAVE {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
              )}
            </div>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-2xl mb-8 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Product Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-auto">
            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag size={20} className="text-indigo-600" /> Interested in this piece?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To inquire about this furniture or place an order, please contact us with the <span className="font-bold text-indigo-600">Product ID</span> mentioned above.
              </p>
              <button className="w-full bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3">
                Inquire via WhatsApp
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500 flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock
            </div>
            <div>Free Delivery</div>
            <div>7 Days Return Policy</div>
          </div>
        </div>
      </div>

      {/* Full Size Image Modal */}
      <ImageModal 
        isOpen={isModalOpen}
        images={images}
        activeIndex={activeImageIndex}
        onIndexChange={setActiveImageIndex}
        onClose={() => setIsModalOpen(false)}
        formattedId={formattedId}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetails;
