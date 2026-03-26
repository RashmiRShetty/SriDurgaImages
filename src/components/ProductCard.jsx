import React from 'react';
import { ArrowRight, Hash, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const mainImage = product.product_images?.find(img => img.is_main)?.image_url 
    || product.product_images?.[0]?.image_url 
    || 'https://via.placeholder.com/300?text=No+Image';

  const hasDiscount = product.discount_price && product.discount_price < product.price;

  const categoryPrefix = product.categories?.name?.substring(0, 3).toUpperCase() || 'PRD';
  const formattedId = `${categoryPrefix}-${product.display_id || product.id.slice(0, 4)}`;

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this furniture: ${product.name} (ID: ${formattedId})`,
        url: window.location.origin + `/product/${product.id}`,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col group border border-gray-100/50 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <div className="bg-white/95 backdrop-blur-sm text-gray-900 text-[9px] font-black px-2 py-1 rounded-lg shadow-sm border border-gray-100 flex items-center gap-1 uppercase tracking-tighter">
            <Hash size={9} /> {formattedId}
          </div>
          <button 
            onClick={handleShare}
            className="p-2 bg-white/95 backdrop-blur-sm text-indigo-600 rounded-lg shadow-sm border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all transform active:scale-90"
            title="Share Product"
          >
            <Share2 size={12} />
          </button>
        </div>

        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-widest">
            -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8 leading-relaxed font-medium">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-black text-indigo-600 tracking-tighter">₹{product.discount_price}</span>
                <span className="text-[10px] font-bold text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-900 tracking-tighter">₹{product.price}</span>
            )}
          </div>
          
          <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-45">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
