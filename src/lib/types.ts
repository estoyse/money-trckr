export interface UserOverview {
  expenses: number;
  income: number;
  totalBalance: number;
  totalTransactions: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
  created_at: string;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
}

export type Transaction = {
  amount: number;
  created_at: string;
  id: string;
  location: string;
  transaction_date: string;
  type: number;
  user_id: string;
  description: string;
  account: string;
  categories: string;
  icon: string;
};
