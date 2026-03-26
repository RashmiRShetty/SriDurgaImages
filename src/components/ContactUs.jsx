import React from 'react';
import { Phone, Mail, MapPin, Clock, Store } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-indigo-900 py-16 text-white text-center px-4">
        <h1 className="text-5xl lg:text-7xl font-black mb-4 uppercase tracking-tighter">Get In Touch</h1>
        <p className="text-lg text-indigo-200 max-w-2xl mx-auto font-medium">Visit our showrooms or reach out to us directly.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Karkala Shop Details */}
          <div className="bg-gray-50 rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-500">
                <Store size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Karkala Shop</h2>
                <div className="h-1.5 w-16 bg-indigo-600 rounded-full mt-3" />
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl text-indigo-600 shadow-sm border border-gray-100">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Call Us</h4>
                  <p className="text-gray-900 font-black text-xl tracking-tight">+91 7795953036</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl text-indigo-600 shadow-sm border border-gray-100">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Location</h4>
                  <p className="text-gray-900 font-bold leading-relaxed">
                    Ground Floor Laxmikanth Complex,<br />
                    Opposite to Canara Bank Joudraste,<br />
                    Kukkundoor, Karkala,<br />
                    Udupi - 576117
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl text-indigo-600 shadow-sm border border-gray-100">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Business Hours</h4>
                  <p className="text-gray-900 font-bold text-lg">9:30 AM - 8:00 PM</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Monday - Sunday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Davanagere Shop Details */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-indigo-100 shadow-xl shadow-indigo-50/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-indigo-50 opacity-10 pointer-events-none">
              <Store size={200} />
            </div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover:-rotate-12 transition-transform duration-500">
                <Store size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Davanagere Shop</h2>
                <div className="h-1.5 w-16 bg-indigo-600 rounded-full mt-3" />
              </div>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="flex items-start gap-6">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Call Us</h4>
                  <p className="text-gray-900 font-black text-xl tracking-tight">+91 8971736362</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Location</h4>
                  <p className="text-gray-900 font-bold leading-relaxed">
                    P B Road,<br />
                    Near HDFC Bank,<br />
                    Davanagere - 577002
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Business Hours</h4>
                  <p className="text-gray-900 font-bold text-lg">9:30 AM - 9:00 PM</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Monday - Sunday</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Common Email Footer */}
        <div className="mt-20 p-12 bg-indigo-900 rounded-[3rem] text-center text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-950 opacity-50" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/10">
              <Mail size={14} className="text-indigo-300" /> General Inquiries
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">sridurgaelectronics21@gmail.com</h3>
            <p className="text-indigo-200 font-medium">Feel free to drop us an email for any other assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
