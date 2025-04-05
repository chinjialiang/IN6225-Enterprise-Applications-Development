export const formatCurrency = (amount: number) => {
  const checkDecimal = amount?.toString().split(".");
  if (checkDecimal?.length === 1) {
    return "S$" + amount?.toLocaleString() + ".00";
  }
  return "S$" + amount?.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

export const formatAccountNumber = (accountNumber: string) => {
  const first = accountNumber.slice(0, 3);
  const second = accountNumber.slice(3, 10);
  const third = accountNumber.slice(10, 13);
  return first + "-" + second + "-" + third;
};

export const unformatAccountNumber = (accountNumber: string) => {
  return accountNumber.replace("-", "").replace("-", "");
};
