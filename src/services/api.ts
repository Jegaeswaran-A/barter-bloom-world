
import { toast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Types for API requests and responses
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  bio?: string;
  location?: string;
}

export interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  owner: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  lookingFor?: string;
  location?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ItemData {
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  lookingFor?: string;
  location?: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to handle API requests
const apiRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return { success: true, data: result.data as T, message: result.message };
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, message: error.message };
  }
};

// Auth APIs
export const registerUser = (data: RegisterData) => {
  return apiRequest<{ user: User; token: string }>("/users/register", "POST", data);
};

export const loginUser = (data: LoginData) => {
  return apiRequest<{ user: User; token: string }>("/users/login", "POST", data);
};

export const getCurrentUser = () => {
  return apiRequest<User>("/users/me");
};

// Item APIs
export const createItem = (itemData: ItemData) => {
  return apiRequest<Item>("/items", "POST", itemData);
};

export const getItems = (query: string = "") => {
  return apiRequest<Item[]>(`/items${query}`);
};

export const getItem = (id: string) => {
  return apiRequest<Item>(`/items/${id}`);
};

export const updateItem = (id: string, itemData: Partial<ItemData>) => {
  return apiRequest<Item>(`/items/${id}`, "PUT", itemData);
};

export const deleteItem = (id: string) => {
  return apiRequest(`/items/${id}`, "DELETE");
};

export const getUserItems = (userId: string) => {
  return apiRequest<Item[]>(`/users/${userId}/items`);
};

// Upload image
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const headers = {
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    const result = await response.json();
    return result.data.url;
  } catch (error: any) {
    toast({
      title: "Upload Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getUserItems,
  uploadImage,
};
