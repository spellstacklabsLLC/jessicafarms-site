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
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Warm cinnamon folded into slow-whipped raw honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/cinnamon-honey.jpg'
  },
  {
    id: 'h2',
    name: 'Chocolate Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Decadent premium dark cocoa blended with slow-churned raw honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/chocolate-honey.jpg'
  },
  {
    id: 'h3',
    name: 'Strawberry Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Sun-ripened strawberry essence creamed with velvety sweet honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/strawberry-honey.jpg'
  },
  {
    id: 'h4',
    name: 'Banana Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Rich, natural banana sweetness whipped with silky clover honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/banana-honey.jpg'
  },
  {
    id: 'h5',
    name: 'Cherry Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Ohio wild cherry sweet essence spun with deep whipped honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/cherry-honey.jpg'
  },
  {
    id: 'h6',
    name: 'Hot Honey Chilli Infusion',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Wildflower honey infused with dried heirloom chilis for a clean sweet kick. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/hot-honey.jpg'
  },
  {
    id: 'h7',
    name: 'Espresso Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Dark-roasted premium espresso spun with slow-churned whipped honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/espresso-honey.jpg'
  },
  {
    id: 'h8',
    name: 'Peanut Butter Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
    description: 'Organic peanut butter churned with smooth wildflower creamed honey. 5oz jar.',
    category: 'hive',
    imageUrl: '/assets/peanut-butter-honey.jpg'
  },
  {
    id: 'h9',
    name: 'Regular Creamed Honey',
    price: '$10.00',
    priceNumber: 10.00,
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
  enableStore: true,
  enableStudio: getEnvVar('VITE_ENABLE_STUDIO') === 'true', // Default to false unless explicitly 'true'
  enablePlay: getEnvVar('VITE_ENABLE_PLAY') === 'true', // Default to false unless explicitly 'true'
  enableEducation: true,
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
    name: "Norton Craft Fair & Gift Show",
    day: "Sat, Oct 24",
    time: "9 AM – 3 PM",
    location: "Norton Elementary, Norton",
    description: "Join us at Norton Elementary for local craft favorites, artisanal creamed honey, and seasonal gifts."
  },
  {
    name: "Medina Eagles Holiday Craft Show",
    day: "Sun, Nov 15",
    time: "10 AM – 4 PM",
    location: "696 Lafayette Rd, Medina",
    description: "Shop raw wildflower honey, infused creamed honey, and handcrafted bee gifts in Medina."
  },
  {
    name: "Barberton Christmas Walk",
    day: "Sat, Nov 28",
    time: "2 – 8 PM",
    location: "Barberton",
    description: "Celebrate the season in downtown Barberton! Enjoy sweet holiday treats, hot honey, and gifts."
  },
  {
    name: "720 Holiday Market #1",
    day: "Fri, Dec 4",
    time: "4 – 8 PM",
    location: "Oakwood Square, Canton",
    description: "Kick off holiday shopping under the market lights with our handcrafted creamed honeys."
  },
  {
    name: "720 Holiday Market #2",
    day: "Sat, Dec 5",
    time: "12 – 4 PM",
    location: "Oakwood Square, Canton",
    description: "Afternoon festive market at Oakwood Square with small-batch honeys and holiday gift sets."
  },
  {
    name: "Mistletoe Market",
    day: "Sat, Dec 5",
    time: "9 AM – 3 PM",
    location: "Hartville MarketPlace",
    description: "Find us at Hartville MarketPlace for the annual Mistletoe Market featuring our best-selling artisanal honey."
  },
  {
    name: "720 Holiday Market #3",
    day: "Fri, Dec 11",
    time: "4 – 8 PM",
    location: "Oakwood Square, Canton",
    description: "Festive evening market in Canton featuring our limited small-batch honey creations and stocking stuffers."
  },
  {
    name: "720 Holiday Market #4",
    day: "Sat, Dec 12",
    time: "12 – 4 PM",
    location: "Oakwood Square, Canton",
    description: "Catch us for Saturday holiday shopping at Oakwood Square with whipped creamed honey and sweet gifts."
  },
  {
    name: "Christmas in the Valley",
    day: "Sun, Dec 13",
    time: "Starts 11 AM",
    location: "Valley City",
    description: "A magical holiday tradition in Valley City! Stop by our booth for sweet holiday cheer, raw honey, and hot honey."
  }
];

export const HOT_HONEY_PRODUCT: Product = {
  id: 'hot-honey',
  name: 'Jessica Farms Hot Honey',
  price: '$14',
  priceNumber: 14.00,
  description: 'Made with real honey, habanero & ghost peppers. Sweet heat with a serious kick.',
  category: 'hive',
  imageUrl: '/assets/hot-honey.jpg'
};

