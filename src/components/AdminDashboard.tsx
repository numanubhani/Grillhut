import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  TrendingUp,
  Package,
  LogOut
} from 'lucide-react';
import { MenuItem, Order, CarouselImage } from '../types';
import { 
  getMenu, 
  saveMenu, 
  getOrders, 
  updateOrderStatus, 
  getCarouselImages, 
  saveCarouselImages 
} from '../utils/storage';
import { logout } from '../utils/auth';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'carousel'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    setOrders(getOrders());
    setMenu(getMenu());
    setCarouselImages(getCarouselImages());
    
    // Check for new orders periodically and show toast
    const interval = setInterval(() => {
      const currentOrders = getOrders();
      if (currentOrders.length > orders.length) {
        const newOrder = currentOrders[currentOrders.length - 1];
        toast.success(`New order received! Order #${newOrder.id}`, {
          duration: 5000,
          position: 'top-right',
        });
        setOrders(currentOrders);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
  };

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        price: newItem.price,
        category: newItem.category,
        description: newItem.description || '',
        image: newItem.image || ''
      };
      const updatedMenu = [...menu, item];
      setMenu(updatedMenu);
      saveMenu(updatedMenu);
      setNewItem({ name: '', price: 0, category: '', description: '', image: '' });
    }
  };

  const handleUpdateMenuItem = () => {
    if (editingItem) {
      const updatedMenu = menu.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setMenu(updatedMenu);
      saveMenu(updatedMenu);
      setEditingItem(null);
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    const updatedMenu = menu.filter(item => item.id !== id);
    setMenu(updatedMenu);
    saveMenu(updatedMenu);
  };

  const handleUpdateCarousel = (images: CarouselImage[]) => {
    setCarouselImages(images);
    saveCarouselImages(images);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  // Statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status !== 'delivered').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #3b82f6',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-blue-500/30 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/50 backdrop-blur-sm min-h-screen p-4 border-r border-blue-500/20">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg' : 'text-blue-400 hover:bg-slate-700'
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'orders' ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg' : 'text-blue-400 hover:bg-slate-700'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Orders ({pendingOrders})</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'menu' ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg' : 'text-blue-400 hover:bg-slate-700'
              }`}
            >
              <Package size={20} />
              <span>Menu Management</span>
            </button>
            <button
              onClick={() => setActiveTab('carousel')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'carousel' ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg' : 'text-blue-400 hover:bg-slate-700'
              }`}
            >
              <Upload size={20} />
              <span>Carousel Images</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-emerald-400">₹{totalRevenue}</p>
                    </div>
                    <DollarSign className="text-emerald-400" size={32} />
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-400">{totalOrders}</p>
                    </div>
                    <ShoppingBag className="text-blue-400" size={32} />
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Pending Orders</p>
                      <p className="text-2xl font-bold text-orange-400">{pendingOrders}</p>
                    </div>
                    <TrendingUp className="text-orange-400" size={32} />
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Delivered</p>
                      <p className="text-2xl font-bold text-green-400">{deliveredOrders}</p>
                    </div>
                    <Users className="text-green-400" size={32} />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-blue-500/10">
                      <div>
                        <p className="text-blue-400 font-semibold">Order #{order.id}</p>
                        <p className="text-slate-300">{order.customerInfo.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">₹{order.total}</p>
                        <p className={`text-sm capitalize ${
                          order.status === 'delivered' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Order Management</h2>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-blue-400 font-semibold">Order #{order.id}</h4>
                        <p className="text-slate-300">{order.customerInfo.name} - {order.customerInfo.phone}</p>
                        <p className="text-slate-300">{order.customerInfo.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">₹{order.total}</p>
                        <p className="text-slate-300 capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-white font-semibold mb-2">Items:</h5>
                      {order.items.map(item => (
                        <p key={item.id} className="text-gray-300">
                          {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-white">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                        className="bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-1 focus:border-blue-400 focus:outline-none"
                      >
                        <option value="received">Order Received</option>
                        <option value="cooking">Cooking</option>
                        <option value="preparing">Preparing</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No orders yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Menu Management</h2>
              
              {/* Add New Item */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-blue-500/20 shadow-lg">
                <h4 className="text-blue-400 font-semibold mb-4">Add New Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    className="bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newItem.image}
                    onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    className="bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 md:col-span-2 focus:border-blue-400 focus:outline-none"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleAddMenuItem}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {menu.map(item => (
                  <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 shadow-lg">
                    {editingItem?.id === item.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                          className="w-full bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateMenuItem}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <h4 className="text-blue-400 font-semibold">{item.name}</h4>
                            <p className="text-slate-300">₹{item.price} - {item.category}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'carousel' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Carousel Management</h2>
              <div className="space-y-4">
                {carouselImages.map((image, index) => (
                  <div key={image.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <img src={image.url} alt={image.title} className="w-24 h-24 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="text-blue-400 font-semibold">{image.title}</h4>
                        <p className="text-slate-300">{image.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          const newImages = carouselImages.filter((_, i) => i !== index);
                          handleUpdateCarousel(newImages);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 shadow-lg">
                <h4 className="text-blue-400 font-semibold mb-4">Add New Carousel Image</h4>
                <div className="space-y-4">
                  <input
                    type="url"
                    placeholder="Image URL"
                    className="w-full bg-slate-700 text-white border border-blue-500/30 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value) {
                          const newImage: CarouselImage = {
                            id: Date.now().toString(),
                            url: input.value,
                            title: 'New Deal',
                            description: 'Special offer'
                          };
                          handleUpdateCarousel([...carouselImages, newImage]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <p className="text-slate-400 text-sm">Press Enter to add image</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;