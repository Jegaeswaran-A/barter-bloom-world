
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { getUserItems, getCurrentUser, Item, User } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        // Get current user
        const userResponse = await getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          
          // Get user's items
          const userId = localStorage.getItem("userId");
          if (userId) {
            const itemsResponse = await getUserItems(userId);
            if (itemsResponse.success && itemsResponse.data) {
              setUserItems(itemsResponse.data);
            }
          }
        } else {
          // Token invalid
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-swapspace-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-swapspace-primary bg-opacity-10 rounded-full flex items-center justify-center text-2xl text-swapspace-primary mb-4">
                      {user?.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-gray-500 text-sm mb-6">{user?.email}</p>
                    
                    <div className="w-full space-y-3">
                      <Button 
                        className="w-full bg-swapspace-primary hover:bg-green-600"
                        asChild
                      >
                        <Link to="/add-item">Add New Item</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <Link to="/profile">Edit Profile</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-medium mb-3">Dashboard Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/dashboard" className="text-swapspace-primary font-medium">
                          My Items
                        </Link>
                      </li>
                      <li>
                        <Link to="/browse" className="text-gray-600 hover:text-swapspace-primary">
                          Browse All Items
                        </Link>
                      </li>
                      <li>
                        <Link to="/messages" className="text-gray-600 hover:text-swapspace-primary">
                          Messages
                        </Link>
                      </li>
                      <li>
                        <Link to="/notifications" className="text-gray-600 hover:text-swapspace-primary">
                          Notifications
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings" className="text-gray-600 hover:text-swapspace-primary">
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">Manage your items, view requests, and update your profile.</p>
              </div>

              <Tabs defaultValue="my-items">
                <TabsList className="mb-6">
                  <TabsTrigger value="my-items">My Items</TabsTrigger>
                  <TabsTrigger value="swap-requests">Swap Requests</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>

                <TabsContent value="my-items" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Items</h2>
                    <Button asChild>
                      <Link to="/add-item">Add New Item</Link>
                    </Button>
                  </div>

                  {userItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userItems.map((item) => (
                        <ItemCard
                          key={item._id}
                          id={item._id}
                          title={item.title}
                          description={item.description}
                          image={item.images[0]}
                          category={item.category}
                          condition={item.condition}
                          ownerId={item.owner._id}
                          ownerName={item.owner.name}
                          createdAt={item.createdAt}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">You haven't listed any items yet</h3>
                      <p className="text-gray-500 mb-6">Start sharing items you don't need anymore with others.</p>
                      <Button asChild>
                        <Link to="/add-item">Add Your First Item</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="swap-requests" className="space-y-6">
                  <h2 className="text-xl font-semibold">Swap Requests</h2>
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No swap requests yet</h3>
                    <p className="text-gray-500">When someone requests to swap with your items, you'll see them here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="space-y-6">
                  <h2 className="text-xl font-semibold">Favorite Items</h2>
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No favorite items yet</h3>
                    <p className="text-gray-500 mb-6">Save items you're interested in to keep track of them.</p>
                    <Button asChild variant="outline">
                      <Link to="/browse">Browse Items</Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
