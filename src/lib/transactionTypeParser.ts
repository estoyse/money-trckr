export function transactionTypeParser(type: number) {
  switch (type) {
    case 0:
      return "Expense";
    case 1:
      return "Withdrawal";
    case 2:
      return "Transfer";
    case 3:
      return "Topup";
  }
}
