import axios from "axios";

const API = axios.create({

  baseURL: "http://172.20.10.11:5000/api",

});

// Automatically attach the token to every request

API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});

export default API;