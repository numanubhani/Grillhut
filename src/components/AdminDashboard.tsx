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
  LogOut,
  X,
  Eye
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [processedOrderIds, setProcessedOrderIds] = useState<Set<string>>(new Set());
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
  }, []);

  useEffect(() => {
    // Check for new orders periodically and show toast
    const interval = setInterval(() => {
      const currentOrders = getOrders();
      
      // Find new orders that haven't been processed yet
      const newOrders = currentOrders.filter(order => !processedOrderIds.has(order.id));
      
      if (newOrders.length > 0) {
        newOrders.forEach(newOrder => {
          toast.success(
            <div 
              className="cursor-pointer"
              onClick={() => {
                setSelectedOrder(newOrder);
                setIsOrderModalOpen(true);
                toast.dismiss();
              }}
            >
              <div className="font-semibold">New order received!</div>
              <div className="text-sm">Order #{newOrder.id}</div>
              <div className="text-xs text-yellow-300 mt-1">Click to view details</div>
            </div>,
            {
              duration: 8000,
              position: 'top-right',
            }
          );
        });
        
        // Update processed order IDs
        const newProcessedIds = new Set([...processedOrderIds, ...newOrders.map(o => o.id)]);
        setProcessedOrderIds(newProcessedIds);
        setOrders(currentOrders);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [processedOrderIds]);

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

  const OrderDetailsModal = () => {
    if (!isOrderModalOpen || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-yellow-500/30 shadow-2xl">
          <div className="p-6 border-b border-yellow-500/30">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400">Order Details</h2>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Order ID</p>
                <p className="text-yellow-400 font-semibold">#{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Amount</p>
                <p className="text-yellow-400 font-semibold">₹{selectedOrder.total}</p>
              </div>
              <div>
                <p className="text-gray-400">Payment Method</p>
                <p className="text-white capitalize">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="text-green-400 capitalize">{selectedOrder.status}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-3">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">Name:</span> {selectedOrder.customerInfo.name}</p>
                <p className="text-white"><span className="text-gray-400">Phone:</span> {selectedOrder.customerInfo.phone}</p>
                <p className="text-white"><span className="text-gray-400">Address:</span> {selectedOrder.customerInfo.address}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">₹{item.price} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">Qty: {item.quantity}</p>
                      <p className="text-yellow-400 font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Screenshot */}
            {selectedOrder.paymentScreenshot && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-3">Payment Screenshot</h3>
                <img 
                  src={selectedOrder.paymentScreenshot} 
                  alt="Payment screenshot" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            )}

            {/* Status Update */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-3">Update Status</h3>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  handleStatusUpdate(selectedOrder.id, e.target.value as Order['status']);
                  setSelectedOrder({...selectedOrder, status: e.target.value as Order['status']});
                }}
                className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
              >
                <option value="received">Order Received</option>
                <option value="cooking">Cooking</option>
                <option value="preparing">Preparing</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status !== 'delivered').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 8000,
          style: {
            background: '#1f2937',
            color: '#f1f5f9',
            border: '1px solid #eab308',
          },
          success: {
            iconTheme: {
              primary: '#eab308',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
      <div className="bg-gray-900/95 backdrop-blur-md border-b border-yellow-500/30 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
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
        <div className="w-64 bg-gray-800/50 backdrop-blur-sm min-h-screen p-4 border-r border-yellow-500/20">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'dashboard' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg' : 'text-yellow-400 hover:bg-gray-700'
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'orders' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg' : 'text-yellow-400 hover:bg-gray-700'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Orders ({pendingOrders})</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'menu' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg' : 'text-yellow-400 hover:bg-gray-700'
              }`}
            >
              <Package size={20} />
              <span>Menu Management</span>
            </button>
            <button
              onClick={() => setActiveTab('carousel')}
              className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center space-x-2 ${
                activeTab === 'carousel' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg' : 'text-yellow-400 hover:bg-gray-700'
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
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-yellow-400">₹{totalRevenue}</p>
                    </div>
                    <DollarSign className="text-yellow-400" size={32} />
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">Total Orders</p>
                      <p className="text-2xl font-bold text-yellow-400">{totalOrders}</p>
                    </div>
                    <ShoppingBag className="text-yellow-400" size={32} />
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">Pending Orders</p>
                      <p className="text-2xl font-bold text-orange-400">{pendingOrders}</p>
                    </div>
                    <TrendingUp className="text-orange-400" size={32} />
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">Delivered</p>
                      <p className="text-2xl font-bold text-green-400">{deliveredOrders}</p>
                    </div>
                    <Users className="text-green-400" size={32} />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg border border-yellow-500/10">
                      <div>
                        <p className="text-yellow-400 font-semibold">Order #{order.id}</p>
                        <p className="text-gray-300">{order.customerInfo.name}</p>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <div>
                          <p className="text-yellow-400 font-bold">₹{order.total}</p>
                        <p className={`text-sm capitalize ${
                          order.status === 'delivered' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {order.status}
                        </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderModalOpen(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Eye size={20} />
                        </button>
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
                  <div key={order.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-yellow-400 font-semibold">Order #{order.id}</h4>
                        <p className="text-gray-300">{order.customerInfo.name} - {order.customerInfo.phone}</p>
                        <p className="text-gray-300">{order.customerInfo.address}</p>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <div>
                          <p className="text-yellow-400 font-bold">₹{order.total}</p>
                          <p className="text-gray-300 capitalize">{order.paymentMethod}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderModalOpen(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Eye size={20} />
                        </button>
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
                        className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-1 focus:border-yellow-400 focus:outline-none"
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
                  <p className="text-gray-400 text-center py-8">No orders yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Menu Management</h2>
              
              {/* Add New Item */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-yellow-500/20 shadow-lg">
                <h4 className="text-yellow-400 font-semibold mb-4">Add New Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newItem.image}
                    onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 md:col-span-2 focus:border-yellow-400 focus:outline-none"
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
                  <div key={item.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 shadow-lg">
                    {editingItem?.id === item.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                          className="w-full bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                          className="w-full bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
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
                            <h4 className="text-yellow-400 font-semibold">{item.name}</h4>
                            <p className="text-gray-300">₹{item.price} - {item.category}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-yellow-400 hover:text-yellow-300"
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
                  <div key={image.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <img src={image.url} alt={image.title} className="w-24 h-24 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="text-yellow-400 font-semibold">{image.title}</h4>
                        <p className="text-gray-300">{image.description}</p>
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
              <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 shadow-lg">
                <h4 className="text-yellow-400 font-semibold mb-4">Add New Carousel Image</h4>
                <div className="space-y-4">
                  <input
                    type="url"
                    placeholder="Image URL"
                    className="w-full bg-gray-700 text-white border border-yellow-500/30 rounded px-3 py-2 focus:border-yellow-400 focus:outline-none"
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
                  <p className="text-gray-400 text-sm">Press Enter to add image</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <OrderDetailsModal />
    </div>
  );
};

export default AdminDashboard;