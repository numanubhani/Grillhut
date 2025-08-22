export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'received' | 'cooking' | 'preparing' | 'delivered';
  paymentMethod: 'cash' | 'online';
  paymentScreenshot?: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  timestamp: number;
}

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}