import { useState } from "react";
import axios from "axios";

export default function useForm(baseURL = "", token = null) {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ only add if token exists
    },
  });

  const request = async (method, url, body = null) => {
    setLoading(true);
    setErrors(null);

    try {
      const response = await api({
        method,
        url,
        data: body,
      });
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
        setLoading(false);
      } else {
        setLoading(false);
        setErrors({ message: error.message });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => request("GET", url);
  const post = (url, body) => request("POST", url, body);
  const put = (url, body) => request("PUT", url, body);

  const del = async (endpoint, body = {}, auth = false) => {
    setLoading(true);
    setErrors(null);

    try {
      const headers = {
        "Content-Type": "application/json",
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.delete(`${baseURL}${endpoint}`, {
        headers,
        data: body, // ✅ this ensures JSON body is sent
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setErrors(err.response ? err.response.data : err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setErrors(null);
  };

  return {
    data,
    errors,
    loading,
    get,
    post,
    put,
    del,
    reset,
  };
}
