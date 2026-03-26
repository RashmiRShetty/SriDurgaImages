import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Specific credentials as requested
    const adminEmail = 'sridurgaelectronics21@gmail.com';
    const adminPass = '@RashDurga2021';

    setTimeout(() => {
      if (email === adminEmail && password === adminPass) {
        // Set persistent session in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminSessionExpiry', (Date.now() + (30 * 24 * 60 * 60 * 1000)).toString()); // 30 days
        navigate('/admin/products');
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-center">
            <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
              <ShieldCheck className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Admin Login</h2>
            <p className="text-indigo-100 mt-2 font-medium">SRI DURGA ELECTRONICS</p>
          </div>

          <form onSubmit={handleLogin} className="p-10 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'SECURE LOGIN'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 mt-8 text-sm font-medium">
          Protected area. Authorized access only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
