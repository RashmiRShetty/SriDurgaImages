import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Plus, Trash2, FolderPlus, FolderTree, Loader2, Edit2, Check, X } from 'lucide-react';

const AdminCategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ name: '', category_id: '' });
  
  // Editing states
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }
  const [editingSubcategory, setEditingSubcategory] = useState(null); // { id, name }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*, subcategories(*)');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data);
    setLoading(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategory.trim() }]);

    if (error) {
      alert('Error adding category: ' + error.message);
    } else {
      setNewCategory('');
      fetchCategories();
    }
    setLoading(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory?.name.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .update({ name: editingCategory.name.trim() })
      .eq('id', editingCategory.id);

    if (error) alert('Error updating category: ' + error.message);
    else {
      setEditingCategory(null);
      fetchCategories();
    }
    setLoading(false);
  };

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategory?.name.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('subcategories')
      .update({ name: editingSubcategory.name.trim() })
      .eq('id', editingSubcategory.id);

    if (error) alert('Error updating subcategory: ' + error.message);
    else {
      setEditingSubcategory(null);
      fetchCategories();
    }
    setLoading(false);
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategory.name.trim() || !newSubcategory.category_id) return;

    setLoading(true);
    const { error } = await supabase
      .from('subcategories')
      .insert([{ 
        name: newSubcategory.name.trim(), 
        category_id: newSubcategory.category_id 
      }]);

    if (error) {
      alert('Error adding subcategory: ' + error.message);
    } else {
      setNewSubcategory({ name: '', category_id: '' });
      fetchCategories();
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This will delete the category and its subcategories.')) return;
    
    setLoading(true);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchCategories();
    setLoading(false);
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('subcategories').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchCategories();
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2 border-b pb-4">
        <FolderTree className="text-indigo-600" /> Manage Categories & Subcategories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FolderPlus size={20} className="text-indigo-500" /> Add Category
          </h3>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name (e.g. Kitchen)"
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              disabled={loading}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Plus size={24} />
            </button>
          </form>
        </div>

        {/* Add Subcategory */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Plus size={20} className="text-indigo-500" /> Add Subcategory
          </h3>
          <form onSubmit={handleAddSubcategory} className="space-y-3">
            <select
              value={newSubcategory.category_id}
              onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Parent Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                placeholder="Subcategory Name (e.g. Chairs)"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                disabled={loading || !newSubcategory.category_id}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Display */}
      <div className="mt-12 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Existing Structure</h3>
        {loading && categories.length === 0 ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  {editingCategory?.id === category.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <input 
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="flex-1 p-1 border rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button onClick={handleUpdateCategory} className="text-green-600"><Check size={18} /></button>
                      <button onClick={() => setEditingCategory(null)} className="text-gray-400"><X size={18} /></button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-indigo-700">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
                  {category.subcategories?.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center text-sm text-gray-600">
                      {editingSubcategory?.id === sub.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input 
                            type="text"
                            value={editingSubcategory.name}
                            onChange={(e) => setEditingSubcategory({...editingSubcategory, name: e.target.value})}
                            className="flex-1 p-1 border rounded text-xs outline-none"
                          />
                          <button onClick={handleUpdateSubcategory} className="text-green-600"><Check size={14} /></button>
                          <button onClick={() => setEditingSubcategory(null)} className="text-gray-400"><X size={14} /></button>
                        </div>
                      ) : (
                        <>
                          <span>• {sub.name}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setEditingSubcategory({ id: sub.id, name: sub.name })}
                              className="text-gray-400 hover:text-indigo-500"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSubcategory(sub.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {(!category.subcategories || category.subcategories.length === 0) && (
                    <span className="text-xs text-gray-400 italic">No subcategories</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryForm;
