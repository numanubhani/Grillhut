import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import CategoryFilter from './components/CategoryFilter';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import OrderTrackingModal from './components/OrderTrackingModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import { MenuItem, CartItem, Order } from './types';
import { getMenu, getCarouselImages, getCart, getOrders } from './utils/storage';
import { getCurrentUser, logout, isAdmin } from './utils/auth';

function App() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [singleOrderItem, setSingleOrderItem] = useState<MenuItem | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Load initial data
    setMenu(getMenu());
    setCarouselImages(getCarouselImages());
    updateCartItems();

    // Update cart items periodically
    const interval = setInterval(updateCartItems, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if current user is admin and redirect to dashboard
    if (currentUser && isAdmin()) {
      // Admin users see the dashboard instead of the main app
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    // Filter menu based on category and search term
    let filtered = menu;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMenu(filtered);
  }, [menu, selectedCategory, searchTerm]);

  const updateCartItems = () => {
    setCartItems(getCart());
  };

  const handlePlaceOrder = (item?: MenuItem) => {
    if (item) {
      setSingleOrderItem(item);
    } else {
      setSingleOrderItem(null);
    }
    setIsOrderFormOpen(true);
    setIsCartOpen(false);
  };

  const handleOrderPlaced = (orderId: string) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      setIsOrderTrackingOpen(true);
      updateCartItems();
    }
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const categories = [...new Set(menu.map(item => item.category))];

  // If user is admin, show admin dashboard
  if (currentUser && isAdmin()) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onTrackOrderClick={() => setIsOrderTrackingOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Carousel images={carouselImages} />
        </div>
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <MenuSection 
          items={filteredMenu}
          onPlaceOrder={handlePlaceOrder}
        />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onPlaceOrder={() => handlePlaceOrder()}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => {
          setIsOrderFormOpen(false);
          setSingleOrderItem(null);
        }}
        items={cartItems}
        onOrderPlaced={handleOrderPlaced}
        singleItem={singleOrderItem}
      />

      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;