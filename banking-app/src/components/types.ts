export interface User {
  userId: string;
  pin: string;
  name: string;
  accountNumber: string;
  accountBalance: number;
  createdAt: number;
  lastLogin: number;
}

export interface Transaction {
  amount: number;
  dateTime: number;
  fromAccount: string;
  toAccount: string;
  transactionId: string;
}
