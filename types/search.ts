export type SearchIntent = {
  originalQuery: string;
  category: string | null;
  maxPrice: number | null;
  preferences: string[];
  suitableFor: string[];
};