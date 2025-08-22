import React from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';
import { updateCartQuantity, removeFromCart } from '../utils/storage';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onPlaceOrder: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onPlaceOrder }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateCartQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-gray-900 h-full overflow-y-auto">
        <div className="p-4 border-b border-yellow-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-400">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <ShoppingCart size={48} className="mx-auto mb-4" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-700">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-yellow-400">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-yellow-600">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-yellow-400">₹{total}</span>
                </div>
                <button
                  onClick={onPlaceOrder}
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors font-semibold"
                >
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;