import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';
import { MenuItem, Order, CarouselImage } from '../types';
import { 
  getMenu, 
  saveMenu, 
  getOrders, 
  updateOrderStatus, 
  getCarouselImages, 
  saveCarouselImages 
} from '../utils/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'carousel'>('orders');
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
    if (isOpen) {
      setOrders(getOrders());
      setMenu(getMenu());
      setCarouselImages(getCarouselImages());
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-5/6 overflow-hidden">
        <div className="p-6 border-b border-yellow-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-400">Admin Panel</h2>
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === 'orders' ? 'bg-yellow-400 text-black' : 'text-yellow-400 hover:bg-gray-700'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === 'menu' ? 'bg-yellow-400 text-black' : 'text-yellow-400 hover:bg-gray-700'
                }`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('carousel')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === 'carousel' ? 'bg-yellow-400 text-black' : 'text-yellow-400 hover:bg-gray-700'
                }`}
              >
                Carousel Images
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Order Management</h3>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-gray-800 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-yellow-400 font-semibold">Order #{order.id}</h4>
                          <p className="text-gray-300">{order.customerInfo.name} - {order.customerInfo.phone}</p>
                          <p className="text-gray-300">{order.customerInfo.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold">₹{order.total}</p>
                          <p className="text-gray-300 capitalize">{order.paymentMethod}</p>
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
                          className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1"
                        >
                          <option value="received">Order Received</option>
                          <option value="cooking">Cooking</option>
                          <option value="preparing">Preparing</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        {order.paymentScreenshot && (
                          <button
                            onClick={() => window.open(order.paymentScreenshot, '_blank')}
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                          >
                            <Eye size={16} />
                            <span>View Screenshot</span>
                          </button>
                        )}
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
                <h3 className="text-xl font-bold text-white mb-6">Menu Management</h3>
                
                {/* Add New Item */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <h4 className="text-yellow-400 font-semibold mb-4">Add New Item</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={newItem.image}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                    />
                    <textarea
                      placeholder="Description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 md:col-span-2"
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
                    <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                      {editingItem?.id === item.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                          />
                          <input
                            type="number"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
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
                          <div>
                            <h4 className="text-yellow-400 font-semibold">{item.name}</h4>
                            <p className="text-gray-300">₹{item.price} - {item.category}</p>
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
                <h3 className="text-xl font-bold text-white mb-6">Carousel Management</h3>
                <div className="space-y-4">
                  {carouselImages.map((image, index) => (
                    <div key={image.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <img src={image.url} alt={image.title} className="w-20 h-20 object-cover rounded" />
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
                <div className="mt-6 bg-gray-800 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-4">Add New Carousel Image</h4>
                  <div className="space-y-4">
                    <input
                      type="url"
                      placeholder="Image URL"
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
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
      </div>
    </div>
  );
};

export default AdminPanel;