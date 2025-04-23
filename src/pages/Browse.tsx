
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getItems } from "@/services/api";
import { Item } from "@/services/api";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Define ItemCardProps interface to match the props expected by ItemCard component
interface ItemCardProps {
  item: Item;
}

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");

  const categories = [
    "Electronics", 
    "Clothing", 
    "Home & Garden", 
    "Sports & Outdoors", 
    "Books & Media", 
    "Toys & Games",
    "Furniture",
    "Jewelry & Accessories",
    "Art & Collectibles",
    "Music Instruments",
    "Tools & Equipment",
    "Other"
  ];

  const conditions = [
    "New", 
    "Like New", 
    "Good", 
    "Fair", 
    "Poor"
  ];

  const fetchItems = async () => {
    setIsLoading(true);
    
    // Build query string based on filters
    let query = "?";
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (category) query += `category=${encodeURIComponent(category)}&`;
    if (condition) query += `condition=${encodeURIComponent(condition)}&`;
    
    try {
      const response = await getItems(query);
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL params
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (condition) params.set("condition", condition);
    setSearchParams(params);
    
    fetchItems();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setCondition("");
    setSearchParams(new URLSearchParams());
    fetchItems();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Browse Items</h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Search items..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        {conditions.map((cond) => (
                          <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit">Apply Filters</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-t-swapspace-primary border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No items found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or add your own items to swap!</p>
              <Button className="mt-4" onClick={() => window.location.href = "/add-item"}>
                Add an Item
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
