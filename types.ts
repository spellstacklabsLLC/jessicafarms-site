
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
  Farm = 'farm',
  Shop = 'shop',
  Studio = 'studio',
  Play = 'play',
  Checkout = 'checkout',
  Contact = 'contact'
}
