import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Search, X, Loader2, Hash, ArrowRight } from 'lucide-react';

const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, sortBy]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name), product_images(*)');

      if (error) throw error;

      const searchTerms = query.toLowerCase().trim();
      
      let filtered = data.filter(product => {
        const categoryPrefix = product.categories?.name?.substring(0, 3).toUpperCase() || 'PRD';
        const formattedId = `${categoryPrefix}-${product.display_id || product.id.slice(0, 4)}`.toLowerCase();
        
        return (
          product.name.toLowerCase().includes(searchTerms) ||
          formattedId.includes(searchTerms) ||
          product.description?.toLowerCase().includes(searchTerms) ||
          product.categories?.name?.toLowerCase().includes(searchTerms)
        );
      });

      // Apply Sort
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
          break;
        case 'price-high':
          filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        default:
          break;
      }

      setResults(filtered.slice(0, 5)); // Limit to 5 results for quick view
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-indigo-900/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Search Input Area */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
            <Search size={24} />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Search by ID (e.g. LIV-1), Name or Category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xl font-bold text-gray-800 outline-none placeholder:text-gray-300"
          />
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sort Controls for Search Results */}
        {query.trim() && (
          <div className="px-6 py-2 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {results.length} results found
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] font-black text-indigo-600 uppercase tracking-widest outline-none cursor-pointer hover:text-indigo-700 transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Searching catalog...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-2">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Search Results</p>
              {results.map((product) => {
                const categoryPrefix = product.categories?.name?.substring(0, 3).toUpperCase() || 'PRD';
                const formattedId = `${categoryPrefix}-${product.display_id || product.id.slice(0, 4)}`;
                const mainImage = product.product_images?.[0]?.image_url;

                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-3xl transition-all group text-left"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-white text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1 uppercase tracking-tighter">
                          <Hash size={10} /> {formattedId}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.categories?.name}</span>
                      </div>
                      <h4 className="font-black text-gray-800 uppercase truncate">{product.name}</h4>
                    </div>
                    <div className="p-2 bg-white text-indigo-600 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-20">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-300" size={24} />
              </div>
              <h3 className="font-bold text-gray-700">No matches found</h3>
              <p className="text-sm text-gray-400 mt-1 px-10">We couldn't find any furniture matching "{query}"</p>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-300 font-medium">
              Start typing to search our premium collection...
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm text-gray-500">ESC</span> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
