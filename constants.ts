
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
  // BEES CATEGORY
  {
    id: 'b2',
    name: 'Hametown Honey',
    price: '$12.00',
    priceNumber: 12,
    description: '100% pure raw Ohio honey, harvested directly from our Norton hives. 1 pound jar.',
    category: 'bees',
    imageUrl: '/assets/honey-jar.jpg'
  },
  {
    id: 'b1',
    name: 'Habanero Hot Honey',
    price: '$12.00',
    priceNumber: 12,
    description: 'Our signature "Hot Honey" — local nectar infused with farm-grown habanero peppers. 1 pound jar.',
    category: 'bees',
    imageUrl: '/assets/hot-honey.jpg'
  },
  // KOI CATEGORY
  {
    id: 'k1',
    name: 'Premium Select Koi (4-6")',
    price: '$20.00',
    priceNumber: 20,
    description: 'Vibrant and healthy young koi with early pattern development, perfect for new pond owners.',
    category: 'koi',
    imageUrl: '/assets/koi-small.jpg'
  },
  {
    id: 'k2',
    name: 'Premium Select Koi (6-8")',
    price: '$40.00',
    priceNumber: 40,
    description: 'Beautifully patterned koi with strong colors and excellent growth potential for established ponds.',
    category: 'koi',
    imageUrl: '/assets/koi-medium.jpg'
  },
  {
    id: 'k3',
    name: 'Premium Select Koi (8-10")',
    price: '$75.00',
    priceNumber: 75,
    description: 'Our largest premium select grade. Robust health, stunning scale definition, and deep coloration.',
    category: 'koi',
    imageUrl: '/assets/koi-large.jpg'
  },
  // PLANTS CATEGORY
  {
    id: 'p1',
    name: 'Cat Grass Seeds',
    price: '$6.50',
    priceNumber: 6.5,
    description: 'Organic, high-germination wheatgrass seeds. Grow the freshest grass for your feline friends at home.',
    category: 'plants',
    imageUrl: '/assets/cat-grass.jpg'
  },
  {
    id: 'p2',
    name: 'Succulents',
    price: '$12.00',
    priceNumber: 12,
    description: 'Hand-picked variety of hardy, easy-care succulents grown right here in our greenhouse.',
    category: 'plants',
    imageUrl: '/assets/succulents.jpg'
  },
  // APPAREL CATEGORY
  {
    id: 'a1',
    name: 'Jessica Farms Sticker',
    price: '$3.00',
    priceNumber: 3,
    description: 'High-quality, weather-proof vinyl sticker featuring our Norton farm logo.',
    category: 'apparel',
    imageUrl: '/assets/sticker.jpg'
  },
  {
    id: 'a2',
    name: 'Farm Logo Magnet',
    price: '$5.00',
    priceNumber: 5,
    description: 'Durable fridge magnet. Bring a little piece of the farm into your kitchen.',
    category: 'apparel',
    imageUrl: '/assets/magnet.jpg'
  },
  {
    id: 'a3',
    name: 'Jessica Farms Hat',
    price: '$25.00',
    priceNumber: 25,
    description: 'Classic embroidered trucker hat. One size fits all with an adjustable strap.',
    category: 'apparel',
    imageUrl: '/assets/hat.jpg'
  }
];

export const INTRO_VIDEO = {
  id: '6X5Kf7cy5CM',
  title: 'Welcome to Jessica Farms Studio',
  description: 'Join us on our journey here in Norton, Ohio. Subscribe for the latest farm updates, educational tips, and behind-the-scenes moments from the apiary to the pond.'
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
