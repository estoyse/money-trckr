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
