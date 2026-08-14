export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  features: string[];
  suitableFor: string[];
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Nike Revolution 7',
    brand: 'Nike',
    category: 'Running Shoes',
    price: 3999,
    rating: 4.4,
    description:
      'Lightweight running shoes designed for everyday comfort and beginner runners.',
    features: ['Lightweight', 'Comfortable', 'Everyday Running'],
    suitableFor: ['Beginners', 'Daily Running'],
  },
  {
    id: '2',
    name: 'Adidas Duramo SL',
    brand: 'Adidas',
    category: 'Running Shoes',
    price: 3499,
    rating: 4.3,
    description:
      'Comfortable running shoes suitable for daily workouts and beginner runners.',
    features: ['Comfortable', 'Breathable', 'Daily Running'],
    suitableFor: ['Beginners', 'Daily Running'],
  },
  {
    id: '3',
    name: 'Puma Softride Enzo',
    brand: 'Puma',
    category: 'Running Shoes',
    price: 4299,
    rating: 4.2,
    description:
      'Soft and comfortable running shoes for everyday training.',
    features: ['Soft Cushioning', 'Comfortable', 'Training'],
    suitableFor: ['Beginners', 'Daily Running'],
  },
  {
    id: '4',
    name: 'ASICS Gel-Contend 4B',
    brand: 'ASICS',
    category: 'Running Shoes',
    price: 4799,
    rating: 4.5,
    description:
      'Cushioned running shoes designed for comfortable everyday runs.',
    features: ['Cushioned', 'Comfortable', 'Supportive'],
    suitableFor: ['Beginners', 'Daily Running'],
  },
  {
    id: '5',
    name: 'Skechers Go Run Consistent',
    brand: 'Skechers',
    category: 'Running Shoes',
    price: 2999,
    rating: 4.1,
    description:
      'Affordable and comfortable running shoes for beginners and casual runners.',
    features: ['Affordable', 'Lightweight', 'Comfortable'],
    suitableFor: ['Beginners', 'Casual Running'],
  },
  {
    id: '6',
    name: 'Nike Downshifter 13',
    brand: 'Nike',
    category: 'Running Shoes',
    price: 4499,
    rating: 4.3,
    description:
      'Versatile running shoes for daily workouts and beginner-friendly training.',
    features: ['Lightweight', 'Breathable', 'Versatile'],
    suitableFor: ['Beginners', 'Daily Running'],
  },
  {
    id: '7',
    name: 'Adidas Runfalcon 3.0',
    brand: 'Adidas',
    category: 'Running Shoes',
    price: 2799,
    rating: 4.2,
    description:
      'Budget-friendly running shoes for casual running and everyday use.',
    features: ['Affordable', 'Lightweight', 'Everyday Use'],
    suitableFor: ['Beginners', 'Casual Running'],
  },
  {
    id: '8',
    name: 'Puma Flyer Runner',
    brand: 'Puma',
    category: 'Running Shoes',
    price: 3199,
    rating: 4.0,
    description:
      'Lightweight running shoes with comfortable cushioning for everyday use.',
    features: ['Lightweight', 'Cushioned', 'Comfortable'],
    suitableFor: ['Beginners', 'Daily Running'],
  },
];