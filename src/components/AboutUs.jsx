import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import karImg from '../assets/kar.jpeg';
import dvgImg from '../assets/dvg.jpeg';

const AboutUs = () => {
  const shopImages = [karImg, dvgImg];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % shopImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [shopImages.length]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-indigo-900 py-16 text-white text-center px-4">
        <h1 className="text-5xl lg:text-7xl font-black mb-4 uppercase tracking-tighter">Our Story</h1>
        <p className="text-lg text-indigo-200 max-w-2xl mx-auto font-medium">Crafting comfort and elegance for your home since 2021.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Our Mission
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">PREMIUM QUALITY FOR EVERY HOME</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              At Sri Durga Furniture, we believe that your home should be a reflection of your personality. Our mission is to provide high-quality, handcrafted furniture that combines modern aesthetics with timeless durability.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <CheckCircle2 className="text-indigo-600" size={20} />
                <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Handcrafted</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider leading-tight">Expertly built by master craftsmen</p>
              </div>
              <div className="space-y-2">
                <CheckCircle2 className="text-indigo-600" size={20} />
                <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Premium Selection</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider leading-tight">Handpicked luxury collections</p>
              </div>
            </div>
          </div>

          {/* Animated Image Slider */}
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px] group border-4 border-white shadow-indigo-100/50">
            {shopImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  idx === currentImageIndex ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-110 translate-x-4'
                }`}
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover" 
                  alt={`Sri Durga Showroom ${idx + 1}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {shopImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Floating Badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl z-10 border border-white/20">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Our Showroom</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-[3rem] p-12 lg:p-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-black text-indigo-600">500+</div>
            <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Happy Clients</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-indigo-600">1000+</div>
            <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Products Built</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-indigo-600">5+</div>
            <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Years Experience</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-indigo-600">100%</div>
            <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
