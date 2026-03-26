import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Search, Trash2, Edit2, Package, 
  ExternalLink, Hash, Filter, AlertCircle 
} from 'lucide-react';

const AdminProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key === 'price') {
      const priceA = a.discount_price || a.price;
      const priceB = b.discount_price || b.price;
      return sortConfig.direction === 'asc' ? priceA - priceB : priceB - priceA;
    }
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === 'category') {
      const catA = a.categories?.name || '';
      const catB = b.categories?.name || '';
      return sortConfig.direction === 'asc' 
        ? catA.localeCompare(catB) 
        : catB.localeCompare(catA);
    }
    // Default: created_at
    return sortConfig.direction === 'asc' 
      ? new Date(a.created_at) - new Date(b.created_at) 
      : new Date(b.created_at) - new Date(a.created_at);
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    setDeletingId(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
    setDeletingId(null);
  };

  // Helper to format ID same as ProductCard/Details
  const getFormattedId = (product) => {
    const categoryPrefix = product.categories?.name?.substring(0, 3).toUpperCase() || 'PRD';
    return `${categoryPrefix}-${product.display_id || product.id.slice(0, 4)}`;
  };

  const filteredProducts = sortedProducts.filter(product => {
    const formattedId = getFormattedId(product).toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      formattedId.includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.categories?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
            <Package className="text-indigo-600" /> Manage Products
          </h2>
          <p className="text-gray-500 font-medium">Update or remove items from your collection</p>
        </div>
        
        <button 
          onClick={() => navigate('/admin/add')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
        >
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by ID (e.g. LIV-1), Name, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-700">No products found</h3>
          <p className="text-gray-400 mt-2">Try a different search term or add a new product</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                <th 
                  className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Product {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => {
                const formattedId = getFormattedId(product);
                return (
                  <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 w-fit group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                        <Hash size={10} /> {formattedId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-500">{product.categories?.name || 'Uncategorized'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-indigo-600">
                        ₹{product.discount_price || product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/edit/${product.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm"
                          title="Edit Product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm"
                          title="Delete Product"
                        >
                          {deletingId === product.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                        <button 
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all shadow-sm"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
