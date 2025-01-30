export interface UserOverview {
  expenses: number;
  income: number;
  totalBalance: number;
  totalTransactions: number;
  accounts: Account[];
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
};
