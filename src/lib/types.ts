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
  account_id: string;
  categories: string;
  icon: string;
};
