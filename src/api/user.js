import api from "./axios";

export const getProfile = () => api.get("/user/profile");
export const updateProfile = (data) => api.put("/user/profile", data);
export const getQRCode = () => api.get("/user/qrcode");
export const getTransactions = () => api.get("/user/transactions");
export const getTransactionDetail = (id) =>
  api.get(`/user/transactions/${id}`);
export const withdraw = (amount) =>
  api.post("/user/withdrawals", { amount });
