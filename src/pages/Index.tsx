
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { getItems, Item } from "@/services/api";

const Index = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setIsLoading(true);
        const response = await getItems("?limit=4");
        if (response.success && response.data) {
          setFeaturedItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const categories = [
    { name: "Electronics", icon: "💻" },
    { name: "Clothing", icon: "👕" },
    { name: "Home & Garden", icon: "🏡" },
    { name: "Sports", icon: "⚽" },
    { name: "Books", icon: "📚" },
    { name: "Toys", icon: "🧸" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800">
                Trade Items, <span className="text-swapspace-primary">Not Money</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Join SwapSpace and be part of a community that exchanges goods sustainably. 
                List items you don't need and find things you want through direct swaps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-swapspace-primary hover:bg-green-600 text-white font-semibold py-6 px-8 rounded-md text-lg shadow-md"
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-swapspace-primary text-swapspace-primary hover:bg-swapspace-primary hover:text-white font-semibold py-6 px-8 rounded-md text-lg"
                  asChild
                >
                  <Link to="/browse">Browse Items</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-white p-4 rounded-lg shadow-xl transform rotate-3 animate-bounce-light">
                  <img 
                    src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Swap items" 
                    className="rounded-md w-full h-64 object-cover" 
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-xl transform -rotate-3 absolute top-10 left-10">
                  <img 
                    src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Sustainable trading" 
                    className="rounded-md w-48 h-48 object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SwapSpace Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">List Your Items</h3>
              <p className="text-gray-600">
                Take photos and describe items you no longer need but others might value.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Potential Swaps</h3>
              <p className="text-gray-600">
                Browse through available items or get matched with items you're interested in.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Make the Exchange</h3>
              <p className="text-gray-600">
                Connect with the other user and arrange a swap that works for both of you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Items</h2>
            <Link to="/browse" className="text-swapspace-primary hover:text-green-600 font-medium">
              View All →
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2 w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2 w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded-md w-1/4"></div>
                </div>
              ))}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
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
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No items available yet.</p>
              <Button asChild>
                <Link to="/signup">Join and add the first item!</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/browse?category=${category.name}`} 
                className="bg-white border border-gray-200 rounded-lg p-4 text-center transition-all hover:border-swapspace-primary hover:shadow-md"
              >
                <span className="text-3xl mb-2 block">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="py-16 bg-swapspace-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Be part of the sustainable trading movement. Sign up today and start swapping!
          </p>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-swapspace-primary font-semibold py-2 px-8 rounded-md text-lg"
            asChild
          >
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
