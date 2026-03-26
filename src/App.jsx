import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import AdminProductForm from "./components/AdminProductForm";
import AdminCategoryForm from "./components/AdminCategoryForm";
import CategoryProducts from "./components/CategoryProducts";
import AdminProductList from "./components/AdminProductList";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import GlobalSearch from "./components/GlobalSearch";
import ScrollToTop from "./components/ScrollToTop";
import { LayoutGrid, ShoppingCart, UserCheck, Search, Menu, X, PackagePlus, FolderTree, Settings, LogOut } from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminSessionExpiry');
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-indigo-100 group-hover:bg-indigo-700">
                <LayoutGrid size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline leading-none">
                  <span className="text-3xl font-[1000] text-gray-900 tracking-tighter uppercase">SRI</span>
                  <span className="text-3xl font-[1000] text-indigo-600 tracking-tighter uppercase ml-1.5">DURGA</span>
                </div>
                <div className="mt-1.5">
                  <span className="text-base font-black text-indigo-600 tracking-[0.05em] uppercase whitespace-nowrap leading-none">
                    Electronics & Furnitures
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className={`text-sm font-black tracking-widest transition-colors ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>HOME</Link>
              
              {!isAdminPage ? (
                <>
                  <button 
                    onClick={() => {
                      if (location.pathname === '/') {
                        document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/');
                        setTimeout(() => document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="text-sm font-black tracking-widest text-gray-600 hover:text-indigo-600 transition-colors uppercase"
                  >
                    Category
                  </button>
                  <Link to="/about" className={`text-sm font-black tracking-widest transition-colors ${location.pathname === '/about' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>ABOUT US</Link>
                  <Link to="/contact" className={`text-sm font-black tracking-widest transition-colors ${location.pathname === '/contact' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>CONTACT US</Link>
                </>
              ) : (
                <>
                  <Link to="/admin/products" className={`inline-flex items-center gap-2 text-sm font-black tracking-widest transition-colors ${location.pathname === '/admin/products' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
                    <Settings size={18} /> MANAGE PRODUCTS
                  </Link>
                  <Link to="/admin/categories" className={`inline-flex items-center gap-2 text-sm font-black tracking-widest transition-colors ${location.pathname === '/admin/categories' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
                    <FolderTree size={18} /> CATEGORIES
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-sm font-black tracking-widest text-red-500 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} /> LOGOUT
                  </button>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {!isAdminPage && (
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-gray-50 rounded-full"
                >
                  <Search size={22} />
                </button>
                <button className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-gray-50 rounded-full">
                  <ShoppingCart size={22} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {!isAdminPage && (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <Search size={24} />
                </button>
              )}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">Home</Link>
              {!isAdminPage && (
                <>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (location.pathname === '/') {
                        document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/');
                        setTimeout(() => document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl uppercase"
                  >
                    Category
                  </button>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl uppercase">About Us</Link>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl uppercase">Contact Us</Link>
                </>
              )}
              {isAdminPage && (
                <>
                  <Link to="/admin/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">Manage Products</Link>
                  <Link to="/admin/categories" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">Categories</Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }} 
                    className="w-full text-left px-4 py-3 text-base font-bold text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Overlay */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:categoryId" element={<CategoryProducts />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Admin Routes */}
             <Route path="/admin/login" element={<AdminLogin />} />
             <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
             <Route element={<ProtectedRoute />}>
               <Route path="/admin/products" element={<AdminProductList />} />
               <Route path="/admin/add" element={<AdminProductForm />} />
               <Route path="/admin/edit/:productId" element={<AdminProductForm />} />
               <Route path="/admin/categories" element={<AdminCategoryForm />} />
             </Route>
           </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <LayoutGrid size={20} />
              </div>
              <span className="text-xl font-black text-gray-900">SRIDURGA</span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Sri Durga Furniture. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
