import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import ProductCard from './ProductCard';
import { Loader2, ArrowLeft, Filter, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort states
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Category Details
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      if (catError) throw catError;
      setCategory(catData);

      // 2. Fetch Subcategories for this category
      const { data: subData, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId);
      if (subError) throw subError;
      setSubcategories(subData || []);

      // 3. Fetch Products for this category
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          categories (name)
        `)
        .eq('category_id', categoryId);

      if (selectedSubcategory !== 'All') {
        query = query.eq('subcategory_id', selectedSubcategory);
      }

      const { data: prodData, error: prodError } = await query;
      if (prodError) throw prodError;
      
      let filteredProducts = prodData || [];

      // Apply Price Range Filter in JS
      if (priceRange !== 'All') {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => {
          const effectivePrice = p.discount_price || p.price;
          if (max) {
            return effectivePrice >= min && effectivePrice <= max;
          }
          return effectivePrice >= min;
        });
      }

      // Apply Sort in JavaScript to handle effective price (discount_price || price)
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
          break;
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
        default:
          filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
      }

      setProducts(filteredProducts);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId, selectedSubcategory, sortBy, priceRange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading your collection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Back and Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest mb-2 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            {category?.name}
          </h1>
          <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-3" />
        </div>

        {/* Sort & Price Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Price Range Dropdown */}
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all text-sm font-bold text-gray-700 shadow-sm"
            >
              <option value="All">All Prices</option>
              <option value="0-5000">Under ₹5,000</option>
              <option value="5000-15000">₹5,000 - ₹15,000</option>
              <option value="15000-30000">₹15,000 - ₹30,000</option>
              <option value="30000-50000">₹30,000 - ₹50,000</option>
              <option value="50000-0">₹50,000+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[180px]">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all text-sm font-bold text-gray-700 shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Subcategory Filter (More compact) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-gray-100">
        <button
          onClick={() => setSelectedSubcategory('All')}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            selectedSubcategory === 'All' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white border border-gray-100 text-gray-500 hover:border-indigo-200 hover:text-indigo-600'
          }`}
        >
          All Items
        </button>
        {subcategories.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubcategory(sub.id)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedSubcategory === sub.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white border border-gray-100 text-gray-500 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Results Section */}
      {products.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <h3 className="text-xl font-bold text-gray-700">No products in this category yet</h3>
          <p className="text-gray-400 mt-2">Check back soon for our new arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
