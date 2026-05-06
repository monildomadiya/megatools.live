export interface Tool {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  icon: string;
  inputs: CalculatorInput[];
  outputLabels: string[];
  faqs: FAQ[];
  relatedTools: string[]; // slug list
  updatedAt: string;
  adsEnabled: boolean;
  formulaDescription?: string;
  howToUse?: string[];
  exampleCalculation?: string;
}

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  unit?: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
}
