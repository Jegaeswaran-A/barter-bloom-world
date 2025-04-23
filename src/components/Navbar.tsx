
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, LogIn } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-swapspace-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-swapspace-primary">SwapSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${location.pathname === "/" ? "text-swapspace-primary font-bold" : "text-gray-600 hover:text-swapspace-primary"}`}>
            Home
          </Link>
          <Link to="/browse" className={`${location.pathname === "/browse" ? "text-swapspace-primary font-bold" : "text-gray-600 hover:text-swapspace-primary"}`}>
            Browse
          </Link>
          <Link to="/how-it-works" className={`${location.pathname === "/how-it-works" ? "text-swapspace-primary font-bold" : "text-gray-600 hover:text-swapspace-primary"}`}>
            How It Works
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button 
                variant="outline" 
                className="border-swapspace-primary text-swapspace-primary hover:bg-swapspace-primary hover:text-white"
                onClick={() => navigate("/add-item")}
              >
                Add Item
              </Button>
              
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-1"
                  onClick={() => navigate("/dashboard")}
                >
                  <User size={18} />
                  <span>Account</span>
                </Button>
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-swapspace-primary"
                onClick={() => navigate("/signin")}
              >
                <LogIn size={18} className="mr-2" />
                Sign In
              </Button>
              <Button 
                className="bg-swapspace-primary hover:bg-green-600 text-white"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-4 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/browse" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
              Browse
            </Link>
            <Link to="/how-it-works" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
              How It Works
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link to="/add-item" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
                  Add Item
                </Link>
                <Link to="/profile" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="text-gray-600 py-2 text-left hover:text-swapspace-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-gray-600 py-2 hover:text-swapspace-primary" onClick={toggleMenu}>
                  Sign In
                </Link>
                <Link to="/signup" className="bg-swapspace-primary text-white py-2 px-4 rounded-md text-center" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
