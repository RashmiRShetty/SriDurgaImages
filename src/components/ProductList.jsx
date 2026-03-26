import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Loader2, RefreshCw, LayoutGrid, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const ProductList = () => {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const [categories, setCategories] = useState([]);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select(`
          *,
          products (
            id,
            product_images (
              image_url
            )
          )
        `);
      
      if (catError) throw catError;

      const categoriesWithImages = (catData || []).map(cat => {
        const firstProductWithImage = cat.products?.find(p => p.product_images?.length > 0);
        const imageUrl = firstProductWithImage?.product_images[0]?.image_url || null;
        return { ...cat, imageUrl };
      });
      
      setCategories(categoriesWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading premium furniture...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={fetchData}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={18} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Premium Hero Section */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover opacity-60"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600/30 backdrop-blur-md rounded-full text-[11px] font-black mb-8 border border-indigo-400/40 text-indigo-200 uppercase tracking-[0.2em] shadow-lg">
              <Sparkles size={16} /> LUXURY FURNITURE COLLECTION
            </div>
            <h1 className="text-6xl lg:text-8xl font-black mb-10 leading-none tracking-tighter uppercase">
              DESIGN YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">DREAM SPACE</span>
            </h1>
            <p className="text-xl text-gray-200 mb-14 leading-relaxed max-w-xl font-medium opacity-90">
              Discover timeless elegance and superior craftsmanship. Our curated collections bring sophistication and comfort to every corner of your home.
            </p>
            <div className="flex flex-wrap gap-8">
              <button 
                onClick={scrollToCategories}
                className="px-12 py-6 bg-indigo-600 text-white rounded-full font-black text-base hover:bg-indigo-700 transition-all shadow-2xl hover:shadow-indigo-500/30 flex items-center gap-4 group uppercase tracking-[0.15em] active:scale-95"
              >
                EXPLORE NOW <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attractive Category Grid Section */}
      <div id="category-section" ref={categoriesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-3">Our Departments</h2>
          <h3 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">SHOP BY CATEGORY</h3>
          <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="group relative h-[450px] overflow-hidden rounded-[2.5rem] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] bg-gray-100 flex flex-col"
            >
              {/* Background Image with Zoom and Overlay */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                    <LayoutGrid className="text-indigo-200" size={64} />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative z-20 mt-auto p-10 flex flex-col items-start text-left w-full">
                <div className="flex items-center gap-2 mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                  <span className="text-indigo-400 text-xs font-black tracking-[0.3em] uppercase">Collection</span>
                </div>
                
                <h4 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4 group-hover:text-indigo-300 transition-colors duration-500">
                  {cat.name}
                </h4>
                
                <div className="flex items-center gap-3 text-white/70 font-bold text-sm tracking-widest translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                  EXPLORE DEPARTMENT <ArrowRight size={20} className="text-indigo-500" />
                </div>
              </div>

              {/* Decorative Numbering */}
              <div className="absolute top-10 right-10 text-white/5 text-8xl font-black select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors duration-700">
                0{index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
