
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createItem, uploadImage } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AddItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add an item",
          variant: "destructive",
        });
        navigate("/signin");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (selectedFiles.length > 5) {
        toast({
          title: "Error",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
        });
        return;
      }
      
      setImages(selectedFiles);
      
      // Create previews
      const filePreviewsArray = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(filePreviewsArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !category || !condition) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsUploading(true);
      
      // Upload all images first
      const uploadPromises = images.map(image => uploadImage(image));
      const uploadedImageUrls = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads (null values)
      const validImageUrls = uploadedImageUrls.filter(Boolean) as string[];
      
      if (validImageUrls.length === 0) {
        throw new Error("Failed to upload images");
      }
      
      setIsUploading(false);
      
      // Create item with uploaded image URLs
      const itemData = {
        title,
        description,
        category,
        condition,
        images: validImageUrls,
        lookingFor,
        location,
      };
      
      const response = await createItem(itemData);
      
      if (response.success && response.data) {
        toast({
          title: "Success",
          description: "Your item has been added!",
        });
        
        // Redirect to the item details page
        navigate(`/items/${response.data._id}`);
      }
    } catch (error: any) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Add a New Item</h1>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What are you offering?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about your item, such as brand, size, age, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="resize-none"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={condition}
                      onValueChange={setCondition}
                      required
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((cond) => (
                          <SelectItem key={cond} value={cond}>
                            {cond}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lookingFor">What are you looking to swap for? (Optional)</Label>
                  <Textarea
                    id="lookingFor"
                    placeholder="Describe what you're interested in receiving in return"
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Images *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label htmlFor="images" className="cursor-pointer">
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <div className="rounded-full bg-gray-100 p-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="font-medium text-swapspace-primary">
                            Click to upload images
                          </div>
                          <p className="text-sm text-gray-500">
                            Upload up to 5 images (PNG, JPG, JPEG)
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <button
                              type="button"
                              className="text-white"
                              onClick={() => {
                                const newPreviews = [...previews];
                                const newImages = [...images];
                                newPreviews.splice(index, 1);
                                newImages.splice(index, 1);
                                setPreviews(newPreviews);
                                setImages(newImages);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    className="bg-swapspace-primary hover:bg-green-600 w-full md:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        {isUploading ? "Uploading Images..." : "Adding Item..."}
                        <div className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      "Add Item"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddItem;
