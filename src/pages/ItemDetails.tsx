import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getItem, Item } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await getItem(id);
        
        if (response.success && response.data) {
          setItem(response.data);
          
          // Check if current user is the owner
          const userId = localStorage.getItem("userId");
          if (userId && response.data.owner && response.data.owner._id === userId) {
            setIsOwner(true);
          }
        } else {
          toast({
            title: "Error",
            description: "Item not found",
            variant: "destructive",
          });
          navigate("/browse");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast({
          title: "Error",
          description: "Failed to load item details",
          variant: "destructive",
        });
        navigate("/browse");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handlePrevImage = () => {
    if (!item || !item.images || item.images.length === 0) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!item || !item.images || item.images.length === 0) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDeleteItem = async () => {
    // Placeholder for delete functionality
    toast({
      title: "Delete Item",
      description: "This feature is not implemented yet",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-swapspace-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading item details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for might have been removed or doesn't exist.</p>
            <Button asChild>
              <Link to="/browse">Browse Other Items</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = item?.images || [];
  const currentImage = images.length > 0 ? images[currentImageIndex] : '/placeholder.svg';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Item Images */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={currentImage}
                    alt={item?.title || 'Item image'}
                    className="w-full h-full object-contain"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        aria-label="Previous image"
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        aria-label="Next image"
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex overflow-x-auto p-4 space-x-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                          index === currentImageIndex ? "ring-2 ring-swapspace-primary" : ""
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${item?.title || 'Item'} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{item?.description || 'No description available'}</p>
              </div>

              {item?.lookingFor && (
                <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
                  <h2 className="text-xl font-semibold mb-4">Looking For</h2>
                  <p className="text-gray-700">{item.lookingFor}</p>
                </div>
              )}
            </div>

            {/* Item Details & Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold mb-2">{item?.title || 'Item'}</h1>
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="secondary">{item?.category || 'Uncategorized'}</Badge>
                    <Badge variant="outline">{item?.condition || 'Unknown'}</Badge>
                  </div>

                  <div className="border-t border-b py-4 my-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-swapspace-primary bg-opacity-10 rounded-full flex items-center justify-center text-swapspace-primary">
                        {item?.owner?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{item?.owner?.name || 'Unknown Owner'}</p>
                        <p className="text-sm text-gray-500">
                          {item?.createdAt ? `Listed on ${formatDate(item.createdAt)}` : 'Recently listed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {item?.location && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium">{item.location}</p>
                    </div>
                  )}

                  {isOwner ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        asChild
                      >
                        <Link to={`/items/${item?._id}/edit`}>Edit Item</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleDeleteItem}
                      >
                        Delete Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-swapspace-primary hover:bg-green-600"
                      >
                        Offer a Swap
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        Message Owner
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full"
                      >
                        Save to Favorites
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Safety Tips</h2>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-swapspace-primary mt-0.5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Meet in a public place for exchanges
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-swapspace-primary mt-0.5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Inspect items thoroughly before swapping
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-swapspace-primary mt-0.5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Use the in-app messaging to arrange details
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-swapspace-primary mt-0.5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Report any suspicious activity
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">Similar items will be shown here</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetails;
