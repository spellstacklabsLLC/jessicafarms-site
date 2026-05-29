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
  {
    id: 'h1',
    name: 'Cinnamon Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Smooth pure honey slowly creamed with real organic cinnamon for a rich, spreadable texture perfect for toast, coffee, biscuits, and warm desserts. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/cinnamon-honey.jpg'
  },
  {
    id: 'h2',
    name: 'Chocolate Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Decadent slow-churned honey blended with premium dark Belgian cocoa. Pure chocolate bliss in a clean, spreadable honey jar. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/chocolate-honey.jpg'
  },
  {
    id: 'h3',
    name: 'Strawberry Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Vibrant, velvety creamed honey whipped with organic sun-ripened strawberry essence. Bright, sweet, and perfectly fruity. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/strawberry-honey.jpg'
  },
  // {
  //   id: 'h4',
  //   name: 'Banana Creamed Honey',
  //   price: '3-Jar Box Item',
  //   priceNumber: 14.99,
  //   description: 'Silky whipped clover honey infused with rich, natural banana sweetness. Tastes just like homemade banana cream comfort. 5oz jar.',
  //   category: 'hive',
  //   imageUrl: '/assets/banana-honey.jpg'
  // },
  {
    id: 'h5',
    name: 'Habanero Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Smooth creamed honey blended with habanero chile powder. Sweet, spicy, and handcrafted in small batches with a warm lingering heat. 5oz jar.'    ,
    category: 'hive',
    imageUrl: '/assets/habanero-honey.jpg'
  },
  // {
  //   id: 'h6',
  //   name: 'Hot Honey Chilli Infusion',
  //   price: '3-Jar Box Item',
  //   priceNumber: 14.99,
  //   description: 'Ohio wildflower honey slowly infused with dried heirloom chili peppers. Perfect clean sweet kick with a fiery finish. 5oz jar.',
  //   category: 'hive',
  //   imageUrl: '/assets/hot-honey.jpg'
  // },
  // {
  //   id: 'h7',
  //   name: 'Espresso Creamed Honey',
  //   price: '3-Jar Box Item',
  //   priceNumber: 14.99,
  //   description: 'Rich, slow-churned whipped honey spun with fresh, dark-roasted premium espresso beans. Aromatic, bold, and deeply energizing. 5oz jar.',
  //   category: 'hive',
  //   imageUrl: '/assets/espresso-honey.jpg'
  // },
  {
    id: 'h8',
    name: 'Peanut Butter Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Rich, smooth clover honey slowly churned with natural organic peanut butter. A high-protein, savory-sweet spread perfect for toast, banana slices, and direct spoonfuls. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/peanut-butter-honey.jpg'
  },
  {
    id: 'h9',
    name: 'Original Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Our classic, pure, unfiltered Ohio wildflower clover honey whipped slowly until it reaches a beautiful, spreadable velvety white texture. Pure, clean comfort. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/regular-honey.jpg'
  }
];

export const COMING_SOON_PRODUCTS: any[] = [];

export const INTRO_VIDEO = {
  id: 'YU3XNKGCLeg',
  title: 'Jessica Farms Studio',
  description: 'Join us on our journey here in Norton, Ohio. Subscribe for the latest farm updates, educational tips, and behind-the-scenes moments from the apiary.'
};

export const CONFIG = {
  enableStore: getEnvVar('VITE_ENABLE_STORE') !== 'true', // Default to true unless explicitly 'false'
  enableStudio: getEnvVar('VITE_ENABLE_STUDIO') === 'true', // Default to false unless explicitly 'true'
  enablePlay: getEnvVar('VITE_ENABLE_PLAY') === 'true', // Default to false unless explicitly 'true'
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
