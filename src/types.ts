export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  recommended?: boolean;
}