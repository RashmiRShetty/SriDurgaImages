import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Save, Loader2, ArrowLeft, Edit2 } from 'lucide-react';

const AdminProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!productId;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount_price: '',
    description: '',
    subcategory_id: ''
  });

  const [images, setImages] = useState([]); // New files to upload
  const [previews, setPreviews] = useState([]); // Combined previews
  const [existingImages, setExistingImages] = useState([]); // URLs from DB

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProductForEdit();
    }
  }, [productId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const fetchProductForEdit = async () => {
    setLoading(true);
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setFormData({
        name: product.name,
        price: product.price,
        discount_price: product.discount_price || '',
        description: product.description,
        subcategory_id: product.subcategory_id || ''
      });
      setSelectedCategory(product.category_id);
      setExistingImages(product.product_images || []);
      setPreviews(product.product_images.map(img => img.image_url));
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Error loading product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data);
  };

  const fetchSubcategories = async (categoryId) => {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId);
    if (error) console.error('Error fetching subcategories:', error);
    else setSubcategories(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // If it's an existing image (from URL)
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // It's a newly added file
      const newFileIndex = index - existingImages.length;
      setImages(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find category name for fallback
      const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Unnamed Furniture';
      const finalProductName = formData.name.trim() || categoryName;

      let product;
      if (isEditing) {
        // Update product data
        const { data, error: productError } = await supabase
          .from('products')
          .update({
            name: finalProductName,
            price: formData.price ? parseFloat(formData.price) : 0,
            discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
            description: formData.description || '',
            category_id: selectedCategory || null,
            subcategory_id: formData.subcategory_id || null
          })
          .eq('id', productId)
          .select()
          .single();
        
        if (productError) throw productError;
        product = data;

        // Clean up old images if they were removed
        const currentExistingIds = existingImages.map(img => img.id);
        const { data: oldImages } = await supabase
          .from('product_images')
          .select('id')
          .eq('product_id', productId);
        
        const idsToDelete = oldImages
          .filter(img => !currentExistingIds.includes(img.id))
          .map(img => img.id);

        if (idsToDelete.length > 0) {
          await supabase.from('product_images').delete().in('id', idsToDelete);
        }
      } else {
        // Insert product data
        const { data, error: productError } = await supabase
          .from('products')
          .insert([{
            name: finalProductName,
            price: formData.price ? parseFloat(formData.price) : 0,
            discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
            description: formData.description || '',
            category_id: selectedCategory || null,
            subcategory_id: formData.subcategory_id || null
          }])
          .select()
          .single();

        if (productError) throw productError;
        product = data;
      }

      // 2. Upload new images and get URLs
      const newImageUrls = [];
      for (const file of images) {
        const fileName = `${product.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        newImageUrls.push(publicUrl);
      }

      // 3. Store new image URLs in product_images table
      if (newImageUrls.length > 0) {
        const imageInserts = newImageUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          is_main: !isEditing && index === 0 // Only auto-set main if it's a new product
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      alert(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      navigate('/admin/products');

    } catch (error) {
      console.error('Error adding/updating product:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-20">
      <button 
        onClick={() => navigate('/admin/products')}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2 uppercase tracking-tight">
        {isEditing ? <Edit2 className="text-indigo-600" size={24} /> : <Plus className="text-indigo-600" size={24} />} 
        {isEditing ? 'Edit Furniture Product' : 'Add New Furniture Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border-transparent focus:bg-white transition-all"
              placeholder="Optional (e.g. Modern Velvet Sofa)"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Category *</label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border-transparent focus:bg-white transition-all"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Subcategory</label>
            <select
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleInputChange}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border-transparent focus:bg-white transition-all disabled:opacity-50"
              disabled={!selectedCategory}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Original Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border-transparent focus:bg-white transition-all"
              placeholder="Optional"
            />
          </div>

          {/* Discount Price */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Discount Price (₹)</label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleInputChange}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border-transparent focus:bg-white transition-all"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 border-transparent focus:bg-white transition-all"
            placeholder="Optional detailed text..."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 uppercase tracking-wider">
            <Upload size={18} /> Product Images *
          </label>
          
          <div className="flex flex-wrap gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative w-32 h-32 group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-2xl border-2 border-gray-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all text-indigo-400">
              <Plus size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest mt-1">Add Image</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            {isEditing ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
