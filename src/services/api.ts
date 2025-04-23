import { toast } from "@/components/ui/use-toast";

// Configure API URL based on environment
// In a real production app, you would use environment variables
const API_URL = "http://localhost:5000/api";

// Use mock mode when the actual API is not available (like in Lovable preview)
const MOCK_MODE = true; // Set this to false when you have a real backend running

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

// Mock data for preview/demo purposes
const mockUsers: Record<string, User> = {
  "user1": {
    _id: "user1",
    name: "Demo User",
    email: "demo@example.com",
    createdAt: new Date().toISOString(),
    bio: "This is a demo user for preview purposes",
    location: "Demo City"
  }
};

const mockItems: Record<string, Item> = {
  "item1": {
    _id: "item1",
    title: "MacBook Pro 2023",
    description: "13-inch MacBook Pro with M2 chip, 512GB SSD, Space Gray. Like new condition with original packaging.",
    images: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"],
    category: "Electronics",
    condition: "Like New",
    owner: {
      _id: "user1", 
      name: "Demo User"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lookingFor: "Gaming Laptop or iPad Pro",
    location: "San Francisco"
  },
  "item2": {
    _id: "item2",
    title: "Nike Air Jordan 1 High",
    description: "Size US 10, Chicago colorway. Worn only twice, comes with original box and extra laces.",
    images: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7"],
    category: "Clothing",
    condition: "Good",
    owner: {
      _id: "user1",
      name: "Demo User"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lookingFor: "Adidas Yeezys or other premium sneakers",
    location: "Los Angeles"
  },
  "item3": {
    title: "Sony A7 III Camera",
    _id: "item3",
    description: "Full-frame mirrorless camera with 28-70mm kit lens. Includes 2 batteries, charger, and camera bag.",
    images: ["https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"],
    category: "Electronics",
    condition: "Good",
    owner: {
      _id: "user1",
      name: "Demo User"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lookingFor: "Canon R6 or Fujifilm X-T4",
    location: "New York"
  },
  "item4": {
    _id: "item4",
    title: "Vintage Vinyl Collection",
    description: "Collection of 20 classic rock albums from the 70s and 80s. All in great playing condition.",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475"],
    category: "Books & Media",
    condition: "Good",
    owner: {
      _id: "user1",
      name: "Demo User"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lookingFor: "Modern vinyl records or high-end turntable",
    location: "Chicago"
  },
  "item5": {
    _id: "item5",
    title: "Mechanical Keyboard",
    description: "Custom mechanical keyboard with Cherry MX Blue switches, PBT keycaps, and RGB backlighting.",
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6"],
    category: "Electronics",
    condition: "New",
    owner: {
      _id: "user1",
      name: "Demo User"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lookingFor: "Gaming mouse or audio interface",
    location: "Seattle"
  },
};

let currentUser: User | null = null;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to handle API requests with fallback to mock data
const apiRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<ApiResponse<T>> => {
  if (MOCK_MODE) {
    return handleMockRequest<T>(endpoint, method, data);
  }
  
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
    // Check if error is related to connection issues
    if (error.message.includes("Failed to fetch") || error.message === "Network Error") {
      console.warn("API connection failed. Switching to mock mode.");
      return handleMockRequest<T>(endpoint, method, data);
    }
    
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, message: error.message };
  }
};

// Helper to handle mock requests
const handleMockRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<ApiResponse<T>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Handle different API endpoints with mock data
  if (endpoint === "/users/register" && method === "POST") {
    const { name, email } = data as RegisterData;
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      _id: userId,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    mockUsers[userId] = newUser;
    currentUser = newUser;
    return {
      success: true,
      data: { user: newUser, token: "mock_token_" + userId } as unknown as T,
      message: "Registration successful"
    };
  }

  if (endpoint === "/users/login" && method === "POST") {
    const { email } = data as LoginData;
    const userId = "user1"; // Use default user for demo
    currentUser = mockUsers[userId];
    if (currentUser) {
      return {
        success: true,
        data: { user: currentUser, token: "mock_token_" + userId } as unknown as T,
        message: "Login successful"
      };
    }
    return { success: false, message: "Invalid email or password" };
  }

  if (endpoint === "/users/me" && method === "GET") {
    if (!currentUser) {
      currentUser = mockUsers["user1"]; // Use default user for demo
    }
    return {
      success: true,
      data: currentUser as unknown as T,
      message: "User data retrieved"
    };
  }

  if (endpoint.startsWith("/items") && method === "GET") {
    if (endpoint === "/items") {
      const itemsArray = Object.values(mockItems);
      return {
        success: true,
        data: itemsArray as unknown as T,
        message: "Items retrieved successfully"
      };
    }

    // Handle single item get
    const itemId = endpoint.split("/").pop();
    if (itemId && mockItems[itemId]) {
      return {
        success: true,
        data: mockItems[itemId] as unknown as T,
        message: "Item retrieved successfully"
      };
    }
  }

  if (endpoint === "/items" && method === "POST") {
    const itemData = data as ItemData;
    const itemId = `item_${Date.now()}`;
    
    if (!currentUser) {
      currentUser = mockUsers["user1"]; // Use default user for demo
    }
    
    const newItem: Item = {
      _id: itemId,
      ...itemData,
      owner: {
        _id: currentUser._id,
        name: currentUser.name
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockItems[itemId] = newItem;
    return {
      success: true,
      data: newItem as unknown as T,
      message: "Item created successfully"
    };
  }

  // Default response if no specific mock handler exists
  return {
    success: true,
    data: {} as T,
    message: "Mock request processed successfully"
  };
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
  if (MOCK_MODE) {
    // In mock mode, just return a placeholder image URL
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
    return "/placeholder.svg";
  }
  
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
