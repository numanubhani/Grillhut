import { MenuItem, Order, CarouselImage, CartItem } from '../types';

const MENU_KEY = 'grill_hut_menu';
const ORDERS_KEY = 'grill_hut_orders';
const CAROUSEL_KEY = 'grill_hut_carousel';
const CART_KEY = 'grill_hut_cart';

// Initialize default data
const defaultMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    price: 299,
    category: 'Burgers',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Juicy beef patty with lettuce, tomato, and cheese'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    price: 449,
    category: 'Pizzas',
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Classic pizza with fresh basil and mozzarella'
  },
  {
    id: '3',
    name: 'Chicken Wings',
    price: 199,
    category: 'Appetizers',
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Crispy wings with your choice of sauce'
  },
  {
    id: '4',
    name: 'Club Sandwich',
    price: 249,
    category: 'Sandwiches',
    image: 'https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Triple-layer sandwich with chicken and bacon'
  },
  {
    id: '5',
    name: 'Fresh Orange Juice',
    price: 99,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Freshly squeezed orange juice'
  },
  {
    id: '6',
    name: 'Family Deal',
    price: 899,
    category: 'Deals',
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: '2 Burgers + 1 Pizza + 4 Drinks'
  }
];

const defaultCarousel: CarouselImage[] = [
  {
    id: '1',
    url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Family Deal Special',
    description: 'Get 30% off on family combos'
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Fresh Pizza Daily',
    description: 'Made with the finest ingredients'
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Gourmet Burgers',
    description: 'Handcrafted perfection in every bite'
  }
];

export const getMenu = (): MenuItem[] => {
  const stored = localStorage.getItem(MENU_KEY);
  if (!stored) {
    localStorage.setItem(MENU_KEY, JSON.stringify(defaultMenu));
    return defaultMenu;
  }
  return JSON.parse(stored);
};

export const saveMenu = (menu: MenuItem[]): void => {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
};

export const getCarouselImages = (): CarouselImage[] => {
  const stored = localStorage.getItem(CAROUSEL_KEY);
  if (!stored) {
    localStorage.setItem(CAROUSEL_KEY, JSON.stringify(defaultCarousel));
    return defaultCarousel;
  }
  return JSON.parse(stored);
};

export const saveCarouselImages = (images: CarouselImage[]): void => {
  localStorage.setItem(CAROUSEL_KEY, JSON.stringify(images));
};

export const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (item: MenuItem): void => {
  const cart = getCart();
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  
  saveCart(cart);
};

export const removeFromCart = (itemId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  saveCart(updatedCart);
};

export const updateCartQuantity = (itemId: string, quantity: number): void => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }
};

export const clearCart = (): void => {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
};