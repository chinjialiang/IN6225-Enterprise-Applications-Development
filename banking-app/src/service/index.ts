import axios from "axios";

export const registerUser = async (
  userId: string,
  pin: string,
  name: string,
  accountBalance: number
) => {
  try {
    const result = await axios.post("http://localhost:8080/register", {
      userId,
      pin,
      name,
      accountBalance,
    });
    console.log("POST /register >>>", result);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error >>>", error);
      return false;
    }
  }
};

export const authenticateUser = async (userId: string, pin: string) => {
  try {
    const result = await axios.post("http://localhost:8080/login", {
      userId,
      pin,
    });
    console.log("POST /login >>>", result);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error >>>", error);
      return false;
    }
  }
};

export const fetchTransactionsByAccountId = async (accountId: string) => {
  try {
    const result = await axios.get(`http://localhost:8080/transactions/${accountId}`);
    console.log(`GET /transactions/${accountId} >>>`, result);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error >>>", error);
      return [];
    }
  }
};

export const transferFund = async (fromAccount: string, toAccount: string, amount: number) => {
  try {
    const result = await axios.post("http://localhost:8080/transfer-fund", {
      fromAccount,
      toAccount,
      amount,
    });
    console.log("POST /transfer-fund >>>", result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error >>>", error);
      return error.response?.data;
    }
  }
};
