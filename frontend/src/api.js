import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// ✅ Signup
export const signup = async (username, password) => {
  return await API.post("/signup", { username, password });
};

// ✅ Login
export const login = async (username, password) => {
  return await API.post("/login", { username, password });
};

// ✅ Entries
export const getEntries = async (token) => {
  return await API.get("/entries", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addEntry = async (token, data) => {
  return await API.post("/entries", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// Attach token to all requests
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;