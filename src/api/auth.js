import api from "./axios";

export const loginApi = (email, password) => {
  return api.post("/login", {
    email,
    password,
    device_name: "Mobile App",
  });
};

export const registerApi = (name, email, password, password_confirmation) => {
  return api.post("/register", {
    name,
    email,
    password,
    password_confirmation,
  });
};

export const logoutApi = () => {
  return api.post("/logout");
};
