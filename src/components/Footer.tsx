
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-swapspace-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-swapspace-primary">SwapSpace</span>
            </div>
            <p className="text-gray-600 mb-4">
              Revolutionizing the way people exchange goods without using money, promoting sustainable living and community engagement.
            </p>
            <p className="text-gray-600">© {new Date().getFullYear()} SwapSpace. All rights reserved.</p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Discover</h3>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-gray-600 hover:text-swapspace-primary">Browse Items</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-swapspace-primary">How It Works</Link></li>
              <li><Link to="/success-stories" className="text-gray-600 hover:text-swapspace-primary">Success Stories</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-swapspace-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-swapspace-primary">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-swapspace-primary">Careers</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-swapspace-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-swapspace-primary">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-swapspace-primary">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
