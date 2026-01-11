import api from "./axios";

export const findUserByMemberCode = (code) =>
  api.get(`/users/find/${code}`);

export const createTransaction = (data) =>
  api.post("/cashier/transactions", data);

export const getCashierTransactions = () =>
  api.get("/cashier/transactions");
