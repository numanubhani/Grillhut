import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { addToCart } from '../utils/storage';

interface MenuSectionProps {
  items: MenuItem[];
  onPlaceOrder: (item: MenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ items, onPlaceOrder }) => {
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
  };

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-white">{item.name}</h3>
              <p className="text-slate-300 mb-3 text-sm">{item.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  ₹{item.price}
                </span>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-blue-400 px-4 py-2 rounded-lg transition-colors border border-blue-500/30 hover:border-blue-400/50 flex items-center justify-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => onPlaceOrder(item)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;