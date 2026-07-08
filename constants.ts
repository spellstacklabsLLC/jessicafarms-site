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
    description: 'Warm cinnamon folded into slow-whipped raw honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/cinnamon-honey.jpg'
  },
  {
    id: 'h2',
    name: 'Chocolate Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Decadent premium dark cocoa blended with slow-churned raw honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/chocolate-honey.jpg'
  },
  {
    id: 'h3',
    name: 'Strawberry Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Sun-ripened strawberry essence creamed with velvety sweet honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/strawberry-honey.jpg'
  },
  {
    id: 'h4',
    name: 'Habanero Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Smooth creamed honey blended with habanero chile powder. Sweet, spicy, and handcrafted in small batches with a warm lingering heat. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/habanero-honey.jpg'
  },
  // {
  //   id: 'h5',
  //   name: 'Cherry Creamed Honey',
  //   price: '3-Jar Box Item',
  //   priceNumber: 14.99,
  //   description: 'Ohio wild cherry sweet essence spun with deep whipped honey. 5oz jar.',
  //   category: 'hive',
  //   imageUrl: '/assets/cherry-honey.jpg'
  // },
  // {
  //   id: 'h6',
  //   name: 'Hot Honey Chilli Infusion',
  //   price: '3-Jar Box Item',
  //   priceNumber: 14.99,
  //   description: 'Wildflower honey infused with dried heirloom chilis for a clean sweet kick. 5oz jar.',
  //   category: 'hive',
  //   imageUrl: '/assets/hot-honey.jpg'
  // },
  // {
  //   id: 'h7',
  //   name: 'Espresso Creamed Honey',
  //   price: '3-Jar Box Item',
  //   priceNumber: 14.99,
  //   description: 'Dark-roasted premium espresso spun with slow-churned whipped honey. 5oz jar.',
  //   category: 'hive',
  //   imageUrl: '/assets/espresso-honey.jpg'
  // },
  {
    id: 'h8',
    name: 'Peanut Butter Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Organic peanut butter churned with smooth wildflower creamed honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/peanut-butter-honey.jpg'
  },
  {
    id: 'h9',
    name: 'Regular Creamed Honey',
    price: '3-Jar Box Item',
    priceNumber: 14.99,
    description: 'Unfiltered wildflowers slowly whipped to a spreadable velvet finish. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/regular-honey.jpg'
  }
];

export const COMING_SOON_PRODUCTS: any[] = [];

export const INTRO_VIDEO = {
  id: 'YU3XNKGCLeg',
  title: 'Jessica Farms TV',
  description: 'Join us on our journey here in Norton, Ohio. Subscribe for the latest farm updates, educational tips, and behind-the-scenes moments from the apiary.'
};

export const CONFIG = {
  enableStore: getEnvVar('VITE_ENABLE_STORE') !== 'false', // Default to true unless explicitly 'false'
  enableStudio: getEnvVar('VITE_ENABLE_STUDIO') === 'true', // Default to false unless explicitly 'true'
  enablePlay: getEnvVar('VITE_ENABLE_PLAY') === 'true', // Default to false unless explicitly 'true'
  enableEducation: getEnvVar('VITE_ENABLE_EDUCATION') === 'true', // Default to false unless explicitly 'true'
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

export interface Market {
  name: string;
  day: string;
  time: string;
  location: string;
  description?: string;
}

export const MARKET_SCHEDULE: Market[] = [
  {
    name: "Main Street Wadsworth Farmers Market",
    day: "Saturdays, July 11 – Sept 26, 2026",
    time: "9:00 AM – 12:00 PM",
    location: "121 Watrusa Ave., Wadsworth, OH 44281",
    description: "Join us weekly in Wadsworth! Find our handcrafted creamed honey, fresh beeswax candles, and raw Ohio wildflower honey."
  },
  {
    name: "Main Street Wadsworth (Evening Market)",
    day: "Wednesdays, July 8, Aug 12, Sept 9",
    time: "5:00 PM – 8:00 PM",
    location: "121 Watrusa Ave., Wadsworth, OH 44281",
    description: "A special monthly midweek evening market. Perfect for picking up honey gifts and local artisanal goods."
  },
  {
    name: "The Green Farmers Market",
    day: "Thursdays, June 11 – Sept 10",
    time: "4:00 PM – 7:00 PM",
    location: "3891 South Arlington Rd, Uniontown, OH 44685",
    description: "An incredible community market showcasing the best in local agriculture. Come sample our latest creamed honey flavors!"
  },
  {
    name: "Celestia Summerfest Music & Arts Festival",
    day: "Saturday, August 1",
    time: "Starting at 1:00 PM",
    location: "Wadsworth, OH",
    description: "A gorgeous celebration of local music and arts. Drop by our booth to experience our educational live observation bee hive!"
  },
  {
    name: "Norton Cider Festival",
    day: "Oct 2, 3, & 4, 2026",
    time: "Festival Hours",
    location: "Norton, OH",
    description: "A beloved local tradition! Enjoy wonderful cider, family-friendly fun, and visit our farm booth for all your fall honey supply."
  }
];

