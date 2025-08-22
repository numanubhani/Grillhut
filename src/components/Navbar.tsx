import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut, Truck } from 'lucide-react';
import { getCart } from '../utils/storage';
import { getCurrentUser, logout } from '../utils/auth';

interface NavbarProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  onTrackOrderClick: () => void;
  currentUser: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onLoginClick, onTrackOrderClick, currentUser, onLogout }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(count);
    };

    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-black/95 backdrop-blur-md text-white border-b border-yellow-500/30 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Grill Hut
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={onCartClick}
              className="relative p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            <button
              onClick={onTrackOrderClick}
              className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
              data-track-order
            >
              <Truck size={20} />
              <span>Track Order</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-yellow-400">Welcome, {currentUser.name}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <User size={20} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-yellow-500/30 bg-black/95 backdrop-blur-md">
              <button
                onClick={() => {
                  onCartClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <ShoppingCart size={20} />
                <span>Cart ({cartItemsCount})</span>
              </button>
              <button
                onClick={() => {
                  onTrackOrderClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Truck size={20} />
                <span>Track Order</span>
              </button>
              
              {currentUser ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-yellow-400">Welcome, {currentUser.name}</div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <User size={20} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;