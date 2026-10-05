export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

/** Customer row enriched with order statistics (what an admin list endpoint would return). */
export interface CustomerSummary extends Customer {
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}
