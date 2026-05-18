
import { Product } from './types';
import { getEnvVar } from './env';

export const COLORS = {
  cream: '#fdfcf8',
  honey: '#d9a520', // From logo
  forest: '#1a4332', // From logo
  blue: '#219ebc',
  amber: '#fb8500',
  darkBrown: '#2a2a2a',
};

export const PRODUCTS: Product[] = [
  // HIVE CATEGORY
  {
    id: 'h1',
    name: 'Cinnamon Creamed Honey',
    price: '$8.50',
    priceNumber: 8.5,
    description: 'Smooth, spreadable creamed honey infused with organic Ceylon cinnamon. Part of our "Any 3 for $24.99" special! 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/cinnamon-honey.jpg'
  },
  {
    id: 'h2',
    name: 'Chocolate Creamed Honey',
    price: '$8.50',
    priceNumber: 8.5,
    description: 'Decadent creamed honey blended with dark cocoa. Dessert in a jar. Part of our "Any 3 for $24.99" special! 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/chocolate-honey.jpg'
  },
  {
    id: 'h3',
    name: 'Strawberry Creamed Honey',
    price: '$8.50',
    priceNumber: 8.5,
    description: 'Vibrant creamed honey blended with real organic strawberries. A bright, fruity favorite. Part of our "Any 3 for $24.99" special! 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/strawberry-honey.jpg'
  },
  {
    id: 'h4',
    name: 'Regular Creamed Honey',
    price: '$8.50',
    priceNumber: 8.5,
    description: '100% pure, raw Ohio honey whipped into a smooth, buttery consistency. Part of our "Any 3 for $24.99" special! 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/regular-creamed-honey.jpg'
  },
  {
    id: 'h5',
    name: 'Hot Creamed Honey',
    price: '$8.50',
    priceNumber: 8.5,
    description: 'Sweet honey with a localized kick! Infused with dried chili peppers for a perfect heat. Part of our "Any 3 for $24.99" special! 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/hot-honey.jpg'
  },
  {
    id: 'h6',
    name: 'Banana Creamed Honey',
    price: '$8.50',
    priceNumber: 8.5,
    description: 'Creamed honey with natural banana essence. Like comfort food in a jar. Part of our "Any 3 for $24.99" special! 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/banana-honey.jpg'
  }
];

export const INTRO_VIDEO = {
  id: '6X5Kf7cy5CM',
  title: 'Welcome to Jessica Farms Studio',
  description: 'Join us on our journey here in Norton, Ohio. Subscribe for the latest farm updates, educational tips, and behind-the-scenes moments from the apiary.'
};

export const CONFIG = {
  enableStore: getEnvVar('VITE_ENABLE_STORE') !== 'false', // Default to true unless explicitly 'false'
};

export const HONEY_RECIPES = [
  {
    title: "Butterbean Honey Glazed Salmon",
    time: "20 mins",
    difficulty: "Easy",
    ingredients: ["2 Salmon fillets", "3 tbsp Butterbean Honey", "2 cloves minced garlic", "1 tbsp Soy sauce", "Lemon juice"],
    instructions: "Whisk honey, garlic, and soy sauce. Sear salmon for 4 mins, pour glaze over, and cook until caramelized."
  }
];
