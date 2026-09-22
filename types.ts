
export interface Product {
  id: string;
  name: string;
  price: string;
  priceNumber: number;
  description: string;
  category: 'hive';
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum Page {
  Home = 'home',
  Shop = 'shop',
  Studio = 'studio',
  Play = 'play',
  Checkout = 'checkout',
  Contact = 'contact',
  WholesaleOrder = 'wholesale-order'
}

export interface WholesaleOrderData {
  cases: number;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    aptSuite?: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
}
