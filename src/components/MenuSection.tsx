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
          <div key={item.id} className="bg-black/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-white">{item.name}</h3>
              <p className="text-gray-300 mb-3 text-sm">{item.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  ₹{item.price}
                </span>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-yellow-400 px-4 py-2 rounded-lg transition-colors border border-yellow-500/30 hover:border-yellow-400/50 flex items-center justify-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => onPlaceOrder(item)}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
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